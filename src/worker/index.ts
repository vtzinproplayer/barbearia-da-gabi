import { Hono, type Context } from 'hono'
import { deleteCookie, getCookie, setCookie } from 'hono/cookie'

import {
  CLOSING_MINUTES,
  SLOT_TIMES,
  isOpenDate,
  serviceById,
  timeToMinutes,
} from '../shared/services'

type Env = {
  ASSETS: Fetcher
  DB: D1Database
  OWNER_USERNAME?: string
  OWNER_PASSWORD?: string
}

type Role = 'client' | 'owner'

type AuthUser = {
  id: string
  username: string
  name: string
  phone: string
  role: Role
  createdAt: string
}

type Variables = { user: AuthUser | null }
type AppContext = Context<{ Bindings: Env; Variables: Variables }>

const app = new Hono<{ Bindings: Env; Variables: Variables }>()

const COOKIE_NAME = 'bg_session'
const SESSION_DAYS = 30
const encoder = new TextEncoder()

let schemaPromise: Promise<void> | null = null

const SCHEMA = [
  `CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    username TEXT NOT NULL COLLATE NOCASE UNIQUE,
    name TEXT NOT NULL,
    phone TEXT NOT NULL DEFAULT '',
    password_hash TEXT NOT NULL,
    password_salt TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'client' CHECK (role IN ('client', 'owner')),
    created_at TEXT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS sessions (
    token_hash TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    expires_at TEXT NOT NULL,
    created_at TEXT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS appointments (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    service_id TEXT NOT NULL,
    date TEXT NOT NULL,
    time TEXT NOT NULL,
    end_time TEXT NOT NULL,
    duration INTEGER NOT NULL,
    notes TEXT NOT NULL DEFAULT '',
    status TEXT NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente', 'confirmado', 'concluido', 'cancelado')),
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  )`,
  `CREATE UNIQUE INDEX IF NOT EXISTS appointments_slot_unique
    ON appointments (date, time) WHERE status <> 'cancelado'`,
  `CREATE INDEX IF NOT EXISTS appointments_date_index ON appointments (date, time)`,
  `CREATE INDEX IF NOT EXISTS appointments_user_index ON appointments (user_id, date)`,
  `CREATE INDEX IF NOT EXISTS sessions_user_index ON sessions (user_id)`,
]

const APPOINTMENT_COLUMNS = `
  a.id,
  a.service_id AS serviceId,
  a.date,
  a.time,
  a.end_time AS endTime,
  a.duration,
  a.notes,
  a.status,
  a.created_at AS createdAt,
  a.updated_at AS updatedAt
`

function nowIso(): string {
  return new Date().toISOString()
}

function clean(value: unknown): string {
  return typeof value === 'string' ? value.trim() : ''
}

async function readJson(c: AppContext): Promise<Record<string, unknown>> {
  return await c.req.json<Record<string, unknown>>().catch(() => ({}))
}

function toHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('')
}

function randomToken(bytes = 32): string {
  const data = crypto.getRandomValues(new Uint8Array(bytes))
  let binary = ''
  for (const byte of data) binary += String.fromCharCode(byte)
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '')
}

async function sha256(value: string): Promise<string> {
  return toHex(await crypto.subtle.digest('SHA-256', encoder.encode(value)))
}

async function hashPassword(password: string, salt: string): Promise<string> {
  const key = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits'])
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt: encoder.encode(salt), iterations: 120_000, hash: 'SHA-256' },
    key,
    256,
  )
  return toHex(bits)
}

function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let result = 0
  for (let index = 0; index < a.length; index += 1) {
    result |= a.charCodeAt(index) ^ b.charCodeAt(index)
  }
  return result === 0
}

function lisbonNow(): { date: string; minutes: number } {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Lisbon',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(new Date())
  const get = (type: string) => parts.find((part) => part.type === type)?.value ?? '00'
  const hour = Number(get('hour')) % 24
  return {
    date: `${get('year')}-${get('month')}-${get('day')}`,
    minutes: hour * 60 + Number(get('minute')),
  }
}

function toAuthUser(row: {
  id: string
  username: string
  name: string
  phone: string
  role: string
  createdAt: string
}): AuthUser {
  return {
    id: row.id,
    username: row.username,
    name: row.name,
    phone: row.phone,
    role: row.role === 'owner' ? 'owner' : 'client',
    createdAt: row.createdAt,
  }
}

async function ensureSchema(env: Env): Promise<void> {
  if (!schemaPromise) {
    schemaPromise = (async () => {
      await env.DB.batch(SCHEMA.map((statement) => env.DB.prepare(statement)))

      const owner = await env.DB.prepare("SELECT id FROM users WHERE role = 'owner' LIMIT 1").first()
      if (owner) return

      const username = (env.OWNER_USERNAME || 'gabi').trim().toLowerCase()
      const password = env.OWNER_PASSWORD || 'barbearia2026'
      const salt = randomToken(16)
      const hash = await hashPassword(password, salt)

      await env.DB.prepare(
        `INSERT OR IGNORE INTO users
          (id, username, name, phone, password_hash, password_salt, role, created_at)
         VALUES (?, ?, ?, ?, ?, ?, 'owner', ?)`,
      )
        .bind('owner', username, 'Gabi', '', hash, salt, nowIso())
        .run()
    })().catch((error) => {
      schemaPromise = null
      throw error
    })
  }
  return schemaPromise
}

async function createSession(c: AppContext, userId: string): Promise<void> {
  const token = randomToken(32)
  const tokenHash = await sha256(token)
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 86_400_000).toISOString()

  await c.env.DB.prepare('DELETE FROM sessions WHERE expires_at < ?').bind(nowIso()).run()
  await c.env.DB.prepare(
    'INSERT INTO sessions (token_hash, user_id, expires_at, created_at) VALUES (?, ?, ?, ?)',
  )
    .bind(tokenHash, userId, expiresAt, nowIso())
    .run()

  setCookie(c, COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'Lax',
    secure: new URL(c.req.url).protocol === 'https:',
    path: '/',
    maxAge: SESSION_DAYS * 86_400,
  })
}

function isValidTimeSlot(time: string): boolean {
  return SLOT_TIMES.includes(time)
}

const appPromise = async (env: Env) => {
  await ensureSchema(env)
  return env
}

app.use('/api/*', async (c, next) => {
  c.header('Cache-Control', 'no-store')

  if (c.req.method !== 'GET' && c.req.method !== 'HEAD') {
    const origin = c.req.header('origin')
    if (origin) {
      try {
        if (new URL(origin).host !== new URL(c.req.url).host) {
          return c.json({ error: 'Origem não permitida.' }, 403)
        }
      } catch {
        return c.json({ error: 'Origem inválida.' }, 403)
      }
    }
  }

  if (c.req.path === '/api/health') {
    await next()
    return
  }

  await appPromise(c.env)

  const token = getCookie(c, COOKIE_NAME)
  if (token) {
    const row = await c.env.DB.prepare(
      `SELECT u.id, u.username, u.name, u.phone, u.role, u.created_at AS createdAt
       FROM sessions s
       JOIN users u ON u.id = s.user_id
       WHERE s.token_hash = ? AND s.expires_at > ?
       LIMIT 1`,
    )
      .bind(await sha256(token), nowIso())
      .first<{
        id: string
        username: string
        name: string
        phone: string
        role: string
        createdAt: string
      }>()
    c.set('user', row ? toAuthUser(row) : null)
  } else {
    c.set('user', null)
  }

  await next()
})

app.get('/api/health', (c) => c.json({ ok: true, app: 'barbearia-da-gabi' }))

app.get('/api/auth/me', (c) => c.json({ user: c.get('user') }))

app.post('/api/auth/register', async (c) => {
  const data = await readJson(c)
  const username = clean(data.username).toLowerCase()
  const name = clean(data.name).replace(/\s+/g, ' ')
  const password = typeof data.password === 'string' ? data.password : ''

  if (!/^[a-z0-9._-]{3,20}$/.test(username)) {
    return c.json(
      { error: 'O nome de utilizador deve ter entre 3 e 20 caracteres: letras, números, ponto, hífen ou _.' },
      400,
    )
  }
  if (name.length < 2 || name.length > 40) {
    return c.json({ error: 'Indique o seu nome (entre 2 e 40 caracteres).' }, 400)
  }
  if (password.length < 6 || password.length > 72) {
    return c.json({ error: 'A palavra-passe deve ter entre 6 e 72 caracteres.' }, 400)
  }

  const existing = await c.env.DB.prepare('SELECT id FROM users WHERE username = ? LIMIT 1')
    .bind(username)
    .first()
  if (existing) {
    return c.json({ error: 'Este nome de utilizador já está em uso. Escolha outro.' }, 409)
  }

  const id = crypto.randomUUID()
  const salt = randomToken(16)
  const hash = await hashPassword(password, salt)
  const createdAt = nowIso()

  await c.env.DB.prepare(
    `INSERT INTO users (id, username, name, phone, password_hash, password_salt, role, created_at)
     VALUES (?, ?, ?, '', ?, ?, 'client', ?)`,
  )
    .bind(id, username, name, hash, salt, createdAt)
    .run()

  await createSession(c, id)

  return c.json(
    {
      user: {
        id,
        username,
        name,
        phone: '',
        role: 'client',
        createdAt,
      },
    },
    201,
  )
})

app.post('/api/auth/login', async (c) => {
  const data = await readJson(c)
  const username = clean(data.username).toLowerCase()
  const password = typeof data.password === 'string' ? data.password : ''

  if (!username || !password) {
    return c.json({ error: 'Indique o nome de utilizador e a palavra-passe.' }, 400)
  }

  const row = await c.env.DB.prepare(
    `SELECT id, username, name, phone, role, created_at AS createdAt,
            password_hash AS passwordHash, password_salt AS passwordSalt
     FROM users WHERE username = ? LIMIT 1`,
  )
    .bind(username)
    .first<{
      id: string
      username: string
      name: string
      phone: string
      role: string
      createdAt: string
      passwordHash: string
      passwordSalt: string
    }>()

  if (!row) {
    return c.json({ error: 'Nome de utilizador ou palavra-passe incorretos.' }, 401)
  }

  const hash = await hashPassword(password, row.passwordSalt)
  if (!constantTimeEqual(hash, row.passwordHash)) {
    return c.json({ error: 'Nome de utilizador ou palavra-passe incorretos.' }, 401)
  }

  await createSession(c, row.id)

  return c.json({ user: toAuthUser(row) })
})

app.post('/api/auth/logout', async (c) => {
  const token = getCookie(c, COOKIE_NAME)
  if (token) {
    await c.env.DB.prepare('DELETE FROM sessions WHERE token_hash = ?').bind(await sha256(token)).run()
  }
  deleteCookie(c, COOKIE_NAME, { path: '/' })
  return c.json({ ok: true })
})

app.get('/api/availability', async (c) => {
  const date = c.req.query('date') ?? ''
  const serviceId = c.req.query('service') ?? ''
  const service = serviceById(serviceId)

  if (!service) return c.json({ error: 'Serviço inválido.' }, 400)
  if (!isOpenDate(date)) return c.json({ date, closed: true, slots: [] })

  const rows = await c.env.DB.prepare(
    `SELECT time, end_time AS endTime FROM appointments
     WHERE date = ? AND status <> 'cancelado'`,
  )
    .bind(date)
    .all<{ time: string; endTime: string }>()

  const booked = rows.results ?? []
  const now = lisbonNow()

  const slots = SLOT_TIMES.map((time) => {
    const start = timeToMinutes(time)
    const end = start + service.duration
    const tooLate = end > CLOSING_MINUTES
    const past = date < now.date || (date === now.date && start <= now.minutes)
    const overlaps = booked.some(
      (appointment) =>
        timeToMinutes(appointment.time) < end && timeToMinutes(appointment.endTime) > start,
    )
    return { time, available: !tooLate && !past && !overlaps }
  })

  return c.json({ date, closed: false, slots })
})

app.post('/api/appointments', async (c) => {
  const user = c.get('user')
  if (!user) return c.json({ error: 'Inicie sessão para marcar um horário.' }, 401)

  const data = await readJson(c)
  const serviceId = clean(data.serviceId)
  const date = clean(data.date)
  const time = clean(data.time)
  const notes = clean(data.notes).slice(0, 300)
  const service = serviceById(serviceId)

  if (!service) return c.json({ error: 'Escolha um serviço válido.' }, 400)
  if (!isOpenDate(date)) return c.json({ error: 'A barbearia não abre nesse dia.' }, 400)
  if (!isValidTimeSlot(time)) return c.json({ error: 'Escolha um horário válido.' }, 400)

  const start = timeToMinutes(time)
  const endTime = `${String(Math.floor((start + service.duration) / 60)).padStart(2, '0')}:${String(
    (start + service.duration) % 60,
  ).padStart(2, '0')}`

  if (start + service.duration > CLOSING_MINUTES) {
    return c.json({ error: 'Esse serviço não termina dentro do horário de funcionamento.' }, 400)
  }

  const now = lisbonNow()
  if (date < now.date || (date === now.date && start <= now.minutes)) {
    return c.json({ error: 'Esse horário já passou. Escolha outro.' }, 400)
  }

  const id = crypto.randomUUID()
  const timestamp = nowIso()

  try {
    const result = await c.env.DB.prepare(
      `INSERT INTO appointments
        (id, user_id, service_id, date, time, end_time, duration, notes, status, created_at, updated_at)
       SELECT ?, ?, ?, ?, ?, ?, ?, ?, 'pendente', ?, ?
       WHERE NOT EXISTS (
         SELECT 1 FROM appointments
         WHERE date = ? AND status <> 'cancelado' AND time < ? AND end_time > ?
       )`,
    )
      .bind(
        id,
        user.id,
        serviceId,
        date,
        time,
        endTime,
        service.duration,
        notes,
        timestamp,
        timestamp,
        date,
        endTime,
        time,
      )
      .run()

    if ((result.meta?.changes ?? 0) === 0) {
      return c.json({ error: 'Esse horário acabou de ser reservado. Escolha outro.' }, 409)
    }
  } catch {
    return c.json({ error: 'Esse horário acabou de ser reservado. Escolha outro.' }, 409)
  }

  return c.json(
    {
      appointment: {
        id,
        serviceId,
        date,
        time,
        endTime,
        duration: service.duration,
        notes,
        status: 'pendente',
        createdAt: timestamp,
        updatedAt: timestamp,
      },
    },
    201,
  )
})

app.get('/api/appointments/mine', async (c) => {
  const user = c.get('user')
  if (!user) return c.json({ error: 'Inicie sessão para ver as suas marcações.' }, 401)

  const rows = await c.env.DB.prepare(
    `SELECT ${APPOINTMENT_COLUMNS}
     FROM appointments a
     WHERE a.user_id = ?
     ORDER BY a.date ASC, a.time ASC`,
  )
    .bind(user.id)
    .all()

  return c.json({ appointments: rows.results ?? [] })
})

app.patch('/api/appointments/:id/cancel', async (c) => {
  const user = c.get('user')
  if (!user) return c.json({ error: 'Inicie sessão para cancelar a marcação.' }, 401)

  const id = c.req.param('id')
  const row = await c.env.DB.prepare(
    'SELECT id, date, time, status FROM appointments WHERE id = ? AND user_id = ? LIMIT 1',
  )
    .bind(id, user.id)
    .first<{ id: string; date: string; time: string; status: string }>()

  if (!row) return c.json({ error: 'Marcação não encontrada.' }, 404)
  if (row.status === 'cancelado') return c.json({ error: 'Esta marcação já está cancelada.' }, 409)
  if (row.status === 'concluido') return c.json({ error: 'Esta marcação já foi concluída.' }, 409)

  const now = lisbonNow()
  if (row.date < now.date || (row.date === now.date && timeToMinutes(row.time) <= now.minutes)) {
    return c.json({ error: 'Esta marcação já passou.' }, 409)
  }

  const updatedAt = nowIso()
  await c.env.DB.prepare(
    "UPDATE appointments SET status = 'cancelado', updated_at = ? WHERE id = ? AND user_id = ?",
  )
    .bind(updatedAt, id, user.id)
    .run()

  const updated = await c.env.DB.prepare(
    `SELECT ${APPOINTMENT_COLUMNS} FROM appointments a WHERE a.id = ?`,
  )
    .bind(id)
    .first()

  return c.json({ appointment: updated })
})

app.get('/api/admin/appointments', async (c) => {
  const user = c.get('user')
  if (!user) return c.json({ error: 'Inicie sessão para abrir o painel.' }, 401)
  if (user.role !== 'owner') return c.json({ error: 'Sem permissão para abrir este painel.' }, 403)

  const rows = await c.env.DB.prepare(
    `SELECT ${APPOINTMENT_COLUMNS},
            u.name AS clientName,
            u.username AS clientUsername,
            u.phone AS clientPhone
     FROM appointments a
     JOIN users u ON u.id = a.user_id
     ORDER BY a.date ASC, a.time ASC
     LIMIT 1000`,
  ).all()

  return c.json({ appointments: rows.results ?? [] })
})

app.patch('/api/admin/appointments/:id', async (c) => {
  const user = c.get('user')
  if (!user) return c.json({ error: 'Inicie sessão para abrir o painel.' }, 401)
  if (user.role !== 'owner') return c.json({ error: 'Sem permissão para gerir marcações.' }, 403)

  const id = c.req.param('id')
  const data = await readJson(c)
  const status = clean(data.status)

  if (!['confirmado', 'concluido', 'cancelado'].includes(status)) {
    return c.json({ error: 'Estado inválido.' }, 400)
  }

  const row = await c.env.DB.prepare('SELECT id, status FROM appointments WHERE id = ? LIMIT 1')
    .bind(id)
    .first<{ id: string; status: string }>()

  if (!row) return c.json({ error: 'Marcação não encontrada.' }, 404)

  const allowed: Record<string, string[]> = {
    pendente: ['confirmado', 'cancelado'],
    confirmado: ['concluido', 'cancelado'],
  }

  if (!allowed[row.status]?.includes(status)) {
    return c.json({ error: 'Esta alteração de estado não é permitida.' }, 409)
  }

  try {
    await c.env.DB.prepare('UPDATE appointments SET status = ?, updated_at = ? WHERE id = ?')
      .bind(status, nowIso(), id)
      .run()
  } catch {
    return c.json({ error: 'Não foi possível atualizar esta marcação.' }, 409)
  }

  const updated = await c.env.DB.prepare(
    `SELECT ${APPOINTMENT_COLUMNS},
            u.name AS clientName,
            u.username AS clientUsername,
            u.phone AS clientPhone
     FROM appointments a
     JOIN users u ON u.id = a.user_id
     WHERE a.id = ?`,
  )
    .bind(id)
    .first()

  return c.json({ appointment: updated })
})

app.patch('/api/account/password', async (c) => {
  const user = c.get('user')
  if (!user) return c.json({ error: 'Inicie sessão para alterar a palavra-passe.' }, 401)

  const data = await readJson(c)
  const currentPassword = typeof data.currentPassword === 'string' ? data.currentPassword : ''
  const newPassword = typeof data.newPassword === 'string' ? data.newPassword : ''

  if (newPassword.length < 6 || newPassword.length > 72) {
    return c.json({ error: 'A nova palavra-passe deve ter entre 6 e 72 caracteres.' }, 400)
  }

  const row = await c.env.DB.prepare(
    'SELECT password_hash AS passwordHash, password_salt AS passwordSalt FROM users WHERE id = ?',
  )
    .bind(user.id)
    .first<{ passwordHash: string; passwordSalt: string }>()

  if (!row) return c.json({ error: 'Conta não encontrada.' }, 404)

  const currentHash = await hashPassword(currentPassword, row.passwordSalt)
  if (!constantTimeEqual(currentHash, row.passwordHash)) {
    return c.json({ error: 'A palavra-passe atual não está correta.' }, 401)
  }

  const salt = randomToken(16)
  const hash = await hashPassword(newPassword, salt)

  await c.env.DB.prepare(
    'UPDATE users SET password_hash = ?, password_salt = ? WHERE id = ?',
  )
    .bind(hash, salt, user.id)
    .run()
  await c.env.DB.prepare('DELETE FROM sessions WHERE user_id = ?').bind(user.id).run()

  await createSession(c, user.id)

  return c.json({ ok: true })
})

app.all('/api/*', (c) => c.json({ error: 'Rota não encontrada.' }, 404))

app.onError((error, c) => {
  console.error('API error:', error)
  return c.json({ error: 'Ocorreu um erro inesperado. Tente novamente.' }, 500)
})

app.all('*', (c) => c.env.ASSETS.fetch(c.req.raw))

export default app

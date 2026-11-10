import {
  ArrowUpRight,
  CalendarDays,
  Check,
  Clock,
  Euro,
  Loader2,
  LogOut,
  Phone,
  RefreshCw,
  Search,
  ShieldCheck,
  UserRound,
  Users,
  X,
} from 'lucide-react'
import { useCallback, useEffect, useMemo, useState, type ComponentType, type FormEvent } from 'react'

import { Button } from '../components/Button'
import { Container } from '../components/Container'
import { Field } from '../components/Field'
import { Logo, LogoMark } from '../components/Logo'
import { Modal } from '../components/Modal'
import { PageLoader } from '../components/PageLoader'
import { StatusPill } from '../components/StatusPill'
import { Toast, useToast } from '../components/Toast'
import { ApiError, api, type Appointment, type AppointmentStatus } from '../lib/api'
import { useAuth } from '../lib/auth'
import { cx } from '../lib/cx'
import {
  dayNumber,
  formatDateTime,
  formatDuration,
  formatLongDate,
  formatPrice,
  greeting,
  nextOpenDays,
  relativeDay,
  todayISO,
  todayLabel,
} from '../lib/format'
import { Link, navigate } from '../lib/router'
import { serviceById } from '../shared/services'

type StatusFilter = 'todos' | AppointmentStatus

const STATUS_TABS: { id: StatusFilter; label: string }[] = [
  { id: 'todos', label: 'Todos' },
  { id: 'pendente', label: 'A confirmar' },
  { id: 'confirmado', label: 'Confirmados' },
  { id: 'concluido', label: 'Concluídos' },
  { id: 'cancelado', label: 'Cancelados' },
]

function AdminAccess({ signedIn, onLogout }: { signedIn: boolean; onLogout: () => void }) {
  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden px-6">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/3 size-[460px] -translate-x-1/2 rounded-full bg-wine/15 blur-[130px]" />
        <div className="absolute inset-0 grain" />
      </div>
      <div className="relative max-w-sm text-center">
        <LogoMark className="mx-auto size-14" />
        <p className="mt-6 text-[9px] uppercase tracking-[0.32em] text-gold/80">Painel privado</p>
        <h1 className="mt-4 font-serif text-[44px] font-light leading-[1.02]">
          {signedIn ? (
            <>
              Esta área é <em className="italic text-gold">da Gabi.</em>
            </>
          ) : (
            <>
              A agenda está <em className="italic text-gold">à sua espera.</em>
            </>
          )}
        </h1>
        <p className="mt-4 text-[13px] leading-relaxed text-muted">
          {signedIn
            ? 'A sua conta não tem acesso ao painel. Pode voltar à sua área de cliente.'
            : 'Entre com a conta da Gabi para ver e gerir as marcações.'}
        </p>
        <div className="mt-7 flex flex-col justify-center gap-2 sm:flex-row">
          {signedIn ? (
            <Button href="/conta" size="lg">
              Ir para a minha conta
            </Button>
          ) : (
            <Button href="/entrar?next=%2Fpainel" size="lg">
              Entrar no painel
            </Button>
          )}
          {signedIn && (
            <Button variant="outline" size="lg" onClick={onLogout}>
              Terminar sessão
            </Button>
          )}
        </div>
        <Link
          href="/"
          className="mt-5 inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.18em] text-faint transition-colors hover:text-gold"
        >
          Voltar ao site
          <ArrowUpRight className="size-3" />
        </Link>
      </div>
    </main>
  )
}

function AppointmentCard({
  appointment,
  busy,
  onStatus,
  onCancel,
}: {
  appointment: Appointment
  busy: boolean
  onStatus: (status: AppointmentStatus) => void
  onCancel: () => void
}) {
  const service = serviceById(appointment.serviceId)
  const active = appointment.status === 'pendente' || appointment.status === 'confirmado'

  return (
    <div className="group grid gap-4 rounded-2xl border border-line bg-surface/55 p-4 transition-colors duration-300 hover:border-gold/25 sm:p-5 md:grid-cols-[82px_1fr_auto] md:items-start">
      <div className="flex items-center gap-3 md:flex-col md:items-start md:gap-1 md:border-r md:border-line md:pr-4">
        <span className="font-serif text-[28px] leading-none text-fg sm:text-[31px]">{appointment.time}</span>
        <span className="text-[9px] uppercase tracking-[0.14em] text-faint">
          {formatDuration(appointment.duration)}
        </span>
        <span className="hidden text-[9px] text-faint md:block">até {appointment.endTime}</span>
      </div>

      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2.5">
          <h3 className="font-serif text-[21px] leading-tight text-fg">{service?.name ?? appointment.serviceId}</h3>
          <StatusPill status={appointment.status} />
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11.5px] text-muted">
          <span className="inline-flex items-center gap-1.5">
            <UserRound className="size-3 text-gold/60" />
            {appointment.clientName}
            <span className="text-faint">@{appointment.clientUsername}</span>
          </span>
          {appointment.clientPhone && (
            <a
              href={`tel:${appointment.clientPhone.replace(/\s+/g, '')}`}
              className="inline-flex items-center gap-1.5 text-muted transition-colors hover:text-gold"
            >
              <Phone className="size-3 text-gold/60" />
              {appointment.clientPhone}
            </a>
          )}
        </div>

        {appointment.notes && (
          <p className="mt-2 rounded-lg border border-line/80 bg-white/[0.02] px-3 py-2 text-[11px] leading-relaxed text-muted">
            <span className="italic">“{appointment.notes}”</span>
          </p>
        )}

        <p className="mt-2 text-[9.5px] text-faint">Pedido em {formatDateTime(appointment.createdAt)}</p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 md:flex-col md:items-end md:justify-start">
        <span className="font-serif text-[19px] leading-none text-gold-soft">
          {formatPrice(service?.price ?? 0)}
        </span>

        {active ? (
          <div className="flex items-center gap-1.5">
            {appointment.status === 'pendente' && (
              <button
                type="button"
                onClick={() => onStatus('confirmado')}
                disabled={busy}
                className="inline-flex h-8 items-center gap-1.5 rounded-full border border-gold/35 bg-gold/10 px-3 text-[9px] uppercase tracking-[0.14em] text-gold transition-colors hover:bg-gold/20 disabled:opacity-50"
              >
                {busy ? <Loader2 className="size-3 animate-spin" /> : <Check className="size-3" />}
                Confirmar
              </button>
            )}
            {appointment.status === 'confirmado' && (
              <button
                type="button"
                onClick={() => onStatus('concluido')}
                disabled={busy}
                className="inline-flex h-8 items-center gap-1.5 rounded-full border border-sage/30 bg-sage/[0.08] px-3 text-[9px] uppercase tracking-[0.14em] text-sage transition-colors hover:bg-sage/15 disabled:opacity-50"
              >
                {busy ? <Loader2 className="size-3 animate-spin" /> : <Check className="size-3" />}
                Concluir
              </button>
            )}
            <button
              type="button"
              onClick={onCancel}
              disabled={busy}
              aria-label={`Cancelar marcação de ${appointment.clientName}`}
              title="Cancelar marcação"
              className="grid size-8 place-items-center rounded-full border border-line text-faint transition-colors hover:border-wine-soft/40 hover:text-wine-soft disabled:opacity-50"
            >
              <X className="size-3.5" />
            </button>
          </div>
        ) : (
          <span className="text-[9px] uppercase tracking-[0.14em] text-faint">
            {appointment.status === 'concluido' ? 'Visita concluída' : 'Cancelada'}
          </span>
        )}
      </div>
    </div>
  )
}

export function Admin() {
  const { user, loading, logout } = useAuth()
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loadingData, setLoadingData] = useState(true)
  const [error, setError] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('todos')
  const [dayFilter, setDayFilter] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [busyId, setBusyId] = useState<string | null>(null)
  const [cancelTarget, setCancelTarget] = useState<Appointment | null>(null)
  const [passwordOpen, setPasswordOpen] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [savingPassword, setSavingPassword] = useState(false)
  const { toast, show } = useToast()

  const isOwner = user?.role === 'owner'
  const days = useMemo(() => nextOpenDays(6), [])

  const load = useCallback(async () => {
    setLoadingData(true)
    setError('')
    try {
      const data = await api.adminAppointments()
      setAppointments(data.appointments)
    } catch (caught) {
      setError(caught instanceof ApiError ? caught.message : 'Não foi possível carregar a agenda.')
    } finally {
      setLoadingData(false)
    }
  }, [])

  useEffect(() => {
    if (isOwner) void load()
  }, [isOwner, load])

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen">
        <PageLoader label="A abrir a agenda…" />
      </div>
    )
  }

  if (!user) return <AdminAccess signedIn={false} onLogout={handleLogout} />
  if (user.role !== 'owner') return <AdminAccess signedIn onLogout={handleLogout} />

  const month = todayISO().slice(0, 7)
  const today = todayISO()
  const activeAppointments = appointments.filter((appointment) => appointment.status !== 'cancelado')
  const monthRevenue = activeAppointments
    .filter((appointment) => appointment.date.startsWith(month))
    .reduce((sum, appointment) => sum + (serviceById(appointment.serviceId)?.price ?? 0), 0)
  const todayCount = activeAppointments.filter((appointment) => appointment.date === today).length
  const pendingCount = appointments.filter((appointment) => appointment.status === 'pendente').length
  const clients = new Set(appointments.map((appointment) => appointment.clientUsername)).size

  const stats: {
    label: string
    value: string | number
    hint: string
    icon: ComponentType<{ className?: string }>
  }[] = [
    { label: 'Hoje', value: todayCount, hint: 'marcações ativas', icon: CalendarDays },
    { label: 'A confirmar', value: pendingCount, hint: 'pedidos à espera', icon: Clock },
    { label: 'Valor em agenda', value: formatPrice(monthRevenue), hint: 'neste mês', icon: Euro },
    { label: 'Clientes', value: clients, hint: 'na base de dados', icon: Users },
  ]

  const filtered = appointments.filter((appointment) => {
    if (dayFilter && appointment.date !== dayFilter) return false
    if (statusFilter !== 'todos' && appointment.status !== statusFilter) return false
    const term = query.trim().toLowerCase()
    if (!term) return true
    const serviceName = serviceById(appointment.serviceId)?.name ?? ''
    return [appointment.clientName, appointment.clientUsername, appointment.clientPhone, appointment.notes, serviceName]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(term))
  })

  const groupMap = new Map<string, Appointment[]>()
  for (const appointment of filtered) {
    const list = groupMap.get(appointment.date) ?? []
    list.push(appointment)
    groupMap.set(appointment.date, list)
  }
  const groups = [...groupMap.keys()]
    .sort((a, b) => {
      const aPast = a < today
      const bPast = b < today
      if (aPast !== bPast) return aPast ? 1 : -1
      return aPast ? b.localeCompare(a) : a.localeCompare(b)
    })
    .map((date) => ({
      date,
      items: (groupMap.get(date) ?? []).sort((a, b) => a.time.localeCompare(b.time)),
    }))

  const changeStatus = async (appointment: Appointment, status: AppointmentStatus) => {
    setBusyId(appointment.id)
    try {
      const { appointment: updated } = await api.updateAppointmentStatus(appointment.id, status)
      setAppointments((current) =>
        current.map((item) => (item.id === updated.id ? { ...item, ...updated } : item)),
      )
      show(
        status === 'confirmado'
          ? 'Marcação confirmada.'
          : status === 'concluido'
            ? 'Marcação concluída.'
            : 'Marcação cancelada.',
      )
      if (status === 'cancelado') setCancelTarget(null)
    } catch (caught) {
      show(caught instanceof ApiError ? caught.message : 'Não foi possível atualizar a marcação.', 'error')
    } finally {
      setBusyId(null)
    }
  }

  const closePassword = () => {
    setPasswordOpen(false)
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
    setPasswordError('')
  }

  const submitPassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setPasswordError('')
    if (newPassword.length < 6) {
      setPasswordError('A nova palavra-passe deve ter pelo menos 6 caracteres.')
      return
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('As palavras-passe novas não coincidem.')
      return
    }
    setSavingPassword(true)
    try {
      await api.changePassword(currentPassword, newPassword)
      show('Palavra-passe atualizada.')
      closePassword()
    } catch (caught) {
      setPasswordError(caught instanceof ApiError ? caught.message : 'Não foi possível alterar a palavra-passe.')
    } finally {
      setSavingPassword(false)
    }
  }

  const clearedFilters = statusFilter === 'todos' && !dayFilter && !query

  return (
    <div className="min-h-screen bg-bg">
      <header className="sticky top-0 z-40 border-b border-line bg-bg/85 backdrop-blur-xl">
        <Container className="flex h-[72px] items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <Logo />
            <span className="hidden h-5 w-px bg-line sm:block" />
            <span className="hidden text-[8.5px] uppercase tracking-[0.28em] text-faint sm:block">
              Painel da Gabi
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Link
              href="/"
              className="inline-flex h-9 items-center gap-1.5 rounded-full px-2.5 text-[9.5px] uppercase tracking-[0.14em] text-faint transition-colors hover:bg-white/[0.04] hover:text-fg sm:px-3"
            >
              <span className="hidden sm:inline">Ver site</span>
              <ArrowUpRight className="size-3.5" />
            </Link>
            <button
              type="button"
              onClick={load}
              disabled={loadingData}
              aria-label="Atualizar agenda"
              title="Atualizar agenda"
              className="grid size-9 place-items-center rounded-full text-faint transition-colors hover:bg-white/[0.04] hover:text-fg"
            >
              <RefreshCw className={cx('size-4', loadingData && 'animate-spin')} />
            </button>
            <button
              type="button"
              onClick={handleLogout}
              aria-label="Terminar sessão"
              title="Terminar sessão"
              className="grid size-9 place-items-center rounded-full text-faint transition-colors hover:bg-white/[0.04] hover:text-fg"
            >
              <LogOut className="size-4" />
            </button>
          </div>
        </Container>
      </header>

      <main className="relative overflow-hidden pb-20">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute -right-40 top-0 size-[420px] rounded-full bg-wine/10 blur-[130px]" />
          <div className="absolute inset-0 grain" />
        </div>

        <Container className="relative">
          <div className="mt-9 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="flex items-center gap-3 text-[9px] uppercase tracking-[0.32em] text-gold/80">
                <span className="h-px w-7 bg-gold/50" />
                A sua agenda
              </p>
              <h1 className="mt-4 font-serif text-[clamp(2.5rem,5vw,3.6rem)] font-light leading-[1.02] tracking-[-0.02em]">
                {greeting()}, <em className="italic text-gold">Gabi.</em>
              </h1>
              <p className="mt-2 text-[12px] text-faint">{todayLabel()}</p>
            </div>
            <button
              type="button"
              onClick={() => setPasswordOpen(true)}
              className="inline-flex h-10 items-center gap-2 self-start rounded-full border border-line px-4 text-[9.5px] uppercase tracking-[0.16em] text-muted transition-colors hover:border-gold/35 hover:text-gold sm:self-auto"
            >
              <ShieldCheck className="size-3.5" />
              Segurança
            </button>
          </div>

          <div className="mt-7 grid grid-cols-2 gap-2.5 sm:gap-3 xl:grid-cols-4">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <div
                  key={stat.label}
                  className={cx(
                    'relative overflow-hidden rounded-2xl border p-4 sm:p-5',
                    index === 1 && pendingCount > 0
                      ? 'border-gold/25 bg-gold/[0.04]'
                      : 'border-line bg-surface/55',
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[8.5px] uppercase tracking-[0.2em] text-faint">{stat.label}</span>
                    <Icon className="size-4 text-gold/55" />
                  </div>
                  <p className="mt-4 font-serif text-[28px] font-light leading-none text-fg sm:text-[33px]">
                    {stat.value}
                  </p>
                  <p className="mt-2 text-[9.5px] text-faint">{stat.hint}</p>
                </div>
              )
            })}
          </div>

          <div className="mt-8 flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            <button
              type="button"
              onClick={() => setDayFilter(null)}
              className={cx(
                'min-w-[58px] shrink-0 rounded-xl border px-3 py-2.5 text-center transition-colors',
                !dayFilter
                  ? 'border-gold bg-gold text-ink'
                  : 'border-line bg-white/[0.02] text-muted hover:border-gold/35 hover:text-fg',
              )}
            >
              <span className="block text-[8px] uppercase tracking-[0.16em] opacity-70">Todas</span>
              <span className="mt-1 block font-serif text-[20px] leading-none">•</span>
            </button>
            {days.map((day) => {
              const count = activeAppointments.filter((appointment) => appointment.date === day).length
              const selected = dayFilter === day
              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => setDayFilter(day)}
                  className={cx(
                    'min-w-[64px] shrink-0 rounded-xl border px-3 py-2 text-center transition-colors',
                    selected
                      ? 'border-gold bg-gold text-ink'
                      : 'border-line bg-white/[0.02] text-muted hover:border-gold/35 hover:text-fg',
                  )}
                >
                  <span className={cx('block text-[8px] uppercase tracking-[0.16em]', selected ? 'text-ink/70' : 'text-faint')}>
                    {relativeDay(day) === 'Hoje' || relativeDay(day) === 'Amanhã' ? relativeDay(day) : weekdayShortLabel(day)}
                  </span>
                  <span className="mt-0.5 block font-serif text-[20px] leading-none">{dayNumber(day)}</span>
                  <span className={cx('mt-1 block text-[8px]', selected ? 'text-ink/70' : 'text-gold/60')}>
                    {count} marc.
                  </span>
                </button>
              )
            })}
          </div>

          <div className="mt-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-1.5">
              {STATUS_TABS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setStatusFilter(tab.id)}
                  className={cx(
                    'rounded-full border px-3 py-1.5 text-[9px] uppercase tracking-[0.14em] transition-colors',
                    statusFilter === tab.id
                      ? 'border-gold/60 bg-gold/10 text-gold'
                      : 'border-line text-faint hover:border-gold/25 hover:text-muted',
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <div className="relative w-full lg:w-64">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-faint" />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Procurar cliente, serviço…"
                className="h-10 w-full rounded-full border border-line bg-white/[0.02] pl-9 pr-3 text-[12px] text-fg outline-none transition-colors placeholder:text-faint/60 focus:border-gold/50"
              />
            </div>
          </div>

          {error && (
            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-wine-soft/25 bg-wine/10 px-4 py-3 text-[12px] text-wine-soft">
              {error}
              <button type="button" onClick={load} className="underline underline-offset-2">
                Tentar de novo
              </button>
            </div>
          )}

          {loadingData && appointments.length === 0 ? (
            <div className="mt-8 flex flex-col gap-2.5">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="h-28 animate-pulse rounded-2xl bg-white/[0.03]" />
              ))}
            </div>
          ) : groups.length === 0 ? (
            <div className="mt-10 rounded-card border border-dashed border-line px-6 py-16 text-center">
              <span className="mx-auto grid size-12 place-items-center rounded-full border border-gold/20 bg-gold/[0.04]">
                <CalendarDays className="size-5 text-gold/70" />
              </span>
              <h2 className="mt-4 font-serif text-[28px] leading-tight">
                {appointments.length === 0 ? 'A agenda está livre.' : 'Sem marcações com estes filtros.'}
              </h2>
              <p className="mx-auto mt-2 max-w-xs text-[12px] leading-relaxed text-muted">
                {appointments.length === 0
                  ? 'Quando um cliente marcar, o pedido aparece aqui para confirmar.'
                  : 'Experimente outro dia, outro estado ou limpe a pesquisa.'}
              </p>
              {!clearedFilters && (
                <button
                  type="button"
                  onClick={() => {
                    setStatusFilter('todos')
                    setDayFilter(null)
                    setQuery('')
                  }}
                  className="mt-5 text-[10px] uppercase tracking-[0.16em] text-gold underline decoration-gold/30 underline-offset-4"
                >
                  Limpar filtros
                </button>
              )}
            </div>
          ) : (
            <div className="mt-7">
              {groups.map((group) => {
                const total = group.items
                  .filter((appointment) => appointment.status !== 'cancelado')
                  .reduce((sum, appointment) => sum + (serviceById(appointment.serviceId)?.price ?? 0), 0)
                return (
                  <section key={group.date} className="mt-8 first:mt-2">
                    <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-gold/20 pb-2.5">
                      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                        <h2 className="font-serif text-[24px] leading-none text-fg">{relativeDay(group.date)}</h2>
                        <span className="text-[9px] uppercase tracking-[0.16em] text-faint">
                          {formatLongDate(group.date, true)}
                        </span>
                        <span className="rounded-full border border-line px-2 py-0.5 text-[8.5px] uppercase tracking-[0.14em] text-muted">
                          {group.items.length} {group.items.length === 1 ? 'marcação' : 'marcações'}
                        </span>
                      </div>
                      <span className="font-serif text-[16px] text-gold-soft">{formatPrice(total)}</span>
                    </div>
                    <div className="mt-3 flex flex-col gap-2.5">
                      {group.items.map((appointment) => (
                        <AppointmentCard
                          key={appointment.id}
                          appointment={appointment}
                          busy={busyId === appointment.id}
                          onStatus={(status) => void changeStatus(appointment, status)}
                          onCancel={() => setCancelTarget(appointment)}
                        />
                      ))}
                    </div>
                  </section>
                )
              })}
            </div>
          )}

          <div className="mt-12 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-5">
            <p className="text-[9.5px] uppercase tracking-[0.18em] text-faint">
              {appointments.length} marcações no total · dados guardados na sua conta
            </p>
            <Link href="/" className="text-[9.5px] uppercase tracking-[0.18em] text-faint transition-colors hover:text-gold">
              Voltar ao site
            </Link>
          </div>
        </Container>
      </main>

      <Modal
        open={Boolean(cancelTarget)}
        onClose={() => {
          if (busyId !== cancelTarget?.id) setCancelTarget(null)
        }}
        title="Cancelar esta marcação?"
      >
        <p className="text-[13px] leading-relaxed text-muted">
          Vai cancelar a marcação de{' '}
          <strong className="font-medium text-fg">{cancelTarget?.clientName}</strong> (
          {cancelTarget ? serviceById(cancelTarget.serviceId)?.name : ''}) em{' '}
          <strong className="font-medium text-fg">
            {cancelTarget ? formatLongDate(cancelTarget.date) : ''} às {cancelTarget?.time}
          </strong>
          . O horário fica livre para outro cliente.
        </p>
        <div className="mt-6 flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => setCancelTarget(null)}
            disabled={Boolean(cancelTarget && busyId === cancelTarget.id)}
          >
            Manter
          </Button>
          <Button
            variant="wine"
            onClick={() => {
              if (cancelTarget) void changeStatus(cancelTarget, 'cancelado')
            }}
            disabled={Boolean(cancelTarget && busyId === cancelTarget.id)}
          >
            {cancelTarget && busyId === cancelTarget.id ? 'A cancelar…' : 'Sim, cancelar'}
          </Button>
        </div>
      </Modal>

      <Modal open={passwordOpen} onClose={closePassword} title="Alterar palavra-passe">
        <p className="text-[12px] leading-relaxed text-muted">
          Use pelo menos 6 caracteres. A sessão atual mantém-se ativa.
        </p>
        <form onSubmit={submitPassword} className="mt-5 flex flex-col gap-4">
          <Field
            label="Palavra-passe atual"
            type="password"
            autoComplete="current-password"
            value={currentPassword}
            onChange={(event) => setCurrentPassword(event.target.value)}
            required
          />
          <Field
            label="Nova palavra-passe"
            type="password"
            autoComplete="new-password"
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
            required
            minLength={6}
            maxLength={72}
          />
          <Field
            label="Repetir nova palavra-passe"
            type="password"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            required
            minLength={6}
            maxLength={72}
          />
          {passwordError && (
            <p className="rounded-xl border border-wine-soft/25 bg-wine/10 px-3 py-2 text-[11.5px] text-wine-soft">
              {passwordError}
            </p>
          )}
          <div className="mt-1 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={closePassword} disabled={savingPassword}>
              Cancelar
            </Button>
            <Button type="submit" disabled={savingPassword}>
              {savingPassword && <Loader2 className="size-4 animate-spin" />}
              Guardar
            </Button>
          </div>
        </form>
      </Modal>

      <Toast toast={toast} />
    </div>
  )
}

function weekdayShortLabel(iso: string): string {
  const date = new Date(`${iso}T12:00:00`)
  const labels = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb']
  return labels[date.getDay()] ?? ''
}

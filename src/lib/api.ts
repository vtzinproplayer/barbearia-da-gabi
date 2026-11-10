import type { Service } from '../shared/services'

export type Role = 'client' | 'owner'
export type AppointmentStatus = 'pendente' | 'confirmado' | 'concluido' | 'cancelado'

export type User = {
  id: string
  username: string
  name: string
  phone: string
  role: Role
  createdAt: string
}

export type Appointment = {
  id: string
  serviceId: string
  service?: Service
  date: string
  time: string
  endTime: string
  duration: number
  notes: string
  status: AppointmentStatus
  createdAt: string
  updatedAt: string
  clientName?: string
  clientUsername?: string
  clientPhone?: string
}

export type Slot = { time: string; available: boolean }

export type Availability = {
  date: string
  closed: boolean
  slots: Slot[]
}

export class ApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers)
  if (init.body) headers.set('Content-Type', 'application/json')
  const response = await fetch(path, {
    credentials: 'same-origin',
    ...init,
    headers,
  })
  const text = await response.text()
  let data: unknown = null
  try {
    data = text ? JSON.parse(text) : null
  } catch {
    data = null
  }
  if (!response.ok) {
    const message =
      data && typeof data === 'object' && 'error' in data && typeof data.error === 'string'
        ? data.error
        : 'Não foi possível concluir o pedido. Tente novamente.'
    throw new ApiError(message, response.status)
  }
  return data as T
}

export const api = {
  me: () => request<{ user: User | null }>('/api/auth/me'),

  login: (username: string, password: string) =>
    request<{ user: User }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),

  register: (payload: { name: string; username: string; password: string }) =>
    request<{ user: User }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  logout: () => request<{ ok: true }>('/api/auth/logout', { method: 'POST' }),

  availability: (date: string, serviceId: string) =>
    request<Availability>(`/api/availability?date=${encodeURIComponent(date)}&service=${encodeURIComponent(serviceId)}`),

  createAppointment: (payload: { serviceId: string; date: string; time: string; notes: string }) =>
    request<{ appointment: Appointment }>('/api/appointments', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  myAppointments: () => request<{ appointments: Appointment[] }>('/api/appointments/mine'),

  cancelAppointment: (id: string) =>
    request<{ appointment: Appointment }>(`/api/appointments/${id}/cancel`, { method: 'PATCH' }),

  adminAppointments: () => request<{ appointments: Appointment[] }>('/api/admin/appointments'),

  updateAppointmentStatus: (id: string, status: AppointmentStatus) =>
    request<{ appointment: Appointment }>(`/api/admin/appointments/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),

  changePassword: (currentPassword: string, newPassword: string) =>
    request<{ ok: true }>('/api/account/password', {
      method: 'PATCH',
      body: JSON.stringify({ currentPassword, newPassword }),
    }),
}


// Catálogo de serviços usado pelo site e pelo Worker. É a única fonte de
// verdade para preços, durações e horários de funcionamento: alterar aqui
// atualiza a página, o formulário de marcação e as validações do servidor.

export type Service = {
  id: string
  name: string
  description: string
  duration: number
  price: number
  tag?: string
}

export const SERVICES: Service[] = [
  {
    id: 'corte-classico',
    name: 'Corte Clássico',
    description: 'Tesoura e máquina, acabamento à navalha e um corte pensado para o seu dia a dia.',
    duration: 30,
    price: 14,
  },
  {
    id: 'corte-barba',
    name: 'Corte + Barba',
    description: 'O ritual completo: corte à medida, barba desenhada e finalização com óleo.',
    duration: 50,
    price: 22,
    tag: 'Mais pedido',
  },
  {
    id: 'fade-assinatura',
    name: 'Fade de Assinatura',
    description: 'Degradê desenhado ao detalhe, com transições suaves e acabamento preciso.',
    duration: 40,
    price: 17,
  },
  {
    id: 'barba-quente',
    name: 'Barba com Toalha Quente',
    description: 'Toalha quente, navalha e bálsamos para uma barba macia e bem definida.',
    duration: 25,
    price: 12,
  },
  {
    id: 'coloracao',
    name: 'Coloração & Platinado',
    description: 'Cor, matização e cuidado, com aconselhamento antes de qualquer transformação.',
    duration: 90,
    price: 45,
  },
  {
    id: 'ritual-completo',
    name: 'Ritual Completo',
    description: 'Corte, barba e tratamento facial. A experiência inteira, sem pressa.',
    duration: 75,
    price: 32,
    tag: 'Experiência',
  },
]

export const SERVICE_MAP: Record<string, Service> = Object.fromEntries(
  SERVICES.map((service) => [service.id, service]),
)

export function serviceById(id: string | null | undefined): Service | undefined {
  return id ? SERVICE_MAP[id] : undefined
}

// 0 = domingo, 1 = segunda, ..., 6 = sábado.
export const OPEN_WEEKDAYS = [2, 3, 4, 5, 6]

// A barbearia abre às 09:00 e fecha às 19:30. Cada marcação começa de meia em
// meia hora e o serviço tem de terminar antes do fecho.
export const OPENING_MINUTES = 9 * 60
export const CLOSING_MINUTES = 19 * 60 + 30
export const SLOT_STEP = 30

export function minutesToTime(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`
}

export const SLOT_TIMES: string[] = Array.from(
  { length: Math.floor((CLOSING_MINUTES - OPENING_MINUTES - SLOT_STEP) / SLOT_STEP) + 1 },
  (_, index) => minutesToTime(OPENING_MINUTES + index * SLOT_STEP),
)

export function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number)
  return hours * 60 + minutes
}

export function minutesToClose(duration: number): number[] {
  return SLOT_TIMES.filter((time) => timeToMinutes(time) + duration <= CLOSING_MINUTES).map(timeToMinutes)
}

export function parseISODate(iso: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return null
  const [year, month, day] = iso.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  if (
    Number.isNaN(date.getTime()) ||
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null
  }
  return date
}

export function isOpenDate(iso: string): boolean {
  const date = parseISODate(iso)
  return Boolean(date && OPEN_WEEKDAYS.includes(date.getDay()))
}

export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const rest = minutes % 60
  if (!hours) return `${rest} min`
  return rest ? `${hours} h ${rest}` : `${hours} h`
}

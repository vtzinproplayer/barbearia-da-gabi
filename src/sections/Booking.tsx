import { AnimatePresence, motion } from 'motion/react'
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  CheckCircle2,
  Clock,
  Loader2,
  MapPin,
  Scissors,
  ShieldCheck,
  Sparkles,
  UserRound,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

import { Button } from '../components/Button'
import { Container } from '../components/Container'
import { PageLoader } from '../components/PageLoader'
import { TextAreaField } from '../components/Field'
import { images, services } from '../content'
import { ApiError, api, type Appointment, type Slot } from '../lib/api'
import { useAuth } from '../lib/auth'
import { cx } from '../lib/cx'
import {
  dayNumber,
  formatDuration,
  formatLongDate,
  formatPrice,
  isPastSlot,
  monthShort,
  nextOpenDays,
  todayISO,
  weekdayShort,
} from '../lib/format'
import { Link, useRoute } from '../lib/router'
import { serviceById, type Service } from '../shared/services'

const ease = [0.22, 1, 0.36, 1] as const
const STEPS = [
  { id: 1, label: 'Serviço' },
  { id: 2, label: 'Data e hora' },
  { id: 3, label: 'Confirmar' },
]

function BookingGate({ nextPath }: { nextPath: string }) {
  const loginHref = `/entrar?next=${encodeURIComponent(nextPath)}`
  const registerHref = `/entrar?modo=criar&next=${encodeURIComponent(nextPath)}`

  return (
    <main className="relative overflow-hidden pb-24 pt-[126px] sm:pt-[142px]">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -right-32 top-10 size-[420px] rounded-full bg-wine/20 blur-[120px]" />
        <div className="absolute inset-0 grain" />
      </div>
      <Container className="relative">
        <div className="mx-auto grid max-w-4xl items-center gap-10 md:grid-cols-[0.9fr_1.1fr] md:gap-14">
          <div className="relative hidden md:block">
            <div className="arch relative overflow-hidden border border-gold/20">
              <img src={images.services} alt="Ferramentas de barbeiro" className="h-[420px] w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/20 to-transparent" />
              <p className="absolute inset-x-6 bottom-6 font-serif text-[20px] italic text-gold-soft">
                O seu momento
                <br />
                começa aqui.
              </p>
            </div>
            <span className="absolute -right-3 top-8 rounded-full border border-gold/25 bg-bg px-3 py-1.5 text-[9px] uppercase tracking-[0.2em] text-gold/80">
              3 passos
            </span>
          </div>

          <div>
            <p className="flex items-center gap-3 text-[9px] uppercase tracking-[0.32em] text-gold/80">
              <span className="h-px w-7 bg-gold/50" />
              Marcação online
            </p>
            <h1 className="mt-5 text-balance font-serif text-[42px] font-light leading-[1.02] tracking-[-0.02em] sm:text-[48px]">
              Entre para reservar
              <br />
              <em className="italic text-gold">o seu momento.</em>
            </h1>
            <p className="mt-4 max-w-sm text-[13.5px] leading-relaxed text-muted">
              Crie a sua conta em segundos para escolher o serviço, o dia e a hora. A Gabi confirma
              a marcação no painel dela.
            </p>

            <ul className="mt-7 flex flex-col gap-3">
              {[
                'Agenda aberta com 3 semanas de antecedência',
                'Escolha o ritual e o horário que lhe dá jeito',
                'Cancele na sua conta sempre que precisar',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-[12.5px] leading-relaxed text-muted">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-gold/70" />
                  {item}
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-col gap-2.5 sm:flex-row">
              <Button href={loginHref} size="lg" className="flex-1">
                Entrar
                <ArrowRight />
              </Button>
              <Button href={registerHref} variant="outline" size="lg" className="flex-1">
                Criar conta
              </Button>
            </div>
            <p className="mt-4 text-[10.5px] text-faint">
              Só precisa de um nome de utilizador e de uma palavra-passe.
            </p>
          </div>
        </div>
      </Container>
    </main>
  )
}

function BookingSuccess({ appointment, service }: { appointment: Appointment; service: Service }) {
  const { user } = useAuth()
  const firstName = user?.name.split(' ')[0] ?? ''

  return (
    <main className="relative overflow-hidden pb-24 pt-[128px] sm:pt-[144px]">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-20 size-[420px] -translate-x-1/2 rounded-full bg-gold/[0.06] blur-[120px]" />
        <div className="absolute inset-0 grain" />
      </div>
      <Container className="relative">
        <div className="mx-auto max-w-lg text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease }}
            className="relative mx-auto grid size-24 place-items-center rounded-full border border-gold/30 bg-gold/[0.05]"
          >
            <span className="absolute inset-2 rounded-full border border-gold/10" />
            <svg viewBox="0 0 52 52" className="size-11 text-gold" fill="none">
              <motion.circle
                cx="26"
                cy="26"
                r="24"
                stroke="currentColor"
                strokeOpacity="0.35"
                strokeWidth="1"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, ease }}
              />
              <motion.path
                d="M15 27.5 22 34.5 37 18"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.6, delay: 0.5, ease }}
              />
            </svg>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease }}
          >
            <p className="mt-7 text-[9px] uppercase tracking-[0.32em] text-gold/80">Marcação enviada</p>
            <h1 className="mt-4 font-serif text-[40px] font-light leading-[1.03] tracking-[-0.02em] sm:text-[48px]">
              Está reservado, {firstName}.
            </h1>
            <p className="mx-auto mt-4 max-w-sm text-[13.5px] leading-relaxed text-muted">
              A Gabi vai confirmar o seu horário. Pode acompanhar o estado em “A minha conta”.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.28, ease }}
            className="mt-9 overflow-hidden rounded-card border border-gold/20 bg-surface/70 text-left shadow-glow"
          >
            <div className="flex items-center justify-between border-b border-line bg-gold/[0.04] px-5 py-3">
              <span className="text-[9px] uppercase tracking-[0.24em] text-gold/80">A sua marcação</span>
              <span className="inline-flex items-center gap-1.5 text-[9px] uppercase tracking-[0.14em] text-gold">
                <span className="size-1.5 rounded-full bg-gold" />
                Aguarda confirmação
              </span>
            </div>
            <div className="flex flex-col gap-4 p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-serif text-[27px] leading-tight text-fg">{service.name}</h2>
                  <p className="mt-1 text-[12px] text-muted">{formatLongDate(appointment.date, true)}</p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="font-serif text-[28px] leading-none text-gold-soft">{appointment.time}</p>
                  <p className="mt-1 text-[10px] text-faint">{formatDuration(appointment.duration)}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 border-t border-line pt-4 text-[11.5px]">
                <span className="inline-flex items-center gap-2 text-muted">
                  <CalendarDays className="size-3.5 text-gold/60" />
                  {formatLongDate(appointment.date)}
                </span>
                <span className="inline-flex items-center gap-2 text-muted">
                  <UserRound className="size-3.5 text-gold/60" />
                  {user?.name}
                </span>
                <span className="inline-flex items-center gap-2 text-muted">
                  <Clock className="size-3.5 text-gold/60" />
                  Até às {appointment.endTime}
                </span>
                <span className="inline-flex items-center gap-2 font-medium text-gold-soft">
                  <Scissors className="size-3.5 text-gold/60" />
                  {formatPrice(service.price)}
                </span>
              </div>
              {appointment.notes && (
                <p className="rounded-xl border border-line bg-white/[0.02] px-3.5 py-2.5 text-[11.5px] italic text-muted">
                  “{appointment.notes}”
                </p>
              )}
            </div>
          </motion.div>

          <div className="mt-7 flex flex-col justify-center gap-2.5 sm:flex-row">
            <Button href="/conta" size="lg">
              Ver os meus agendamentos
              <ArrowRight />
            </Button>
            <Button href="/" variant="outline" size="lg">
              Voltar ao início
            </Button>
          </div>
          <p className="mt-5 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.16em] text-faint">
            <MapPin className="size-3 text-gold/50" />
            Rua do Almada, 128 · Porto
          </p>
        </div>
      </Container>
    </main>
  )
}

export function Booking() {
  const { user, loading } = useAuth()
  const route = useRoute()
  const preselected = serviceById(route.query.get('servico'))

  const days = useMemo(() => nextOpenDays(14), [])
  const [serviceId, setServiceId] = useState(preselected?.id ?? '')
  const [step, setStep] = useState(1)
  const [date, setDate] = useState(() => {
    const today = todayISO()
    if (days.includes(today) && new Date().getHours() < 18) return today
    return days[0] ?? ''
  })
  const [time, setTime] = useState('')
  const [slots, setSlots] = useState<Slot[]>([])
  const [slotsLoading, setSlotsLoading] = useState(false)
  const [slotsError, setSlotsError] = useState('')
  const [availabilityRetry, setAvailabilityRetry] = useState(0)
  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [created, setCreated] = useState<Appointment | null>(null)

  const selectedService = serviceById(serviceId)
  const nextPath = `/marcar${preselected ? `?servico=${preselected.id}` : ''}`

  useEffect(() => {
    if (!serviceId || !date) {
      setSlots([])
      return
    }
    let cancelled = false
    setSlotsLoading(true)
    setSlotsError('')
    api
      .availability(date, serviceId)
      .then((data) => {
        if (cancelled) return
        setSlots(data.slots)
        setTime((current) =>
          current && data.slots.some((slot) => slot.time === current && slot.available) ? current : '',
        )
      })
      .catch((caught) => {
        if (cancelled) return
        setSlotsError(
          caught instanceof ApiError ? caught.message : 'Não foi possível carregar os horários.',
        )
      })
      .finally(() => {
        if (!cancelled) setSlotsLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [serviceId, date, availabilityRetry])

  useEffect(() => {
    if (created) window.scrollTo({ top: 0 })
  }, [created])

  if (loading) {
    return (
      <main className="pt-32">
        <PageLoader />
      </main>
    )
  }

  if (!user) return <BookingGate nextPath={nextPath} />

  if (created && selectedService) return <BookingSuccess appointment={created} service={selectedService} />

  const canContinue = step === 1 ? Boolean(serviceId) : step === 2 ? Boolean(time) && !slotsLoading : true

  const confirm = async () => {
    if (!serviceId || !date || !time) return
    setSubmitting(true)
    setError('')
    try {
      const { appointment } = await api.createAppointment({ serviceId, date, time, notes })
      setCreated(appointment)
    } catch (caught) {
      const message =
        caught instanceof ApiError ? caught.message : 'Não foi possível concluir a marcação.'
      setError(message)
      if (caught instanceof ApiError && (caught.status === 409 || caught.status === 400)) {
        setStep(2)
        setTime('')
        setAvailabilityRetry((value) => value + 1)
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="relative overflow-hidden pb-24 pt-[118px] sm:pt-[134px]">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -right-40 top-0 size-[460px] rounded-full bg-wine/15 blur-[130px]" />
        <div className="absolute inset-0 grain" />
      </div>

      <Container className="relative">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="flex items-center gap-3 text-[9px] uppercase tracking-[0.32em] text-gold/80">
              <span className="h-px w-7 bg-gold/50" />
              A sua marcação
            </p>
            <h1 className="mt-4 font-serif text-[clamp(2.6rem,5vw,3.8rem)] font-light leading-[1.02] tracking-[-0.02em]">
              Reserve o seu <em className="italic text-gold">momento.</em>
            </h1>
            <p className="mt-3 max-w-md text-[13.5px] leading-relaxed text-muted">
              Olá, {user.name.split(' ')[0]}. Escolha o ritual, o dia e a hora — nós tratamos do resto.
            </p>
          </div>
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.16em] text-faint">
            <ShieldCheck className="size-4 text-gold/60" />
            Confirmação pela Gabi
          </div>
        </div>

        <div className="mt-10 border-y border-line py-4">
          <div className="flex items-center gap-2 sm:gap-4">
            {STEPS.map((item, index) => {
              const active = step === item.id
              const complete = step > item.id
              return (
                <div key={item.id} className="flex flex-1 items-center gap-2 sm:gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      if (item.id < step) setStep(item.id)
                    }}
                    disabled={item.id > step}
                    className={cx(
                      'flex items-center gap-2 text-left',
                      item.id < step && 'cursor-pointer',
                      item.id > step && 'cursor-default',
                    )}
                  >
                    <span
                      className={cx(
                        'grid size-7 shrink-0 place-items-center rounded-full border text-[10px] transition-colors sm:size-8',
                        active && 'border-gold bg-gold text-ink',
                        complete && 'border-gold/50 bg-gold/10 text-gold',
                        !active && !complete && 'border-line-strong text-faint',
                      )}
                    >
                      {complete ? <Check className="size-3.5" /> : item.id}
                    </span>
                    <span
                      className={cx(
                        'text-[9px] uppercase tracking-[0.16em] sm:text-[10px] sm:tracking-[0.2em]',
                        active ? 'text-fg' : complete ? 'text-gold/80' : 'text-faint',
                      )}
                    >
                      {item.label}
                    </span>
                  </button>
                  {index < STEPS.length - 1 && (
                    <span
                      className={cx(
                        'h-px flex-1 transition-colors',
                        step > item.id ? 'bg-gold/40' : 'bg-line',
                      )}
                    />
                  )}
                </div>
              )
            })}
          </div>
        </div>

        <div className="mt-9 grid gap-8 lg:grid-cols-[1.12fr_0.88fr] lg:gap-10">
          <div>
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 14 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.28, ease }}
              >
                {step === 1 && (
                  <div>
                    <div className="flex items-baseline justify-between">
                      <h2 className="font-serif text-[27px] leading-tight">O que deseja hoje?</h2>
                      <span className="text-[9px] uppercase tracking-[0.2em] text-faint">01 / 03</span>
                    </div>
                    <p className="mt-1.5 text-[12px] text-faint">
                      Escolha um ritual. Pode mudar de ideias mais tarde.
                    </p>

                    <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
                      {services.items.map((service, index) => {
                        const selected = service.id === serviceId
                        return (
                          <button
                            key={service.id}
                            type="button"
                            onClick={() => setServiceId(service.id)}
                            className={cx(
                              'group relative flex flex-col rounded-2xl border p-4 text-left transition-all duration-300',
                              selected
                                ? 'border-gold/60 bg-gold/[0.06] shadow-[0_18px_50px_-30px_rgb(216_180_119/0.4)]'
                                : 'border-line bg-white/[0.018] hover:border-gold/30 hover:bg-white/[0.03]',
                            )}
                          >
                            <span className="flex items-start justify-between gap-2">
                              <span className="font-serif text-[11px] italic text-gold/50">0{index + 1}</span>
                              <span
                                className={cx(
                                  'grid size-5 place-items-center rounded-full border transition-colors',
                                  selected ? 'border-gold bg-gold text-ink' : 'border-line-strong text-transparent',
                                )}
                              >
                                <Check className="size-3" />
                              </span>
                            </span>
                            <span className="mt-2 flex flex-wrap items-center gap-2">
                              <span className="font-serif text-[22px] leading-tight text-fg">{service.name}</span>
                              {service.tag && (
                                <span className="rounded-full border border-gold/25 px-1.5 py-0.5 text-[7px] uppercase tracking-[0.16em] text-gold/80">
                                  {service.tag}
                                </span>
                              )}
                            </span>
                            <span className="mt-1 text-[11.5px] leading-relaxed text-muted">
                              {service.description}
                            </span>
                            <span className="mt-3 flex items-center justify-between border-t border-line pt-2.5">
                              <span className="inline-flex items-center gap-1.5 text-[9.5px] uppercase tracking-[0.14em] text-faint">
                                <Clock className="size-3 text-gold/50" />
                                {formatDuration(service.duration)}
                              </span>
                              <span className="font-serif text-[18px] text-gold-soft">
                                {formatPrice(service.price)}
                              </span>
                            </span>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}

                {step === 2 && selectedService && (
                  <div>
                    <div className="flex items-baseline justify-between">
                      <h2 className="font-serif text-[27px] leading-tight">Quando lhe dá jeito?</h2>
                      <span className="text-[9px] uppercase tracking-[0.2em] text-faint">02 / 03</span>
                    </div>
                    <p className="mt-1.5 text-[12px] text-faint">
                      Agenda de {selectedService.name} ({formatDuration(selectedService.duration)}). Terça a
                      sábado.
                    </p>

                    <div className="mt-5 flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                      {days.map((day) => {
                        const selected = day === date
                        return (
                          <button
                            key={day}
                            type="button"
                            onClick={() => {
                              setDate(day)
                              setTime('')
                            }}
                            className={cx(
                              'flex w-[62px] shrink-0 flex-col items-center rounded-xl border px-2 py-2.5 transition-all duration-300',
                              selected
                                ? 'border-gold bg-gold text-ink'
                                : 'border-line bg-white/[0.02] text-muted hover:border-gold/35 hover:text-fg',
                            )}
                          >
                            <span
                              className={cx(
                                'text-[8px] uppercase tracking-[0.16em]',
                                selected ? 'text-ink/70' : 'text-faint',
                              )}
                            >
                              {weekdayShort(day)}
                            </span>
                            <span className="mt-0.5 font-serif text-[24px] leading-none">{dayNumber(day)}</span>
                            <span
                              className={cx(
                                'mt-0.5 text-[8px] uppercase tracking-[0.14em]',
                                selected ? 'text-ink/70' : 'text-faint',
                              )}
                            >
                              {monthShort(day)}
                            </span>
                          </button>
                        )
                      })}
                    </div>

                    <div className="mt-6">
                      <div className="flex items-center justify-between">
                        <p className="text-[9px] uppercase tracking-[0.24em] text-faint">
                          Horários · {formatLongDate(date)}
                        </p>
                        {slotsLoading && <Loader2 className="size-3.5 animate-spin text-gold/70" />}
                      </div>

                      {slotsLoading ? (
                        <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
                          {Array.from({ length: 12 }).map((_, index) => (
                            <div key={index} className="h-10 animate-pulse rounded-lg bg-white/[0.04]" />
                          ))}
                        </div>
                      ) : slotsError ? (
                        <div className="mt-3 rounded-xl border border-wine-soft/25 bg-wine/10 px-4 py-3 text-[12px] text-wine-soft">
                          {slotsError}
                          <button
                            type="button"
                            onClick={() => setAvailabilityRetry((value) => value + 1)}
                            className="ml-2 underline underline-offset-2"
                          >
                            Tentar de novo
                          </button>
                        </div>
                      ) : (
                        <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
                          {slots.map((slot) => {
                            const selected = slot.time === time
                            const unavailable = !slot.available || isPastSlot(date, slot.time)
                            return (
                              <button
                                key={slot.time}
                                type="button"
                                onClick={() => setTime(slot.time)}
                                disabled={unavailable}
                                className={cx(
                                  'h-10 rounded-lg border text-[12.5px] transition-all duration-200',
                                  selected
                                    ? 'border-gold bg-gold font-medium text-ink'
                                    : unavailable
                                      ? 'cursor-not-allowed border-line/60 bg-white/[0.01] text-faint/40 line-through'
                                      : 'border-line bg-white/[0.02] text-muted hover:border-gold/40 hover:text-gold-soft',
                                )}
                              >
                                {slot.time}
                              </button>
                            )
                          })}
                        </div>
                      )}
                      <p className="mt-3 text-[10px] text-faint">
                        Horários riscados já estão ocupados ou não têm duração suficiente.
                      </p>
                    </div>
                  </div>
                )}

                {step === 3 && selectedService && (
                  <div>
                    <div className="flex items-baseline justify-between">
                      <h2 className="font-serif text-[27px] leading-tight">Tudo certo?</h2>
                      <span className="text-[9px] uppercase tracking-[0.2em] text-faint">03 / 03</span>
                    </div>
                    <p className="mt-1.5 text-[12px] text-faint">
                      Reveja os detalhes e deixe uma nota, se precisar.
                    </p>

                    <div className="mt-5 divide-y divide-line rounded-2xl border border-line bg-white/[0.02] px-4">
                      {[
                        { label: 'Serviço', value: selectedService.name },
                        { label: 'Data', value: formatLongDate(date, true) },
                        { label: 'Hora', value: `${time} — ${time ? addMinutes(time, selectedService.duration) : ''}` },
                        { label: 'Duração', value: formatDuration(selectedService.duration) },
                      ].map((row) => (
                        <div key={row.label} className="flex items-baseline justify-between gap-4 py-3">
                          <span className="text-[9px] uppercase tracking-[0.2em] text-faint">{row.label}</span>
                          <span className="text-right text-[12.5px] text-fg">{row.value}</span>
                        </div>
                      ))}
                    </div>

                    <TextAreaField
                      className="mt-5"
                      label="Notas para a Gabi"
                      hint={`${notes.length}/300`}
                      placeholder="Ex.: primeira visita, referência de corte, alergias…"
                      rows={3}
                      maxLength={300}
                      value={notes}
                      onChange={(event) => setNotes(event.target.value)}
                    />

                    <div className="mt-5 flex items-start gap-2.5 rounded-xl border border-gold/15 bg-gold/[0.035] px-3.5 py-3 text-[11.5px] leading-relaxed text-muted">
                      <Sparkles className="mt-0.5 size-3.5 shrink-0 text-gold/70" />
                      A marcação fica pendente até a Gabi a confirmar. Pode cancelá-la na sua conta.
                    </div>

                    {error && (
                      <div className="mt-4 rounded-xl border border-wine-soft/25 bg-wine/10 px-3.5 py-2.5 text-[12px] leading-relaxed text-wine-soft">
                        {error}
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            <div className="mt-7 flex items-center justify-between border-t border-line pt-5">
              <button
                type="button"
                onClick={() => setStep((value) => Math.max(1, value - 1))}
                disabled={step === 1}
                className="inline-flex h-10 items-center gap-2 rounded-full px-3 text-[11px] uppercase tracking-[0.16em] text-muted transition-colors hover:text-fg disabled:pointer-events-none disabled:opacity-30"
              >
                <ArrowLeft className="size-3.5" />
                Voltar
              </button>

              {step < 3 ? (
                <Button
                  onClick={() => {
                    if (canContinue) setStep((value) => value + 1)
                  }}
                  disabled={!canContinue}
                  size="lg"
                >
                  {step === 1 ? 'Escolher data' : 'Rever marcação'}
                  <ArrowRight />
                </Button>
              ) : (
                <Button onClick={confirm} disabled={submitting || !time} size="lg">
                  {submitting ? <Loader2 className="size-4 animate-spin" /> : <CalendarCheckIcon />}
                  {submitting ? 'A enviar…' : 'Confirmar marcação'}
                </Button>
              )}
            </div>
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="overflow-hidden rounded-card border border-gold/20 bg-surface/70 shadow-glow">
              <div className="relative h-28 overflow-hidden">
                <img src={images.services} alt="" className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/40 to-transparent" />
                <p className="absolute bottom-3 left-4 text-[8.5px] uppercase tracking-[0.26em] text-gold/85">
                  O seu ritual
                </p>
              </div>
              <div className="p-5">
                {selectedService ? (
                  <>
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="font-serif text-[24px] leading-tight text-fg">{selectedService.name}</h3>
                      <span className="font-serif text-[22px] leading-none text-gold-soft">
                        {formatPrice(selectedService.price)}
                      </span>
                    </div>
                    <p className="mt-1 text-[9.5px] uppercase tracking-[0.16em] text-faint">
                      {formatDuration(selectedService.duration)} · IVA incluído
                    </p>

                    <div className="mt-4 flex flex-col gap-2 border-t border-line pt-4 text-[11.5px]">
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-faint">Dia</span>
                        <span className="text-right text-muted">
                          {date ? formatLongDate(date) : 'A escolher'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-faint">Hora</span>
                        <span className="text-muted">{time || 'A escolher'}</span>
                      </div>
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-faint">Cliente</span>
                        <span className="text-muted">{user.name}</span>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t border-gold/20 pt-4">
                      <span className="text-[9px] uppercase tracking-[0.22em] text-faint">Total</span>
                      <span className="font-serif text-[26px] leading-none text-gold-soft">
                        {formatPrice(selectedService.price)}
                      </span>
                    </div>
                    <p className="mt-2 text-[10px] text-faint">Pagamento na barbearia.</p>

                    {step > 1 && (
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="mt-4 text-[10px] uppercase tracking-[0.16em] text-gold/75 underline decoration-gold/25 underline-offset-4 transition-colors hover:text-gold"
                      >
                        Alterar serviço
                      </button>
                    )}
                  </>
                ) : (
                  <div className="py-6 text-center">
                    <Scissors className="mx-auto size-5 text-gold/50" />
                    <p className="mt-3 font-serif text-[20px] italic text-muted">Escolha um ritual para ver o resumo.</p>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-3 flex items-start gap-2.5 rounded-2xl border border-line bg-white/[0.02] p-4 text-[10.5px] leading-relaxed text-faint">
              <ShieldCheck className="mt-0.5 size-3.5 shrink-0 text-gold/60" />
              A marcação fica guardada na sua conta. Pode cancelar até ao dia do serviço.
            </div>

            <Link
              href="/conta"
              className="mt-4 inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.16em] text-faint transition-colors hover:text-gold"
            >
              Ver as minhas marcações
              <ArrowRight className="size-3" />
            </Link>
          </aside>
        </div>
      </Container>
    </main>
  )
}

function CalendarCheckIcon() {
  return <CalendarDays className="size-4" />
}

function addMinutes(time: string, minutes: number): string {
  const [hours, mins] = time.split(':').map(Number)
  const total = hours * 60 + mins + minutes
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`
}

import { CheckCircle2, Clock, LogOut, Phone, Scissors, ShieldCheck } from 'lucide-react'
import { useEffect, useState } from 'react'

import { Button } from '../components/Button'
import { Container } from '../components/Container'
import { Modal } from '../components/Modal'
import { PageLoader } from '../components/PageLoader'
import { Reveal } from '../components/Reveal'
import { StatusPill } from '../components/StatusPill'
import { Toast, useToast } from '../components/Toast'
import { contact } from '../content'
import { ApiError, api, type Appointment } from '../lib/api'
import { useAuth } from '../lib/auth'
import { dayNumber, formatDateTime, formatDuration, formatLongDate, formatPrice, isPastSlot, memberSince, monthShort } from '../lib/format'
import { Link, navigate } from '../lib/router'
import { serviceById } from '../shared/services'

function withService(appointment: Appointment): Appointment {
  return { ...appointment, service: serviceById(appointment.serviceId) }
}

export function Account() {
  const { user, loading, logout } = useAuth()
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loadingData, setLoadingData] = useState(true)
  const [error, setError] = useState('')
  const [cancelTarget, setCancelTarget] = useState<Appointment | null>(null)
  const [cancelling, setCancelling] = useState(false)
  const { toast, show } = useToast()

  useEffect(() => {
    if (!user) {
      setLoadingData(false)
      return
    }
    let cancelled = false
    setLoadingData(true)
    setError('')
    api
      .myAppointments()
      .then((data) => {
        if (!cancelled) setAppointments(data.appointments.map(withService))
      })
      .catch((caught) => {
        if (!cancelled) {
          setError(caught instanceof ApiError ? caught.message : 'Não foi possível carregar as marcações.')
        }
      })
      .finally(() => {
        if (!cancelled) setLoadingData(false)
      })
    return () => {
      cancelled = true
    }
  }, [user])

  if (loading) {
    return (
      <main className="pt-24">
        <PageLoader />
      </main>
    )
  }

  if (!user) {
    return (
      <main className="relative flex min-h-[80vh] items-center pb-20 pt-32">
        <Container>
          <div className="mx-auto max-w-md text-center">
            <span className="mx-auto grid size-14 place-items-center rounded-full border border-gold/25 bg-gold/[0.04]">
              <Scissors className="size-5 text-gold" />
            </span>
            <p className="mt-6 text-[9px] uppercase tracking-[0.32em] text-gold/80">A minha conta</p>
            <h1 className="mt-4 font-serif text-[40px] font-light leading-tight">O seu ritual continua aqui.</h1>
            <p className="mt-4 text-[13.5px] leading-relaxed text-muted">
              Entre para ver as suas marcações, cancelar horários e reservar o próximo momento.
            </p>
            <div className="mt-7 flex flex-col justify-center gap-2.5 sm:flex-row">
              <Button href="/entrar?next=%2Fconta" size="lg">
                Entrar
              </Button>
              <Button
                href="/entrar?modo=criar&next=%2Fconta"
                variant="outline"
                size="lg"
              >
                Criar conta
              </Button>
            </div>
          </div>
        </Container>
      </main>
    )
  }

  if (loadingData) {
    return (
      <main className="pt-24">
        <PageLoader label="A buscar as suas marcações…" />
      </main>
    )
  }

  const upcoming = appointments
    .filter(
      (appointment) =>
        (appointment.status === 'pendente' || appointment.status === 'confirmado') &&
        !isPastSlot(appointment.date, appointment.time),
    )
    .sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`))

  const history = appointments
    .filter((appointment) => !upcoming.some((item) => item.id === appointment.id))
    .sort((a, b) => `${b.date}${b.time}`.localeCompare(`${a.date}${a.time}`))

  const next = upcoming[0]
  const completed = appointments.filter((appointment) => appointment.status === 'concluido').length
  const initials = user.name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  const confirmCancel = async () => {
    if (!cancelTarget) return
    setCancelling(true)
    try {
      const { appointment } = await api.cancelAppointment(cancelTarget.id)
      setAppointments((current) =>
        current.map((item) =>
          item.id === appointment.id ? withService({ ...item, ...appointment }) : item,
        ),
      )
      setCancelTarget(null)
      show('A sua marcação foi cancelada.')
    } catch (caught) {
      show(caught instanceof ApiError ? caught.message : 'Não foi possível cancelar.', 'error')
    } finally {
      setCancelling(false)
    }
  }

  return (
    <main className="relative overflow-hidden pb-24 pt-[118px] sm:pt-[134px]">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 top-12 size-[380px] rounded-full bg-wine/15 blur-[120px]" />
        <div className="absolute inset-0 grain" />
      </div>

      <Container className="relative">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="flex items-center gap-3 text-[9px] uppercase tracking-[0.32em] text-gold/80">
              <span className="h-px w-7 bg-gold/50" />
              A minha conta
            </p>
            <h1 className="mt-4 font-serif text-[clamp(2.6rem,5vw,3.8rem)] font-light leading-[1.02] tracking-[-0.02em]">
              Olá, <em className="italic text-gold">{user.name.split(' ')[0]}.</em>
            </h1>
            <p className="mt-3 text-[13.5px] leading-relaxed text-muted">
              O seu próximo momento, num só lugar.
            </p>
          </div>
          <Button href="/marcar" size="lg">
            Nova marcação
          </Button>
        </div>

        <div className="mt-9 grid gap-6 lg:grid-cols-[1.45fr_0.75fr] lg:gap-8">
          <div>
            <Reveal>
              {next ? (
                <div className="relative overflow-hidden rounded-card border border-gold/20 bg-gradient-to-br from-wine/30 via-surface to-bg p-5 shadow-glow sm:p-7">
                  <div aria-hidden className="pointer-events-none absolute -right-12 -top-16 size-48 rounded-full border border-gold/10" />
                  <div aria-hidden className="pointer-events-none absolute inset-0 grain" />
                  <div className="relative flex flex-wrap items-center justify-between gap-3">
                    <p className="inline-flex items-center gap-2 text-[9px] uppercase tracking-[0.28em] text-gold/85">
                      <span className="size-1.5 animate-pulse-soft rounded-full bg-sage" />
                      A sua próxima visita
                    </p>
                    <StatusPill status={next.status} />
                  </div>

                  <div className="relative mt-6 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4 sm:gap-5">
                      <div className="flex size-[76px] shrink-0 flex-col items-center justify-center rounded-2xl border border-gold/25 bg-bg/40 sm:size-[86px]">
                        <span className="font-serif text-[34px] leading-none text-gold-soft sm:text-[38px]">
                          {dayNumber(next.date)}
                        </span>
                        <span className="mt-1 text-[8px] uppercase tracking-[0.2em] text-faint">
                          {monthShort(next.date)}
                        </span>
                      </div>
                      <div>
                        <h2 className="font-serif text-[26px] leading-tight text-fg sm:text-[30px]">
                          {next.service?.name}
                        </h2>
                        <p className="mt-1 text-[12px] text-muted">{formatLongDate(next.date)}</p>
                        <div className="mt-2 flex flex-wrap items-center gap-3 text-[11px] text-faint">
                          <span className="inline-flex items-center gap-1.5">
                            <Clock className="size-3 text-gold/50" />
                            {next.time} · {formatDuration(next.duration)}
                          </span>
                          <span className="font-serif text-[15px] text-gold-soft">
                            {formatPrice(next.service?.price ?? 0)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 sm:flex-col sm:items-end">
                      <button
                        type="button"
                        onClick={() => setCancelTarget(next)}
                        className="text-[10px] uppercase tracking-[0.16em] text-faint underline decoration-line-strong underline-offset-4 transition-colors hover:text-wine-soft"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>

                  <div className="relative mt-6 flex items-start gap-2.5 border-t border-gold/15 pt-4 text-[10.5px] leading-relaxed text-faint">
                    <ShieldCheck className="mt-0.5 size-3.5 shrink-0 text-gold/60" />
                    {next.status === 'pendente'
                      ? 'A Gabi vai confirmar este horário. Pode acompanhar o estado aqui.'
                      : 'Horário confirmado. Estamos à sua espera na Rua do Almada, 128.'}
                  </div>
                </div>
              ) : (
                <div className="relative overflow-hidden rounded-card border border-line bg-surface/50 p-8 text-center">
                  <span className="mx-auto grid size-12 place-items-center rounded-full border border-gold/20 bg-gold/[0.04]">
                    <Scissors className="size-5 text-gold/80" />
                  </span>
                  <h2 className="mt-4 font-serif text-[27px] leading-tight">Ainda não tem uma marcação.</h2>
                  <p className="mx-auto mt-2 max-w-xs text-[12.5px] leading-relaxed text-muted">
                    Escolha o seu ritual e reserve um momento só para si.
                  </p>
                  <Button href="/marcar" className="mt-5">
                    Marcar o primeiro horário
                  </Button>
                </div>
              )}
            </Reveal>

            {error && (
              <div className="mt-4 rounded-xl border border-wine-soft/25 bg-wine/10 px-4 py-3 text-[12px] text-wine-soft">
                {error}
              </div>
            )}

            <div className="mt-9">
              <div className="flex items-end justify-between border-b border-line pb-3">
                <h2 className="font-serif text-[25px] leading-none">Histórico</h2>
                <span className="text-[9px] uppercase tracking-[0.2em] text-faint">
                  {history.length} {history.length === 1 ? 'registo' : 'registos'}
                </span>
              </div>

              {history.length === 0 ? (
                <p className="mt-5 rounded-xl border border-dashed border-line px-4 py-6 text-center text-[12px] text-faint">
                  As visitas e marcações anteriores aparecem aqui.
                </p>
              ) : (
                <div className="mt-3 flex flex-col gap-2">
                  {history.map((appointment) => (
                    <div
                      key={appointment.id}
                      className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line bg-white/[0.015] px-4 py-3"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex w-11 shrink-0 flex-col items-center rounded-lg border border-line-strong py-1">
                          <span className="font-serif text-[17px] leading-none text-muted">
                            {dayNumber(appointment.date)}
                          </span>
                          <span className="mt-0.5 text-[7.5px] uppercase tracking-[0.14em] text-faint">
                            {monthShort(appointment.date)}
                          </span>
                        </div>
                        <div className="min-w-0">
                          <p className="truncate font-serif text-[17px] leading-tight text-fg/90">
                            {appointment.service?.name}
                          </p>
                          <p className="mt-0.5 text-[10px] text-faint">
                            {appointment.time} · {formatLongDate(appointment.date)} ·{' '}
                            {formatPrice(appointment.service?.price ?? 0)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <StatusPill status={appointment.status} />
                        {(appointment.status === 'pendente' || appointment.status === 'confirmado') &&
                          !isPastSlot(appointment.date, appointment.time) && (
                            <button
                              type="button"
                              onClick={() => setCancelTarget(appointment)}
                              className="text-[10px] uppercase tracking-[0.14em] text-faint transition-colors hover:text-wine-soft"
                            >
                              Cancelar
                            </button>
                          )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <aside className="flex flex-col gap-4">
            <Reveal delay={0.1} className="rounded-card border border-line bg-surface/60 p-5">
              <div className="flex items-center gap-3">
                <span className="grid size-12 shrink-0 place-items-center rounded-full border border-gold/30 bg-gold/[0.06] font-serif text-[18px] text-gold-soft">
                  {initials}
                </span>
                <div className="min-w-0">
                  <p className="truncate font-serif text-[21px] leading-tight">{user.name}</p>
                  <p className="text-[11px] text-faint">@{user.username}</p>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3 border-t border-line pt-4">
                <div>
                  <p className="font-serif text-[24px] leading-none text-gold-soft">{completed}</p>
                  <p className="mt-1 text-[8.5px] uppercase tracking-[0.18em] text-faint">Visitas</p>
                </div>
                <div>
                  <p className="font-serif text-[24px] leading-none text-gold-soft">{appointments.length}</p>
                  <p className="mt-1 text-[8.5px] uppercase tracking-[0.18em] text-faint">Marcações</p>
                </div>
              </div>

              <p className="mt-4 text-[10.5px] text-faint">
                Membro desde {memberSince(user.createdAt)}.
              </p>

              <div className="mt-5 flex flex-col gap-2">
                <Button href="/marcar" size="md" className="w-full">
                  Reservar novo horário
                </Button>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-full text-[10px] uppercase tracking-[0.16em] text-faint transition-colors hover:text-fg"
                >
                  <LogOut className="size-3.5" />
                  Terminar sessão
                </button>
              </div>
            </Reveal>

            <Reveal delay={0.16} className="rounded-card border border-line bg-white/[0.02] p-5">
              <p className="flex items-center gap-2 text-[9px] uppercase tracking-[0.22em] text-gold/70">
                <Phone className="size-3.5" />
                Falar connosco
              </p>
              <a
                href={contact.phone.href}
                className="mt-3 block font-serif text-[22px] text-fg transition-colors hover:text-gold-soft"
              >
                {contact.phone.label}
              </a>
              <p className="mt-1 text-[10.5px] leading-relaxed text-faint">
                Precisa de alterar algo com menos de 24 horas? Ligue-nos.
              </p>
            </Reveal>

            <Reveal delay={0.2} className="rounded-card border border-gold/15 bg-gold/[0.03] p-4">
              <p className="flex items-start gap-2 text-[10.5px] leading-relaxed text-muted">
                <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-gold/70" />
                Pode cancelar qualquer marcação futura diretamente nesta página.
              </p>
            </Reveal>
          </aside>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-5">
          <p className="text-[10px] text-faint">
            Última atualização: {formatDateTime(new Date().toISOString())}
          </p>
          <Link href="/" className="text-[10px] uppercase tracking-[0.16em] text-faint transition-colors hover:text-gold">
            Voltar ao site
          </Link>
        </div>
      </Container>

      <Modal
        open={Boolean(cancelTarget)}
        onClose={() => {
          if (!cancelling) setCancelTarget(null)
        }}
        title="Cancelar marcação?"
      >
        <p className="text-[13px] leading-relaxed text-muted">
          Vai cancelar{' '}
          <strong className="font-medium text-fg">{cancelTarget?.service?.name}</strong> em{' '}
          <strong className="font-medium text-fg">
            {cancelTarget ? formatLongDate(cancelTarget.date) : ''} às {cancelTarget?.time}
          </strong>
          . O horário volta a ficar disponível.
        </p>
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="outline" onClick={() => setCancelTarget(null)} disabled={cancelling}>
            Manter
          </Button>
          <Button variant="wine" onClick={confirmCancel} disabled={cancelling}>
            {cancelling ? 'A cancelar…' : 'Sim, cancelar'}
          </Button>
        </div>
      </Modal>

      <Toast toast={toast} />
    </main>
  )
}

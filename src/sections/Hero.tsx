import { motion, useMotionValue, useSpring, useTransform } from 'motion/react'
import { ArrowDown, ArrowUpRight, Scissors, Star } from 'lucide-react'
import type { PointerEvent } from 'react'

import { Button } from '../components/Button'
import { Container } from '../components/Container'
import { hero, images } from '../content'
import { Link } from '../lib/router'

const ease = [0.22, 1, 0.36, 1] as const

export function Hero() {
  const pointerX = useMotionValue(0)
  const pointerY = useMotionValue(0)
  const smoothX = useSpring(pointerX, { stiffness: 45, damping: 18 })
  const smoothY = useSpring(pointerY, { stiffness: 45, damping: 18 })
  const imageX = useTransform(smoothX, [-0.5, 0.5], [-9, 9])
  const imageY = useTransform(smoothY, [-0.5, 0.5], [-7, 7])
  const badgeX = useTransform(smoothX, [-0.5, 0.5], [7, -7])
  const badgeY = useTransform(smoothY, [-0.5, 0.5], [5, -5])

  const handlePointer = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType !== 'mouse') return
    const rect = event.currentTarget.getBoundingClientRect()
    pointerX.set((event.clientX - rect.left) / rect.width - 0.5)
    pointerY.set((event.clientY - rect.top) / rect.height - 0.5)
  }

  const resetPointer = () => {
    pointerX.set(0)
    pointerY.set(0)
  }

  return (
    <section
      onPointerMove={handlePointer}
      onPointerLeave={resetPointer}
      className="relative overflow-hidden pb-14 pt-[124px] sm:pt-[142px] lg:pb-20 lg:pt-[156px]"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-56 right-[-12%] size-[620px] rounded-full bg-wine/20 blur-[150px]" />
        <div className="absolute bottom-[-16%] left-[-8%] size-[420px] rounded-full bg-gold/[0.055] blur-[120px]" />
        <div className="absolute inset-0 grain" />
      </div>

      <Container className="relative">
        <div className="grid items-center gap-16 lg:grid-cols-[1.06fr_0.94fr] lg:gap-10">
          <div className="relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease }}
              className="flex items-center gap-3"
            >
              <span className="pole h-8 w-[3px] animate-pole opacity-80" aria-hidden />
              <span className="text-[10px] uppercase tracking-[0.34em] text-gold/85">{hero.eyebrow}</span>
            </motion.div>

            <h1 className="mt-7 font-serif text-[clamp(3.35rem,7.5vw,6.6rem)] font-light leading-[0.92] tracking-[-0.03em] text-fg">
              {hero.lines.map((line, index) => (
                <span key={line} className="block overflow-hidden pb-1">
                  <motion.span
                    className="block"
                    initial={{ y: '112%' }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.95, delay: 0.12 + index * 0.09, ease }}
                  >
                    {line}
                  </motion.span>
                </span>
              ))}
              <span className="block overflow-hidden pb-2">
                <motion.span
                  className="block animate-shimmer pr-2 italic gold-text"
                  initial={{ y: '112%' }}
                  animate={{ y: 0 }}
                  transition={{ duration: 1, delay: 0.32, ease }}
                >
                  {hero.emphasis}
                </motion.span>
              </span>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.42, ease }}
              className="mt-7 max-w-[29rem] text-pretty text-[15px] leading-[1.75] text-muted sm:text-[16px]"
            >
              {hero.description}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.52, ease }}
              className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center"
            >
              <Button href={hero.primary.href} size="lg">
                {hero.primary.label}
                <ArrowUpRight />
              </Button>
              <Button href={hero.secondary.href} variant="outline" size="lg">
                {hero.secondary.label}
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.9, delay: 0.7 }}
              className="mt-10 flex flex-wrap items-center gap-x-5 gap-y-3"
            >
              <div className="flex items-center gap-2.5">
                <span className="flex gap-0.5 text-gold">
                  {[0, 1, 2, 3, 4].map((star) => (
                    <Star key={star} className="size-3" fill="currentColor" strokeWidth={0} />
                  ))}
                </span>
                <span className="text-[12px] text-fg">
                  {hero.rating.score}
                  <span className="text-faint"> · {hero.rating.reviews}</span>
                </span>
              </div>
              <span aria-hidden className="hidden h-3 w-px bg-line-strong sm:block" />
              <p className="text-[11px] uppercase tracking-[0.16em] text-faint">
                {hero.rating.clients} clientes
              </p>
              <span aria-hidden className="hidden h-3 w-px bg-line-strong sm:block" />
              <p className="inline-flex items-center gap-1.5 text-[11px] text-muted">
                <span className="size-1.5 animate-pulse-soft rounded-full bg-sage" />
                {hero.note}
              </p>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 28, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1.1, delay: 0.3, ease }}
            className="relative mx-auto w-full max-w-[420px] lg:max-w-[436px]"
          >
            <div
              aria-hidden
              className="arch absolute -inset-4 border border-gold/15 sm:-inset-5"
            />
            <div
              aria-hidden
              className="absolute inset-x-10 -bottom-6 h-24 rounded-full bg-wine/25 blur-3xl"
            />

            <motion.div style={{ x: imageX, y: imageY }} className="arch relative overflow-hidden border border-gold/25 bg-surface">
              <div className="relative aspect-[4/5] overflow-hidden">
                <img
                  src={images.hero}
                  alt="Barbeiro a aparar a barba de um cliente com navalha, num ambiente de luz quente"
                  className="h-full w-full scale-[1.02] object-cover object-center"
                  loading="eager"
                  fetchPriority="high"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/10 to-bg/20" />
                <div className="absolute inset-0 bg-[radial-gradient(80%_60%_at_50%_100%,rgb(10_7_8/0.25),transparent)]" />

                <div className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-4">
                  <div>
                    <span className="mb-2 block h-px w-8 bg-gold/70" />
                    <p className="font-serif text-[18px] italic text-gold-soft">{hero.imageCaption}</p>
                    <p className="mt-1 text-[9px] uppercase tracking-[0.24em] text-faint">Barbearia da Gabi</p>
                  </div>
                  <span className="mb-1 hidden text-[9px] uppercase tracking-[0.3em] text-faint sm:block">
                    Est. 2016
                  </span>
                </div>
              </div>
            </motion.div>

            <motion.div
              style={{ x: badgeX, y: badgeY }}
              aria-hidden
              className="absolute -left-5 bottom-[4.5rem] grid size-[104px] place-items-center rounded-full border border-gold/25 bg-bg/85 shadow-glow backdrop-blur-md sm:-left-7 sm:size-[118px]"
            >
              <svg viewBox="0 0 100 100" className="absolute inset-0 size-full animate-turn">
                <defs>
                  <path id="hero-badge-arc" d="M 50,50 m -37,0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" />
                </defs>
                <text
                  fill="currentColor"
                  className="text-gold/75"
                  style={{ fontFamily: 'Jost, sans-serif', fontSize: '6.4px', letterSpacing: '0.23em' }}
                >
                  <textPath href="#hero-badge-arc">BARBEARIA DA GABI · EST. 2016 · PORTO ·</textPath>
                </text>
              </svg>
              <Scissors className="size-5 text-gold" strokeWidth={1.2} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8, ease }}
              className="absolute -right-3 top-10 z-20 w-[186px] sm:-right-8 sm:w-[206px]"
            >
              <Link
                href="/marcar"
                className="group block animate-float rounded-2xl border border-gold/20 bg-bg/80 p-4 shadow-glow backdrop-blur-xl transition-colors hover:border-gold/45"
              >
                <span className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 text-[8.5px] uppercase tracking-[0.24em] text-gold">
                    <span className="size-1.5 rounded-full bg-sage" />
                    Agenda aberta
                  </span>
                  <ArrowUpRight className="size-3.5 text-gold transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </span>
                <span className="mt-3 block font-serif text-[21px] leading-[1.05] text-fg">
                  Escolha o seu
                  <br />
                  <span className="italic text-gold-soft">horário.</span>
                </span>
                <span className="mt-2 block text-[10px] tracking-wide text-faint">Terça a sábado · 09:00—19:30</span>
              </Link>
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-5 sm:mt-20"
        >
          <span className="inline-flex items-center gap-2.5 text-[9.5px] uppercase tracking-[0.28em] text-faint">
            <ArrowDown className="size-3.5 animate-float text-gold/70" />
            Descubra a barbearia
          </span>
          <span className="hidden text-[9.5px] uppercase tracking-[0.28em] text-faint sm:block">
            Rua do Almada, 128 · Porto
          </span>
          <span className="text-[9.5px] uppercase tracking-[0.28em] text-faint">Cortes · Barbas · Cuidado</span>
        </motion.div>
      </Container>
    </section>
  )
}

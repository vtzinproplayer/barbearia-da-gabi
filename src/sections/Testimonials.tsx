import { AnimatePresence, motion } from 'motion/react'
import { ArrowLeft, ArrowRight, Star } from 'lucide-react'
import { useEffect, useState } from 'react'

import { Container } from '../components/Container'
import { SectionHeading } from '../components/SectionHeading'
import { testimonials } from '../content'

const ease = [0.22, 1, 0.36, 1] as const

export function Testimonials() {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const current = testimonials[index]

  useEffect(() => {
    if (paused) return
    const timer = window.setInterval(() => {
      setIndex((value) => (value + 1) % testimonials.length)
    }, 7000)
    return () => window.clearInterval(timer)
  }, [paused, index])

  const go = (direction: number) => {
    setIndex((value) => (value + direction + testimonials.length) % testimonials.length)
  }

  const initials = current.name
    .split(' ')
    .map((part) => part[0])
    .join('')

  return (
    <section
      className="relative overflow-hidden border-b border-line bg-surface/30 py-24 sm:py-32"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/2 size-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-wine/[0.14] blur-[130px]" />
        <span className="absolute right-[-3%] top-10 select-none font-serif text-[26vw] italic leading-none text-gold/[0.03]">
          Gabi
        </span>
        <div className="absolute inset-0 grain" />
      </div>

      <Container className="relative">
        <SectionHeading
          eyebrow="Testemunhos"
          title={
            <>
              Quem se senta
              <br />
              <em className="italic text-gold">nesta cadeira.</em>
            </>
          }
          align="center"
          className="max-w-xl"
        />

        <div className="relative mx-auto mt-12 max-w-3xl">
          <div className="relative min-h-[288px] px-2 sm:min-h-[260px] sm:px-14">
            <span
              aria-hidden
              className="absolute -left-1 -top-8 select-none font-serif text-[100px] leading-none text-gold/15 sm:-left-4 sm:-top-10 sm:text-[140px]"
            >
              “
            </span>

            <AnimatePresence mode="wait">
              <motion.blockquote
                key={index}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.45, ease }}
                aria-live="polite"
                className="relative flex flex-col items-center text-center"
              >
                <div className="flex gap-1 text-gold">
                  {[0, 1, 2, 3, 4].map((star) => (
                    <Star key={star} className="size-3" fill="currentColor" strokeWidth={0} />
                  ))}
                </div>
                <p className="mt-6 text-pretty font-serif text-[clamp(1.45rem,3.3vw,2.35rem)] font-light italic leading-[1.35] text-fg">
                  {current.quote}
                </p>
                <footer className="mt-7 flex items-center gap-3">
                  <span className="grid size-9 place-items-center rounded-full border border-gold/30 bg-gold/[0.06] font-serif text-[12px] text-gold-soft">
                    {initials}
                  </span>
                  <div className="text-left">
                    <p className="text-[12px] font-medium text-fg">{current.name}</p>
                    <p className="text-[9.5px] uppercase tracking-[0.2em] text-faint">{current.service}</p>
                  </div>
                </footer>
              </motion.blockquote>
            </AnimatePresence>
          </div>

          <div className="mt-8 flex items-center justify-between border-t border-line pt-5">
            <span className="font-serif text-[13px] italic text-faint">
              0{index + 1} <span className="text-faint/60">/ 0{testimonials.length}</span>
            </span>

            <div className="flex items-center gap-1.5" aria-label="Escolher testemunho">
              {testimonials.map((testimonial, dotIndex) => (
                <button
                  key={testimonial.name}
                  type="button"
                  onClick={() => setIndex(dotIndex)}
                  aria-label={`Ver testemunho de ${testimonial.name}`}
                  aria-current={dotIndex === index}
                  className={
                    dotIndex === index
                      ? 'h-1.5 w-7 rounded-full bg-gold transition-all duration-300'
                      : 'h-1.5 w-1.5 rounded-full bg-line-strong transition-all duration-300 hover:bg-gold/50'
                  }
                />
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label="Testemunho anterior"
                className="grid size-9 place-items-center rounded-full border border-line-strong text-muted transition-colors hover:border-gold/50 hover:text-gold"
              >
                <ArrowLeft className="size-3.5" />
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                aria-label="Testemunho seguinte"
                className="grid size-9 place-items-center rounded-full border border-line-strong text-muted transition-colors hover:border-gold/50 hover:text-gold"
              >
                <ArrowRight className="size-3.5" />
              </button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}

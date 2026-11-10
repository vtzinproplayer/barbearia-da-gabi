import { ArrowUpRight, Clock } from 'lucide-react'

import { Button } from '../components/Button'
import { Container } from '../components/Container'
import { Reveal } from '../components/Reveal'
import { cta, images } from '../content'

export function CtaBand() {
  return (
    <section className="relative overflow-hidden">
      <div aria-hidden className="absolute inset-0">
        <img src={images.cta} alt="" className="h-full w-full object-cover object-center" loading="lazy" />
        <div className="absolute inset-0 bg-bg/65" />
        <div className="absolute inset-0 bg-gradient-to-r from-bg via-wine/25 to-bg" />
        <div className="absolute inset-0 grain" />
      </div>

      <Container className="relative py-20 sm:py-28">
        <Reveal className="mx-auto max-w-3xl">
          <div className="relative overflow-hidden rounded-[32px] border border-gold/20 bg-bg/55 px-6 py-14 text-center shadow-glow backdrop-blur-md sm:px-14 sm:py-16">
            <span aria-hidden className="absolute left-1/2 top-0 h-px w-24 -translate-x-1/2 bg-gold/60" />
            <span aria-hidden className="absolute -left-16 -top-16 size-40 rounded-full border border-gold/10" />
            <span aria-hidden className="absolute -bottom-20 -right-12 size-48 rounded-full border border-gold/10" />

            <p className="text-[9px] uppercase tracking-[0.34em] text-gold/80">{cta.eyebrow}</p>
            <h2 className="mt-5 text-balance font-serif text-[clamp(2.6rem,6vw,4.6rem)] font-light leading-[0.98] tracking-[-0.02em]">
              Reserve o seu <em className="italic text-gold-soft">momento.</em>
            </h2>
            <p className="mx-auto mt-5 max-w-md text-pretty text-[14px] leading-relaxed text-muted">
              {cta.description}
            </p>
            <div className="mt-8 flex flex-col items-center gap-4">
              <Button href={cta.primary.href} size="lg">
                {cta.primary.label}
                <ArrowUpRight />
              </Button>
              <span className="inline-flex items-center gap-2 text-[9.5px] uppercase tracking-[0.24em] text-faint">
                <Clock className="size-3 text-gold/60" />
                {cta.note}
              </span>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  )
}

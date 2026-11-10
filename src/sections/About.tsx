import { motion, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'

import { Container } from '../components/Container'
import { Reveal } from '../components/Reveal'
import { SectionHeading } from '../components/SectionHeading'
import { about, images } from '../content'

export function About() {
  const frame = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: frame, offset: ['start end', 'end start'] })
  const imageY = useTransform(scrollYProgress, [0, 1], [26, -26])

  return (
    <section id="barbearia" className="relative overflow-hidden border-b border-line bg-surface/25 py-24 sm:py-32">
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 top-1/3 size-[420px] rounded-full bg-wine/[0.13] blur-[130px]" />
        <div className="absolute inset-0 grain" />
      </div>

      <Container className="relative">
        <div className="grid items-center gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <Reveal className="relative">
            <div ref={frame} className="arch relative overflow-hidden border border-gold/20 bg-surface">
              <div className="relative h-[420px] overflow-hidden sm:h-[540px]">
                <motion.img
                  style={{ y: imageY }}
                  src={images.about}
                  alt="Barbeiro a trabalhar o cabelo de um cliente num ambiente de barbearia"
                  className="h-[112%] w-full scale-105 object-cover object-center"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/10 to-transparent" />
                <div className="absolute inset-x-6 bottom-6">
                  <span className="mb-2 block h-px w-9 bg-gold/60" />
                  <p className="font-serif text-[19px] italic text-gold-soft">{about.imageCaption}</p>
                </div>
              </div>
            </div>

            <div className="absolute -right-3 top-8 flex flex-col items-center gap-1 rounded-2xl border border-gold/20 bg-bg/80 px-4 py-3 backdrop-blur-md sm:-right-5">
              <span className="text-[8px] uppercase tracking-[0.28em] text-gold/70">Desde</span>
              <span className="font-serif text-[26px] leading-none text-fg">2016</span>
            </div>
            <div className="absolute -left-3 bottom-14 hidden h-24 w-[3px] animate-pole pole opacity-60 sm:block" aria-hidden />
          </Reveal>

          <div>
            <SectionHeading
              eyebrow={about.eyebrow}
              title={
                <>
                  Um ritual à sua medida,{' '}
                  <em className="italic text-gold">no coração do Porto.</em>
                </>
              }
            />

            <div className="mt-6 flex flex-col gap-4 text-[14.5px] leading-[1.8] text-muted">
              {about.paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 24)}>{paragraph}</p>
              ))}
            </div>

            <Reveal delay={0.1}>
              <figure className="mt-8 border-l border-gold/40 pl-5">
                <blockquote className="font-serif text-[22px] font-light italic leading-[1.35] text-fg/95 sm:text-[25px]">
                  “{about.quote}”
                </blockquote>
                <figcaption className="mt-3 flex items-center gap-3 text-[9px] uppercase tracking-[0.26em] text-faint">
                  <span className="h-px w-6 bg-gold/50" />
                  {about.signature} · {about.role}
                </figcaption>
              </figure>
            </Reveal>

            <div className="mt-9 flex flex-col">
              {about.values.map((value, index) => (
                <Reveal key={value.title} delay={0.08 + index * 0.05}>
                  <div className="grid grid-cols-[1.6rem_1fr] gap-4 border-t border-line py-4">
                    <span className="pt-0.5 font-serif text-[12px] italic text-gold/50">0{index + 1}</span>
                    <div>
                      <p className="text-[12px] font-medium uppercase tracking-[0.12em] text-gold-soft">{value.title}</p>
                      <p className="mt-1 text-[12.5px] leading-relaxed text-muted">{value.text}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>

        <Reveal className="mt-16 overflow-hidden rounded-card border border-line bg-line sm:mt-20">
          <div className="grid grid-cols-2 gap-px md:grid-cols-4">
            {about.stats.map((stat) => (
              <div key={stat.label} className="bg-surface px-5 py-7 text-center sm:px-7 sm:py-8 sm:text-left">
                <p className="font-serif text-[34px] font-light leading-none text-gold-soft sm:text-[40px]">
                  {stat.value}
                </p>
                <p className="mt-2 text-[9px] uppercase tracking-[0.24em] text-faint">{stat.label}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </Container>
    </section>
  )
}

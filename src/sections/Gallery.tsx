import { motion } from 'motion/react'
import { ArrowUpRight } from 'lucide-react'
import { useState } from 'react'

import { Container } from '../components/Container'
import { Modal } from '../components/Modal'
import { Reveal } from '../components/Reveal'
import { SectionHeading } from '../components/SectionHeading'
import { gallery, type GalleryLayout } from '../content'
import { cx } from '../lib/cx'

const layoutClass: Record<GalleryLayout, string> = {
  wide: 'col-span-2 row-span-2',
  tall: 'row-span-2',
  normal: '',
}

export function Gallery() {
  const [active, setActive] = useState<(typeof gallery.items)[number] | null>(null)

  return (
    <section id="galeria" className="relative border-b border-line py-24 sm:py-32">
      <Container>
        <div className="flex flex-col justify-between gap-7 md:flex-row md:items-end">
          <SectionHeading
            eyebrow={gallery.eyebrow}
            title={
              <>
                Pequenos detalhes,
                <br />
                <em className="italic text-gold">grandes rituais.</em>
              </>
            }
          />
          <Reveal delay={0.1} className="max-w-xs md:text-right">
            <p className="text-[13px] leading-relaxed text-muted">{gallery.description}</p>
            <span className="mt-4 inline-flex items-center gap-2 text-[9px] uppercase tracking-[0.26em] text-gold/70">
              <span className="h-px w-6 bg-gold/50" />
              Clique para ampliar
            </span>
          </Reveal>
        </div>

        <div className="mt-12 grid auto-rows-[150px] grid-cols-2 gap-3 sm:auto-rows-[180px] md:grid-cols-4 md:auto-rows-[200px]">
          {gallery.items.map((item, index) => (
            <Reveal
              key={item.src}
              delay={index * 0.06}
              className={cx('group relative', layoutClass[item.layout])}
            >
              <button
                type="button"
                onClick={() => setActive(item)}
                className="relative h-full w-full overflow-hidden rounded-[20px] border border-line bg-surface text-left transition-colors duration-500 hover:border-gold/40"
                aria-label={`Ampliar fotografia: ${item.caption}`}
              >
                <img
                  src={item.src}
                  alt={item.alt}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.06]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/10 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-95" />
                <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-3">
                  <div>
                    <p className="text-[8px] uppercase tracking-[0.24em] text-gold/70">
                      0{index + 1} · {item.layout === 'wide' ? 'O espaço' : 'Detalhe'}
                    </p>
                    <p className="mt-1 font-serif text-[17px] italic text-fg">{item.caption}</p>
                  </div>
                  <span className="grid size-8 shrink-0 place-items-center rounded-full border border-gold/25 bg-bg/50 text-gold opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:opacity-100">
                    <ArrowUpRight className="size-3.5" />
                  </span>
                </div>
              </button>
            </Reveal>
          ))}

          <Reveal delay={0.3} className="col-span-2">
            <div className="relative flex h-full flex-col justify-between overflow-hidden rounded-[20px] border border-gold/20 bg-gradient-to-br from-wine/35 via-surface to-bg p-5 sm:p-6">
              <div aria-hidden className="absolute inset-0 grain" />
              <span aria-hidden className="select-none font-serif text-[64px] leading-[0.5] text-gold/30">“</span>
              <div className="relative mt-4">
                <p className="max-w-[260px] font-serif text-[24px] font-light italic leading-[1.15] text-fg sm:text-[28px]">
                  Cada detalhe conta. Cada visita é sua.
                </p>
                <p className="mt-3 text-[9px] uppercase tracking-[0.26em] text-gold/70">Gabi · fundadora</p>
              </div>
              <motion.span
                aria-hidden
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                className="absolute -right-7 -top-7 size-24 rounded-full border border-gold/15 border-dashed"
              />
            </div>
          </Reveal>
        </div>
      </Container>

      <Modal open={Boolean(active)} onClose={() => setActive(null)} title={active?.caption ?? ''} wide>
        {active && (
          <figure>
            <img
              src={active.src}
              alt={active.alt}
              className="max-h-[62vh] w-full rounded-2xl border border-line object-cover"
            />
            <figcaption className="mt-4 text-[12px] leading-relaxed text-muted">{active.alt}</figcaption>
          </figure>
        )}
      </Modal>
    </section>
  )
}

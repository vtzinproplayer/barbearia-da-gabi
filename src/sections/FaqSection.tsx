import { AnimatePresence, motion } from 'motion/react'
import { Mail, Phone, Plus } from 'lucide-react'
import { useState } from 'react'

import { Container } from '../components/Container'
import { Reveal } from '../components/Reveal'
import { SectionHeading } from '../components/SectionHeading'
import { contact, faq } from '../content'
import { cx } from '../lib/cx'

const ease = [0.22, 1, 0.36, 1] as const

export function FaqSection() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section className="relative py-24 sm:py-32">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <SectionHeading
              eyebrow={faq.eyebrow}
              title={
                <>
                  Tudo o que precisa
                  <br />
                  de <em className="italic text-gold">saber.</em>
                </>
              }
              description={faq.description}
            />

            <Reveal delay={0.12} className="mt-8 rounded-card border border-line bg-surface/50 p-5">
              <p className="text-[9px] uppercase tracking-[0.26em] text-gold/70">Prefere falar connosco?</p>
              <p className="mt-2 font-serif text-[20px] italic text-fg">Estamos por aqui.</p>
              <div className="mt-4 flex flex-col gap-2.5">
                <a
                  href={contact.phone.href}
                  className="group flex items-center gap-2.5 text-[13px] text-muted transition-colors hover:text-fg"
                >
                  <Phone className="size-3.5 text-gold/70" />
                  {contact.phone.label}
                </a>
                <a
                  href={contact.email.href}
                  className="group flex items-center gap-2.5 text-[13px] text-muted transition-colors hover:text-fg"
                >
                  <Mail className="size-3.5 text-gold/70" />
                  {contact.email.label}
                </a>
              </div>
            </Reveal>
          </div>

          <div className="border-t border-line">
            {faq.items.map((item, index) => {
              const isOpen = open === index
              return (
                <Reveal key={item.q} delay={Math.min(index * 0.04, 0.2)} y={10}>
                  <div className="border-b border-line">
                    <button
                      type="button"
                      onClick={() => setOpen(isOpen ? null : index)}
                      aria-expanded={isOpen}
                      className="group flex w-full items-center justify-between gap-6 py-5 text-left"
                    >
                      <span
                        className={cx(
                          'font-serif text-[19px] font-normal leading-snug transition-colors duration-300 sm:text-[22px]',
                          isOpen ? 'text-gold-soft' : 'text-fg group-hover:text-gold-soft',
                        )}
                      >
                        {item.q}
                      </span>
                      <span
                        className={cx(
                          'grid size-8 shrink-0 place-items-center rounded-full border transition-all duration-300',
                          isOpen
                            ? 'rotate-45 border-gold/50 bg-gold/10 text-gold'
                            : 'border-line-strong text-muted group-hover:border-gold/40 group-hover:text-gold',
                        )}
                      >
                        <Plus className="size-3.5" />
                      </span>
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          key="answer"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.32, ease }}
                          className="overflow-hidden"
                        >
                          <p className="max-w-xl pb-6 pr-10 text-[13.5px] leading-[1.75] text-muted">{item.a}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </Reveal>
              )
            })}
          </div>
        </div>
      </Container>
    </section>
  )
}

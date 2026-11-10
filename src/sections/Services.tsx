import { ArrowUpRight } from 'lucide-react'

import { Button } from '../components/Button'
import { Container } from '../components/Container'
import { Reveal } from '../components/Reveal'
import { SectionHeading } from '../components/SectionHeading'
import { images, services } from '../content'
import { formatDuration, formatPrice } from '../lib/format'
import { Link } from '../lib/router'

export function Services() {
  return (
    <section id="servicos" className="relative border-b border-line py-24 sm:py-32">
      <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 w-1/2 ruled opacity-40" />
      <Container className="relative">
        <div className="grid gap-14 lg:grid-cols-[0.82fr_1.18fr] lg:gap-20">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <SectionHeading
              eyebrow={services.eyebrow}
              title={
                <>
                  Rituais para
                  <br />
                  <em className="italic text-gold">o seu estilo.</em>
                </>
              }
              description={services.description}
            />

            <Reveal delay={0.1} className="relative mt-9 hidden max-w-[308px] sm:block">
              <div className="arch relative overflow-hidden border border-gold/20 bg-surface">
                <img
                  src={images.services}
                  alt="Máquinas, tesouras e produtos de barbearia sobre uma bancada de madeira"
                  className="h-[320px] w-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/20 to-transparent" />
                <div className="absolute inset-x-5 bottom-5">
                  <span className="mb-2 block h-px w-7 bg-gold/70" />
                  <p className="font-serif text-[18px] italic leading-snug text-gold-soft">
                    Não é só um corte.
                    <br />
                    É a sua assinatura.
                  </p>
                </div>
              </div>
              <span className="absolute -bottom-3 -right-3 rounded-full border border-gold/25 bg-bg px-3 py-1.5 text-[9px] uppercase tracking-[0.22em] text-gold/80">
                6 rituais
              </span>
            </Reveal>

            <Reveal delay={0.16} className="mt-8 flex flex-wrap items-center gap-4">
              <Button href="/marcar" variant="outline">
                Marcar horário
                <ArrowUpRight />
              </Button>
              <span className="max-w-[200px] text-[11px] leading-relaxed text-faint">
                Escolha o serviço ao marcar — ou fale connosco à chegada.
              </span>
            </Reveal>
          </div>

          <div>
            <div className="flex items-baseline justify-between border-b border-gold/20 pb-3">
              <span className="text-[9px] uppercase tracking-[0.3em] text-gold/70">Menu de serviços</span>
              <span className="text-[9px] uppercase tracking-[0.22em] text-faint">Duração · valor</span>
            </div>

            {services.items.map((service, index) => (
              <Reveal key={service.id} delay={Math.min(index * 0.06, 0.3)} y={14}>
                <Link
                  href={`/marcar?servico=${service.id}`}
                  className="group grid grid-cols-[2rem_1fr_auto] items-center gap-4 border-b border-line py-6 transition-colors duration-300 hover:bg-gold/[0.025] sm:grid-cols-[2.6rem_1fr_auto_1.4rem] sm:gap-6 lg:-mx-4 lg:rounded-xl lg:px-4"
                >
                  <span className="self-start pt-1.5 font-serif text-[13px] italic text-gold/50 transition-colors group-hover:text-gold">
                    0{index + 1}
                  </span>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <h3 className="font-serif text-[25px] font-normal leading-tight text-fg transition-colors duration-300 group-hover:text-gold-soft sm:text-[29px]">
                        {service.name}
                      </h3>
                      {service.tag && (
                        <span className="rounded-full border border-gold/25 bg-gold/[0.05] px-2 py-0.5 text-[7.5px] uppercase tracking-[0.18em] text-gold/85">
                          {service.tag}
                        </span>
                      )}
                    </div>
                    <p className="mt-1.5 max-w-md text-[12.5px] leading-relaxed text-muted sm:text-[13px]">
                      {service.description}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-serif text-[19px] leading-none text-gold-soft transition-transform duration-300 group-hover:-translate-y-0.5 sm:text-[21px]">
                      {formatPrice(service.price)}
                    </p>
                    <p className="mt-1.5 text-[9px] uppercase tracking-[0.18em] text-faint">
                      {formatDuration(service.duration)}
                    </p>
                  </div>
                  <ArrowUpRight className="hidden size-4 justify-self-end text-gold opacity-0 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100 sm:block" />
                </Link>
              </Reveal>
            ))}

            <p className="mt-6 max-w-lg text-[11.5px] leading-relaxed text-faint">{services.note}</p>
          </div>
        </div>
      </Container>
    </section>
  )
}

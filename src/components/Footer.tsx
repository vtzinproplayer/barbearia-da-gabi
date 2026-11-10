import { ArrowUpRight, Mail, MapPin, MessageCircle, Phone } from 'lucide-react'

import { brand, contact, footer, hours, nav } from '../content'
import { Link } from '../lib/router'
import { Container } from './Container'
import { Logo } from './Logo'

export function Footer() {
  return (
    <footer id="contactos" className="relative overflow-hidden border-t border-line pt-16 pb-8">
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <span className="absolute -bottom-24 right-[-2%] font-serif text-[26vw] italic leading-none text-gold/[0.035]">
          Gabi
        </span>
        <div className="absolute left-1/2 top-0 h-px w-2/3 -translate-x-1/2 hairline" />
      </div>

      <Container className="relative">
        <div className="grid gap-12 lg:grid-cols-[1.35fr_0.7fr_0.9fr_1fr]">
          <div>
            <Logo />
            <p className="mt-5 max-w-xs text-[14px] leading-relaxed text-muted">{footer.blurb}</p>
            <div className="mt-6 flex items-center gap-2">
              <a
                href={contact.instagram.href}
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram da Barbearia da Gabi"
                className="grid size-10 place-items-center rounded-full border border-line-strong text-muted transition-colors hover:border-gold/50 hover:text-gold"
              >
                <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.2" cy="6.8" r="0.8" fill="currentColor" stroke="none" />
                </svg>
              </a>
              <a
                href={contact.whatsapp.href}
                target="_blank"
                rel="noreferrer"
                aria-label="WhatsApp da Barbearia da Gabi"
                className="grid size-10 place-items-center rounded-full border border-line-strong text-muted transition-colors hover:border-gold/50 hover:text-gold"
              >
                <MessageCircle className="size-4" />
              </a>
              <a
                href={contact.email.href}
                aria-label="Enviar email à Barbearia da Gabi"
                className="grid size-10 place-items-center rounded-full border border-line-strong text-muted transition-colors hover:border-gold/50 hover:text-gold"
              >
                <Mail className="size-4" />
              </a>
            </div>
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-gold/70">Explorar</p>
            <ul className="mt-5 flex flex-col gap-3">
              {nav.links.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-[14px] text-muted transition-colors hover:text-fg">
                    {link.label}
                  </a>
                </li>
              ))}
              <li>
                <Link href="/marcar" className="text-[14px] text-muted transition-colors hover:text-fg">
                  Marcar horário
                </Link>
              </li>
              <li>
                <Link href="/entrar" className="text-[14px] text-muted transition-colors hover:text-fg">
                  Entrar na conta
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-gold/70">Horário</p>
            <ul className="mt-5 flex flex-col gap-3.5">
              {hours.map((row) => (
                <li key={row.days} className="flex flex-col gap-0.5">
                  <span className="text-[13px] text-fg">{row.days}</span>
                  <span className="text-[12px] text-faint">{row.time}</span>
                </li>
              ))}
            </ul>
            <p className="mt-5 text-[11px] leading-relaxed text-faint">
              Atendimento por marcação. A agenda abre com 3 semanas de antecedência.
            </p>
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-gold/70">Visite-nos</p>
            <a
              href={contact.maps}
              target="_blank"
              rel="noreferrer"
              className="group mt-5 flex items-start gap-3 text-[14px] leading-relaxed text-muted transition-colors hover:text-fg"
            >
              <MapPin className="mt-0.5 size-4 shrink-0 text-gold/70" />
              <span>
                {contact.address}
                <br />
                {contact.addressLine2}
                <span className="mt-1 flex items-center gap-1 text-[12px] text-gold/70">
                  Abrir no mapa <ArrowUpRight className="size-3" />
                </span>
              </span>
            </a>
            <a
              href={contact.phone.href}
              className="mt-4 flex items-center gap-3 text-[14px] text-muted transition-colors hover:text-fg"
            >
              <Phone className="size-4 text-gold/70" />
              {contact.phone.label}
            </a>
            <a
              href={contact.email.href}
              className="mt-3 flex items-center gap-3 text-[14px] text-muted transition-colors hover:text-fg"
            >
              <Mail className="size-4 text-gold/70" />
              {contact.email.label}
            </a>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[12px] text-faint">{footer.legal}</p>
          <div className="flex items-center gap-4 text-[11px] text-faint">
            <span className="inline-flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-sage" />
              {brand.city} · {brand.since}
            </span>
            <Link href="/entrar" className="transition-colors hover:text-gold">
              Área da Gabi
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  )
}

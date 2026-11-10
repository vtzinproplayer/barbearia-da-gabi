import { AnimatePresence, motion } from 'motion/react'
import { ArrowUpRight, LogOut, User } from 'lucide-react'
import { useEffect, useState } from 'react'

import { nav } from '../content'
import { useAuth } from '../lib/auth'
import { cx } from '../lib/cx'
import { Link, navigate, useRoute } from '../lib/router'
import { Button } from './Button'
import { Logo } from './Logo'

const ease = [0.22, 1, 0.36, 1] as const

export function Nav() {
  const { user, loading, logout } = useAuth()
  const { path } = useRoute()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setOpen(false)
  }, [path])

  useEffect(() => {
    const previous = document.body.style.overflow
    document.body.style.overflow = open ? 'hidden' : previous
    return () => {
      document.body.style.overflow = previous
    }
  }, [open])

  const handleLogout = async () => {
    setOpen(false)
    await logout()
    navigate('/')
  }

  const firstName = user?.name.split(' ')[0] ?? ''
  const isHome = path === '/'

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div
        aria-hidden
        className={cx(
          'absolute inset-0 -z-10 border-b transition-all duration-500',
          scrolled || open
            ? 'border-line bg-bg/85 backdrop-blur-xl'
            : 'border-transparent bg-gradient-to-b from-bg/80 via-bg/30 to-transparent',
        )}
      />

      <div className="mx-auto flex h-[76px] w-full max-w-[1280px] items-center justify-between px-5 sm:px-8">
        <Logo />

        <nav
          aria-label="Navegação principal"
          className={cx(
            'absolute left-1/2 hidden -translate-x-1/2 items-center gap-0.5 rounded-full border px-1.5 py-1.5 transition-colors duration-500 lg:flex',
            scrolled ? 'border-line bg-white/[0.025]' : 'border-transparent',
          )}
        >
          {nav.links.map((link) => (
            <a
              key={link.label}
              href={isHome ? link.href.replace('/', '') : link.href}
              className="rounded-full px-4 py-2 text-[10.5px] uppercase tracking-[0.2em] text-muted transition-colors hover:bg-white/[0.04] hover:text-fg"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {loading ? (
            <span aria-hidden className="h-9 w-24 animate-pulse rounded-full bg-white/[0.05]" />
          ) : user ? (
            <>
              <Link
                href={user.role === 'owner' ? '/painel' : '/conta'}
                className="inline-flex h-9 items-center gap-2 rounded-full px-3 text-[12px] text-muted transition-colors hover:bg-white/[0.04] hover:text-fg"
              >
                <User className="size-3.5 text-gold/70" />
                {user.role === 'owner' ? 'Painel' : firstName}
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                aria-label="Terminar sessão"
                title="Terminar sessão"
                className="grid size-9 place-items-center rounded-full text-faint transition-colors hover:bg-white/[0.04] hover:text-fg"
              >
                <LogOut className="size-4" />
              </button>
              <Button href="/marcar" size="md">
                Marcar horário
                <ArrowUpRight />
              </Button>
            </>
          ) : (
            <>
              <Link
                href="/entrar"
                className="inline-flex h-9 items-center rounded-full px-3.5 text-[12px] uppercase tracking-[0.16em] text-muted transition-colors hover:text-fg"
              >
                Entrar
              </Link>
              <Button href="/marcar" size="md">
                Marcar horário
                <ArrowUpRight />
              </Button>
            </>
          )}
        </div>

        <button
          type="button"
          aria-label={open ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
          className="relative grid size-11 place-items-center rounded-full border border-line-strong text-fg transition-colors hover:border-gold/50 md:hidden"
        >
          <span className="flex w-4 flex-col gap-[5px]">
            <span
              className={cx('h-px w-full bg-current transition-transform duration-300', open && 'translate-y-[6px] rotate-45')}
            />
            <span className={cx('h-px w-full bg-current transition-opacity duration-300', open && 'opacity-0')} />
            <span
              className={cx('h-px w-full bg-current transition-transform duration-300', open && '-translate-y-[6px] -rotate-45')}
            />
          </span>
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 top-[76px] z-40 overflow-y-auto bg-bg/97 backdrop-blur-2xl md:hidden"
          >
            <div className="flex min-h-full flex-col px-6 pb-10 pt-8">
              <ul className="flex flex-col">
                {nav.links.map((link, index) => (
                  <motion.li
                    key={link.label}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, delay: 0.05 + index * 0.06, ease }}
                    className="border-b border-line"
                  >
                    <a
                      href={isHome ? link.href.replace('/', '') : link.href}
                      onClick={() => setOpen(false)}
                      className="flex items-center justify-between py-5"
                    >
                      <span className="font-serif text-[32px] font-light text-fg">{link.label}</span>
                      <span className="text-[10px] text-gold/60">0{index + 1}</span>
                    </a>
                  </motion.li>
                ))}
              </ul>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.32, ease }}
                className="mt-8 flex flex-col gap-2.5"
              >
                <Button href="/marcar" size="lg" onClick={() => setOpen(false)} className="w-full">
                  Marcar horário
                  <ArrowUpRight />
                </Button>
                {user ? (
                  <>
                    <div className="flex gap-2.5">
                      <Button
                        href={user.role === 'owner' ? '/painel' : '/conta'}
                        variant="outline"
                        size="lg"
                        className="flex-1"
                        onClick={() => setOpen(false)}
                      >
                        {user.role === 'owner' ? 'Painel' : 'A minha conta'}
                      </Button>
                      <Button variant="ghost" size="lg" onClick={handleLogout} aria-label="Terminar sessão">
                        <LogOut />
                      </Button>
                    </div>
                    <p className="text-center text-[12px] text-faint">Sessão iniciada como {user.name}.</p>
                  </>
                ) : (
                  <Button href="/entrar" variant="outline" size="lg" onClick={() => setOpen(false)} className="w-full">
                    Entrar
                  </Button>
                )}
              </motion.div>

              <div className="mt-auto pt-10">
                <p className="text-[10px] uppercase tracking-[0.3em] text-gold/60">Porto · desde 2016</p>
                <p className="mt-2 font-serif text-[17px] italic text-muted">
                  Cortes, barbas e cuidado com detalhe.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

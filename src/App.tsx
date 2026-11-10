import { AnimatePresence, motion } from 'motion/react'
import { useEffect, type ReactNode } from 'react'

import { Button } from './components/Button'
import { Footer } from './components/Footer'
import { Nav } from './components/Nav'
import { AuthProvider } from './lib/auth'
import { useRoute } from './lib/router'
import { Account } from './sections/Account'
import { Admin } from './sections/Admin'
import { Booking } from './sections/Booking'
import { Home } from './sections/Home'
import { Login } from './sections/Login'

const ease = [0.22, 1, 0.36, 1] as const

function NotFound() {
  return (
    <main className="relative flex min-h-[78vh] items-center justify-center overflow-hidden px-6 pt-24">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 size-[380px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-wine/12 blur-[110px]" />
      </div>
      <div className="relative text-center">
        <p className="font-serif text-[90px] font-light leading-none text-gold/20">404</p>
        <h1 className="mt-2 font-serif text-[38px] font-light leading-tight">
          Esta página saiu <em className="italic text-gold">a corte.</em>
        </h1>
        <p className="mx-auto mt-3 max-w-sm text-[13px] leading-relaxed text-muted">
          O link não existe ou já não está disponível. Volte ao início e marque o seu momento.
        </p>
        <div className="mt-7 flex justify-center">
          <Button href="/">Voltar ao início</Button>
        </div>
      </div>
    </main>
  )
}

function Shell() {
  const route = useRoute()
  const hideChrome = route.path === '/entrar' || route.path === '/painel'

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [route.path])

  let page: ReactNode
  switch (route.path) {
    case '/':
      page = <Home />
      break
    case '/entrar':
      page = <Login />
      break
    case '/marcar':
      page = <Booking />
      break
    case '/conta':
      page = <Account />
      break
    case '/painel':
      page = <Admin />
      break
    default:
      page = <NotFound />
  }

  return (
    <div className="min-h-screen">
      {!hideChrome && <Nav />}
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={route.path}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease }}
        >
          {page}
        </motion.div>
      </AnimatePresence>
      {!hideChrome && <Footer />}
    </div>
  )
}

export function App() {
  return (
    <AuthProvider>
      <Shell />
    </AuthProvider>
  )
}

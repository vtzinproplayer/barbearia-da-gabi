import { AnimatePresence, motion } from 'motion/react'
import { ArrowLeft, ArrowUpRight, Eye, EyeOff, Loader2, LockKeyhole, User, UserRound } from 'lucide-react'
import { useState, type FormEvent } from 'react'

import { Field } from '../components/Field'
import { Logo } from '../components/Logo'
import { images, loginQuote } from '../content'
import { ApiError } from '../lib/api'
import { useAuth } from '../lib/auth'
import { cx } from '../lib/cx'
import { Link, navigate, useRoute } from '../lib/router'

type Mode = 'login' | 'register'

const ease = [0.22, 1, 0.36, 1] as const

function safeNext(value: string | null): string | null {
  if (!value) return null
  if (!value.startsWith('/') || value.startsWith('//')) return null
  return value
}

export function Login() {
  const route = useRoute()
  const { login, register } = useAuth()
  const initialMode: Mode = route.query.get('modo') === 'criar' ? 'register' : 'login'
  const [mode, setMode] = useState<Mode>(initialMode)
  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const next = safeNext(route.query.get('next'))

  const switchMode = (nextMode: Mode) => {
    setMode(nextMode)
    setError('')
  }

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')

    const trimmedUsername = username.trim()
    if (mode === 'register' && name.trim().length < 2) {
      setError('Indique o seu nome para continuarmos.')
      return
    }
    if (!trimmedUsername || !password) {
      setError('Preencha o nome de utilizador e a palavra-passe.')
      return
    }
    if (mode === 'register' && password.length < 6) {
      setError('A palavra-passe deve ter pelo menos 6 caracteres.')
      return
    }

    setLoading(true)
    try {
      const account =
        mode === 'login'
          ? await login(trimmedUsername, password)
          : await register({ name: name.trim(), username: trimmedUsername, password })

      const target =
        account.role === 'owner'
          ? next ?? '/painel'
          : next && !next.startsWith('/painel')
            ? next
            : '/'
      navigate(target)
    } catch (caught) {
      setError(
        caught instanceof ApiError ? caught.message : 'Não foi possível entrar. Tente novamente.',
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen bg-bg lg:grid lg:grid-cols-[1.03fr_0.97fr]">
      <aside className="relative hidden overflow-hidden lg:block">
        <img
          src={images.hero}
          alt="Barbeiro a aparar a barba de um cliente com navalha"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/40 to-bg/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-bg/60 via-transparent to-bg/30" />
        <div className="absolute inset-0 grain" />

        <div className="relative flex h-full flex-col justify-between p-10 xl:p-14">
          <Logo />

          <div className="max-w-md">
            <div className="mb-7 flex gap-1 text-gold">
              {[0, 1, 2, 3, 4].map((star) => (
                <span key={star} className="text-[11px]">
                  ★
                </span>
              ))}
            </div>
            <blockquote className="font-serif text-[clamp(2.2rem,3.4vw,3.2rem)] font-light italic leading-[1.1] text-fg">
              “{loginQuote.quote}”
            </blockquote>
            <p className="mt-6 flex items-center gap-3 text-[9px] uppercase tracking-[0.3em] text-gold/75">
              <span className="h-px w-8 bg-gold/60" />
              {loginQuote.caption}
            </p>
          </div>

          <div className="flex items-center justify-between text-[9px] uppercase tracking-[0.24em] text-faint">
            <span>Rua do Almada, 128</span>
            <span>Terça a sábado</span>
          </div>
        </div>
      </aside>

      <main className="relative flex min-h-screen flex-col">
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden lg:hidden">
          <div className="absolute -right-24 -top-32 size-80 rounded-full bg-wine/20 blur-[100px]" />
          <div className="absolute -left-20 bottom-0 size-64 rounded-full bg-gold/[0.05] blur-[90px]" />
        </div>

        <div className="relative flex items-center justify-between p-6 sm:p-8 lg:justify-end">
          <div className="lg:hidden">
            <Logo />
          </div>
          <Link
            href="/"
            className="group inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-faint transition-colors hover:text-fg"
          >
            <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-0.5" />
            Voltar ao site
          </Link>
        </div>

        <div className="relative flex flex-1 items-center justify-center px-6 pb-14 pt-2 sm:px-10">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease }}
            className="w-full max-w-[390px]"
          >
            <p className="flex items-center gap-3 text-[9px] uppercase tracking-[0.32em] text-gold/80">
              <span className="h-px w-7 bg-gold/50" />
              A sua conta
            </p>
            <h1 className="mt-5 font-serif text-[42px] font-light leading-[1.02] tracking-[-0.02em] sm:text-[46px]">
              {mode === 'login' ? (
                <>
                  De volta ao seu
                  <br />
                  <em className="italic text-gold">ritual.</em>
                </>
              ) : (
                <>
                  Comece o seu
                  <br />
                  <em className="italic text-gold">ritual.</em>
                </>
              )}
            </h1>
            <p className="mt-4 text-[13px] leading-relaxed text-muted">
              {mode === 'login'
                ? 'Só precisa do nome de utilizador e da palavra-passe.'
                : 'Sem email, sem ruído. Só o essencial para guardar as suas marcações.'}
            </p>

            <div className="mt-8 flex gap-7 border-b border-line">
              {(
                [
                  { id: 'login' as Mode, label: 'Entrar' },
                  { id: 'register' as Mode, label: 'Criar conta' },
                ]
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => switchMode(tab.id)}
                  className={cx(
                    'relative pb-3 text-[11px] uppercase tracking-[0.2em] transition-colors',
                    mode === tab.id ? 'text-fg' : 'text-faint hover:text-muted',
                  )}
                >
                  {tab.label}
                  {mode === tab.id && (
                    <motion.span
                      layoutId="auth-tab"
                      className="absolute inset-x-0 -bottom-px h-px bg-gold"
                      transition={{ duration: 0.3, ease }}
                    />
                  )}
                </button>
              ))}
            </div>

            <form onSubmit={submit} className="mt-7 flex flex-col gap-6">
              <AnimatePresence initial={false}>
                {mode === 'register' && (
                  <motion.div
                    key="name-field"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.28, ease }}
                    className="overflow-hidden"
                  >
                    <Field
                      label="O seu nome"
                      placeholder="Como devemos tratar por si?"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      autoComplete="name"
                      maxLength={40}
                      icon={<UserRound className="size-4" />}
                      required={mode === 'register'}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <Field
                label="Nome de utilizador"
                placeholder="o.seu.nome"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                autoComplete="username"
                autoCapitalize="none"
                spellCheck={false}
                maxLength={20}
                icon={<User className="size-4" />}
                required
              />

              <Field
                label="Palavra-passe"
                placeholder="••••••••"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                maxLength={72}
                icon={<LockKeyhole className="size-4" />}
                required
                trailing={
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    aria-label={showPassword ? 'Esconder palavra-passe' : 'Mostrar palavra-passe'}
                    className="grid size-9 place-items-center rounded-full text-faint transition-colors hover:text-fg"
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                }
              />

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-xl border border-wine-soft/25 bg-wine/10 px-3.5 py-2.5 text-[12px] leading-relaxed text-wine-soft"
                  role="alert"
                >
                  {error}
                </motion.div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="mt-1 inline-flex h-[52px] w-full items-center justify-center gap-2.5 rounded-full bg-gold text-[13px] font-medium tracking-[0.02em] text-ink shadow-[0_18px_50px_-22px_rgb(216_180_119/0.65)] transition-[background-color,transform] duration-300 hover:bg-gold-soft active:scale-[0.99] disabled:pointer-events-none disabled:opacity-60"
              >
                {loading && <Loader2 className="size-4 animate-spin" />}
                {mode === 'login' ? 'Entrar na conta' : 'Criar conta e continuar'}
                {!loading && <ArrowUpRight className="size-4" />}
              </button>
            </form>

            <p className="mt-6 text-center text-[10.5px] leading-relaxed text-faint">
              Os seus dados servem apenas para gerir as marcações.
              {mode === 'login' && (
                <>
                  {' '}
                  Ainda não tem conta?{' '}
                  <button
                    type="button"
                    onClick={() => switchMode('register')}
                    className="text-gold/90 underline decoration-gold/30 underline-offset-4 transition-colors hover:text-gold"
                  >
                    Crie agora
                  </button>
                  .
                </>
              )}
            </p>
          </motion.div>
        </div>
      </main>
    </div>
  )
}

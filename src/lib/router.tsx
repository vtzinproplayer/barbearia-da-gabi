import type { ComponentPropsWithoutRef, MouseEvent, ReactNode } from 'react'
import { useEffect, useState } from 'react'

export type Route = {
  path: string
  search: string
  query: URLSearchParams
}

function readRoute(): Route {
  const search = window.location.search
  return {
    path: window.location.pathname.replace(/\/+$/, '') || '/',
    search,
    query: new URLSearchParams(search),
  }
}

export function navigate(to: string, options: { replace?: boolean } = {}): void {
  const current = window.location.pathname + window.location.search + window.location.hash
  if (current === to) return
  if (options.replace) window.history.replaceState(null, '', to)
  else window.history.pushState(null, '', to)
  window.dispatchEvent(new PopStateEvent('popstate'))
  window.scrollTo({ top: 0, behavior: 'auto' })
}

export function useRoute(): Route {
  const [route, setRoute] = useState<Route>(readRoute)

  useEffect(() => {
    const sync = () => setRoute(readRoute())
    window.addEventListener('popstate', sync)
    return () => window.removeEventListener('popstate', sync)
  }, [])

  return route
}

type LinkProps = ComponentPropsWithoutRef<'a'> & { children: ReactNode }

export function Link({ href = '', children, onClick, ...rest }: LinkProps) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event)
    if (event.defaultPrevented) return
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return
    if (!href || href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')) return
    if (href.startsWith('#')) return
    event.preventDefault()
    navigate(href)
  }

  return (
    <a href={href} onClick={handleClick} {...rest}>
      {children}
    </a>
  )
}

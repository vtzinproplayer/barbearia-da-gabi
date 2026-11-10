import type { ComponentPropsWithoutRef, ReactNode } from 'react'

import { cx } from '../lib/cx'
import { Link } from '../lib/router'

type Variant = 'gold' | 'outline' | 'ghost' | 'wine'
type Size = 'md' | 'lg'

const base =
  'group/button relative inline-flex shrink-0 items-center justify-center gap-2.5 whitespace-nowrap rounded-full font-medium tracking-[0.015em] transition-[background-color,color,border-color,transform,box-shadow] duration-300 active:scale-[0.985] disabled:pointer-events-none disabled:opacity-45 [&_svg]:size-4 [&_svg]:shrink-0'

const variants: Record<Variant, string> = {
  gold: 'bg-gold text-ink shadow-[0_18px_50px_-22px_rgb(216_180_119/0.65)] hover:bg-gold-soft hover:shadow-[0_22px_60px_-20px_rgb(216_180_119/0.7)]',
  outline: 'border border-gold/35 text-gold-soft hover:border-gold/70 hover:bg-gold/[0.07]',
  ghost: 'text-muted hover:bg-white/[0.04] hover:text-fg',
  wine: 'border border-wine-soft/35 bg-wine/20 text-fg hover:border-wine-soft/60 hover:bg-wine/35',
}

const sizes: Record<Size, string> = {
  md: 'h-11 px-5 text-[13px]',
  lg: 'h-[52px] px-7 text-[14px]',
}

type Common = { variant?: Variant; size?: Size; className?: string; children: ReactNode }
type ButtonProps = Common &
  (
    | ({ href: string } & Omit<ComponentPropsWithoutRef<'a'>, 'href'>)
    | ({ href?: undefined } & ComponentPropsWithoutRef<'button'>)
  )

export function Button(props: ButtonProps) {
  const { variant = 'gold', size = 'md', className, children, ...rest } = props
  const classes = cx(base, variants[variant], sizes[size], className)

  if ('href' in rest && rest.href !== undefined) {
    return (
      <Link className={classes} {...(rest as ComponentPropsWithoutRef<'a'>)}>
        {children}
      </Link>
    )
  }

  return (
    <button type="button" className={classes} {...(rest as ComponentPropsWithoutRef<'button'>)}>
      {children}
    </button>
  )
}

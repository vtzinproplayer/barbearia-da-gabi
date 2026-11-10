import type { ReactNode } from 'react'

import { cx } from '../lib/cx'
import { Reveal } from './Reveal'

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
  className,
  titleClassName,
}: {
  eyebrow?: string
  title: ReactNode
  description?: string
  align?: 'left' | 'center'
  className?: string
  titleClassName?: string
}) {
  return (
    <Reveal className={cx('max-w-2xl', align === 'center' && 'mx-auto text-center', className)}>
      {eyebrow && (
        <p
          className={cx(
            'mb-4 flex items-center gap-3 text-[10px] uppercase tracking-[0.32em] text-gold/85',
            align === 'center' && 'justify-center',
          )}
        >
          <span className="h-px w-7 bg-gold/50" />
          {eyebrow}
        </p>
      )}
      <h2
        className={cx(
          'text-balance font-serif text-[clamp(2.2rem,4.2vw,3.6rem)] font-light leading-[1.02] tracking-[-0.015em] text-fg',
          titleClassName,
        )}
      >
        {title}
      </h2>
      {description && (
        <p
          className={cx(
            'mt-5 text-pretty text-[15px] leading-relaxed text-muted sm:text-[16px]',
            align === 'center' ? 'mx-auto max-w-xl' : 'max-w-xl',
          )}
        >
          {description}
        </p>
      )}
    </Reveal>
  )
}

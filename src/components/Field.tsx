import { useId, type ComponentPropsWithoutRef, type ReactNode } from 'react'

import { cx } from '../lib/cx'

type FieldProps = Omit<ComponentPropsWithoutRef<'input'>, 'id'> & {
  label: string
  hint?: string
  error?: string
  icon?: ReactNode
  trailing?: ReactNode
}

export function Field({ label, hint, error, icon, trailing, className, ...inputProps }: FieldProps) {
  const id = useId()
  return (
    <div className={className}>
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-[10px] uppercase tracking-[0.3em] text-faint">
          {label}
        </label>
        {hint && <span className="text-[11px] text-faint">{hint}</span>}
      </div>
      <div className="relative mt-2 flex items-center">
        {icon && (
          <span aria-hidden className="pointer-events-none absolute left-0 text-gold/55">
            {icon}
          </span>
        )}
        <input
          id={id}
          className={cx(
            'h-12 w-full rounded-none border-0 border-b border-line-strong bg-transparent px-0 text-[15px] text-fg outline-none transition-colors duration-300 placeholder:text-faint/55 focus:border-gold',
            Boolean(icon) && 'pl-7',
            Boolean(trailing) && 'pr-11',
          )}
          {...inputProps}
        />
        {trailing && <span className="absolute right-0 flex items-center">{trailing}</span>}
      </div>
      {error && <p className="mt-2 text-[12px] text-wine-soft">{error}</p>}
    </div>
  )
}

type TextAreaProps = Omit<ComponentPropsWithoutRef<'textarea'>, 'id'> & {
  label: string
  hint?: string
  error?: string
}

export function TextAreaField({ label, hint, error, className, ...textareaProps }: TextAreaProps) {
  const id = useId()
  return (
    <div className={className}>
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-[10px] uppercase tracking-[0.3em] text-faint">
          {label}
        </label>
        {hint && <span className="text-[11px] text-faint">{hint}</span>}
      </div>
      <textarea
        id={id}
        className="mt-2 w-full resize-none rounded-2xl border border-line-strong bg-white/[0.02] px-4 py-3 text-[15px] leading-relaxed text-fg outline-none transition-colors duration-300 placeholder:text-faint/55 focus:border-gold/60"
        {...textareaProps}
      />
      {error && <p className="mt-2 text-[12px] text-wine-soft">{error}</p>}
    </div>
  )
}

import { Link } from '../lib/router'
import { cx } from '../lib/cx'

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label="Barbearia da Gabi — início"
      className={cx('group inline-flex items-center gap-3', className)}
    >
      <span className="relative grid size-11 shrink-0 place-items-center">
        <span className="absolute inset-0 rounded-full border border-gold/40 transition-colors duration-300 group-hover:border-gold/75" />
        <span className="absolute inset-[3px] rounded-full border border-gold/10" />
        <span className="font-serif text-[21px] italic leading-none text-gold-soft">G</span>
      </span>
      <span className="flex flex-col">
        <span className="text-[8.5px] uppercase tracking-[0.44em] text-gold/75">Barbearia</span>
        <span className="font-serif text-[22px] leading-none tracking-[0.01em] text-fg">da Gabi</span>
      </span>
    </Link>
  )
}

export function LogoMark({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cx(
        'relative grid size-10 shrink-0 place-items-center rounded-full border border-gold/40 bg-surface/60',
        className,
      )}
    >
      <span className="font-serif text-[19px] italic leading-none text-gold-soft">G</span>
    </span>
  )
}

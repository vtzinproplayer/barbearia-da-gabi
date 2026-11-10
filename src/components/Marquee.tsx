import { cx } from '../lib/cx'

export function Marquee({ items, className }: { items: string[]; className?: string }) {
  const copy = (hidden: boolean) => (
    <div aria-hidden={hidden} className="flex shrink-0 items-center">
      {items.map((item) => (
        <span key={item} className="flex shrink-0 items-center">
          <span className="px-7 font-serif text-[22px] italic text-fg/85 sm:text-[26px]">{item}</span>
          <span className="text-[9px] text-gold/70">✦</span>
        </span>
      ))}
    </div>
  )

  return (
    <div className={cx('relative flex select-none overflow-hidden', className)}>
      <div className="marquee-track flex w-max items-center">
        {copy(false)}
        {copy(true)}
      </div>
    </div>
  )
}

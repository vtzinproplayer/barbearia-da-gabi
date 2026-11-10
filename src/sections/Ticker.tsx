import { Marquee } from '../components/Marquee'
import { marquee } from '../content'

export function Ticker() {
  return (
    <div className="relative border-y border-line bg-surface/40 py-5">
      <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-bg to-transparent" />
      <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-bg to-transparent" />
      <Marquee items={marquee} />
    </div>
  )
}

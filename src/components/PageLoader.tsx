import { LogoMark } from './Logo'

export function PageLoader({ label = 'A preparar o seu momento…' }: { label?: string }) {
  return (
    <div className="grid min-h-[70vh] place-items-center px-6">
      <div className="flex flex-col items-center gap-5 text-center">
        <div className="relative grid size-14 place-items-center">
          <span className="absolute inset-0 animate-spin rounded-full border border-gold/20 border-t-gold/80" />
          <LogoMark className="size-10 border-gold/20" />
        </div>
        <p className="text-[10px] uppercase tracking-[0.3em] text-faint">{label}</p>
      </div>
    </div>
  )
}

import type { AppointmentStatus } from '../lib/api'
import { cx } from '../lib/cx'

const CONFIG: Record<AppointmentStatus, { label: string; className: string; dot: string }> = {
  pendente: {
    label: 'Aguarda confirmação',
    className: 'border-gold/25 bg-gold/[0.08] text-gold-soft',
    dot: 'bg-gold',
  },
  confirmado: {
    label: 'Confirmado',
    className: 'border-sage/25 bg-sage/[0.08] text-sage',
    dot: 'bg-sage',
  },
  concluido: {
    label: 'Concluído',
    className: 'border-line-strong bg-white/[0.04] text-muted',
    dot: 'bg-muted',
  },
  cancelado: {
    label: 'Cancelado',
    className: 'border-wine-soft/25 bg-wine/10 text-wine-soft',
    dot: 'bg-wine-soft',
  },
}

export function StatusPill({ status, className }: { status: AppointmentStatus; className?: string }) {
  const config = CONFIG[status]
  return (
    <span
      className={cx(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] uppercase tracking-[0.14em]',
        config.className,
        className,
      )}
    >
      <span className={cx('size-1.5 rounded-full', config.dot)} />
      {config.label}
    </span>
  )
}

export const STATUS_LABEL = CONFIG

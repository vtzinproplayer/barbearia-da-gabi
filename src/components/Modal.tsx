import { AnimatePresence, motion } from 'motion/react'
import { X } from 'lucide-react'
import { useEffect, useId, type ReactNode } from 'react'

import { cx } from '../lib/cx'

export function Modal({
  open,
  onClose,
  title,
  children,
  wide = false,
  hideTitle = false,
}: {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
  wide?: boolean
  hideTitle?: boolean
}) {
  const titleId = useId()

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = previous
      window.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div
            aria-hidden
            className="absolute inset-0 bg-bg/80 backdrop-blur-md"
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={hideTitle ? undefined : titleId}
            initial={{ opacity: 0, y: 18, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className={cx(
              'depth relative z-10 max-h-[90vh] w-full overflow-y-auto rounded-card border border-line-strong bg-surface p-6 shadow-glow sm:p-7',
              wide ? 'max-w-2xl' : 'max-w-md',
            )}
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Fechar"
              className="absolute right-4 top-4 grid size-9 place-items-center rounded-full text-faint transition-colors hover:bg-white/[0.05] hover:text-fg"
            >
              <X className="size-4" />
            </button>
            {!hideTitle && (
              <h2 id={titleId} className="pr-10 font-serif text-[28px] leading-tight text-fg">
                {title}
              </h2>
            )}
            <div className={hideTitle ? '' : 'mt-5'}>{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

import { AnimatePresence, motion } from 'motion/react'
import { AlertCircle, Check } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'

export type ToastState = { message: string; tone: 'success' | 'error' } | null

export function useToast() {
  const [toast, setToast] = useState<ToastState>(null)
  const timer = useRef<number | null>(null)

  const show = useCallback((message: string, tone: 'success' | 'error' = 'success') => {
    setToast({ message, tone })
    if (timer.current) window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setToast(null), 4200)
  }, [])

  useEffect(() => {
    return () => {
      if (timer.current) window.clearTimeout(timer.current)
    }
  }, [])

  return { toast, show }
}

export function Toast({ toast }: { toast: ToastState }) {
  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          role="status"
          initial={{ opacity: 0, y: 18, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.98 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-6 left-1/2 z-[130] flex -translate-x-1/2 items-center gap-2.5 rounded-full border border-line-strong bg-surface-2/95 px-4 py-2.5 text-[13px] text-fg shadow-glow backdrop-blur-xl"
        >
          <span
            className={
              toast.tone === 'error'
                ? 'grid size-5 place-items-center rounded-full bg-wine/30 text-wine-soft'
                : 'grid size-5 place-items-center rounded-full bg-gold/20 text-gold'
            }
          >
            {toast.tone === 'error' ? <AlertCircle className="size-3.5" /> : <Check className="size-3.5" />}
          </span>
          {toast.message}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

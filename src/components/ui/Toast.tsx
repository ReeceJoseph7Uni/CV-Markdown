'use client'

import React, { createContext, useContext, useState, useCallback } from 'react'
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react'

type ToastType = 'success' | 'error' | 'warning' | 'info'

interface ToastItem {
  id: string
  type: ToastType
  message: string
}

interface ToastContextValue {
  toast: {
    success: (message: string) => void
    error: (message: string) => void
    warning: (message: string) => void
    info: (message: string) => void
  }
}

const ToastContext = createContext<ToastContextValue | null>(null)

const DISMISS_DELAY = 4000

const toastConfig: Record<
  ToastType,
  { icon: React.ReactNode; classes: string }
> = {
  success: {
    icon: <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" aria-hidden="true" />,
    classes: 'border-emerald-200 bg-emerald-50',
  },
  error: {
    icon: <XCircle className="w-5 h-5 text-red-500 shrink-0" aria-hidden="true" />,
    classes: 'border-red-200 bg-red-50',
  },
  warning: {
    icon: <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" aria-hidden="true" />,
    classes: 'border-amber-200 bg-amber-50',
  },
  info: {
    icon: <Info className="w-5 h-5 text-blue-500 shrink-0" aria-hidden="true" />,
    classes: 'border-blue-200 bg-blue-50',
  },
}

function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const addToast = useCallback(
    (type: ToastType, message: string) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`
      setToasts((prev) => [...prev, { id, type, message }])
      setTimeout(() => dismiss(id), DISMISS_DELAY)
    },
    [dismiss]
  )

  const toast = {
    success: (message: string) => addToast('success', message),
    error: (message: string) => addToast('error', message),
    warning: (message: string) => addToast('warning', message),
    info: (message: string) => addToast('info', message),
  }

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div
        aria-live="polite"
        aria-atomic="false"
        className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none"
      >
        {toasts.map((t) => {
          const config = toastConfig[t.type]
          return (
            <div
              key={t.id}
              role="status"
              onClick={() => dismiss(t.id)}
              className={[
                'flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg',
                'min-w-64 max-w-sm pointer-events-auto cursor-pointer',
                'animate-in slide-in-from-right-5 fade-in duration-300',
                config.classes,
              ].join(' ')}
            >
              {config.icon}
              <p className="text-sm font-medium text-slate-800 flex-1">{t.message}</p>
              <button
                onClick={(e) => { e.stopPropagation(); dismiss(t.id) }}
                aria-label="Dismiss notification"
                className="p-0.5 rounded text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}

function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within a ToastProvider')
  return ctx
}

export { ToastProvider, useToast }
export type { ToastType, ToastItem }

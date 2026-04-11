'use client'

import React, { useState, useEffect } from 'react'
import { AlertTriangle, X } from 'lucide-react'

const STORAGE_KEY = 'everyrandsa-disclaimer-dismissed'

interface DisclaimerBannerProps {
  className?: string
  message?: string
}

function DisclaimerBanner({
  className = '',
  message,
}: DisclaimerBannerProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const id = setTimeout(() => {
      try {
        const dismissed = localStorage.getItem(STORAGE_KEY)
        if (!dismissed) setVisible(true)
      } catch {
        setVisible(true)
      }
    }, 0)
    return () => clearTimeout(id)
  }, [])

  const dismiss = () => {
    setVisible(false)
    try {
      localStorage.setItem(STORAGE_KEY, '1')
    } catch {
      // localStorage unavailable
    }
  }

  if (!visible) return null

  const text =
    message ??
    'Rates and financial information on this site may change without notice and are provided for informational purposes only. This is not financial advice — please consult a qualified financial advisor before making any financial decisions.'

  return (
    <div
      role="alert"
      aria-live="polite"
      className={`relative flex items-start gap-3 bg-amber-50 border-y border-amber-200 px-4 py-3 ${className}`}
    >
      <AlertTriangle
        className="w-5 h-5 text-amber-600 shrink-0 mt-0.5"
        aria-hidden="true"
      />

      <p className="text-sm text-amber-800 flex-1 leading-relaxed">{text}</p>

      <button
        onClick={dismiss}
        aria-label="Dismiss disclaimer"
        className="shrink-0 p-1 rounded text-amber-600 hover:text-amber-800 hover:bg-amber-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-600"
      >
        <X className="w-4 h-4" aria-hidden="true" />
      </button>
    </div>
  )
}

export { DisclaimerBanner }
export type { DisclaimerBannerProps }

import React from 'react'
import { Loader2 } from 'lucide-react'

type SpinnerSize = 'sm' | 'md' | 'lg' | 'xl'

interface LoadingSpinnerProps {
  size?: SpinnerSize
  color?: string
  label?: string
  centered?: boolean
  className?: string
}

const sizeClasses: Record<SpinnerSize, string> = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
  xl: 'w-12 h-12',
}

const labelSizeClasses: Record<SpinnerSize, string> = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
  xl: 'text-lg',
}

function LoadingSpinner({
  size = 'md',
  color = 'text-blue-600',
  label,
  centered = false,
  className = '',
}: LoadingSpinnerProps) {
  const content = (
    <div
      role="status"
      aria-label={label ?? 'Loading'}
      className={`inline-flex flex-col items-center gap-2 ${className}`}
    >
      <Loader2
        aria-hidden="true"
        className={`animate-spin shrink-0 ${sizeClasses[size]} ${color}`}
      />
      {label && (
        <span className={`${labelSizeClasses[size]} text-slate-600 font-medium`}>
          {label}
        </span>
      )}
      {!label && <span className="sr-only">Loading…</span>}
    </div>
  )

  if (centered) {
    return (
      <div className="flex items-center justify-center w-full py-8">
        {content}
      </div>
    )
  }

  return content
}

export { LoadingSpinner }
export type { LoadingSpinnerProps, SpinnerSize }

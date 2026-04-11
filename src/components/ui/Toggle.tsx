'use client'

import React, { useId } from 'react'

type ToggleSize = 'sm' | 'md' | 'lg'

interface ToggleProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string
  description?: string
  size?: ToggleSize
  disabled?: boolean
  className?: string
  id?: string
}

const sizeConfig: Record<
  ToggleSize,
  { track: string; thumb: string; translate: string }
> = {
  sm: { track: 'w-8 h-4', thumb: 'w-3 h-3 top-0.5 left-0.5', translate: 'translate-x-4' },
  md: { track: 'w-11 h-6', thumb: 'w-5 h-5 top-0.5 left-0.5', translate: 'translate-x-5' },
  lg: { track: 'w-14 h-7', thumb: 'w-6 h-6 top-0.5 left-0.5', translate: 'translate-x-7' },
}

function Toggle({
  checked,
  onChange,
  label,
  description,
  size = 'md',
  disabled = false,
  className = '',
  id: providedId,
}: ToggleProps) {
  const generatedId = useId()
  const id = providedId ?? generatedId
  const config = sizeConfig[size]

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault()
      if (!disabled) onChange(!checked)
    }
  }

  return (
    <div className={`flex items-start gap-3 ${className}`}>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-disabled={disabled}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        onKeyDown={handleKeyDown}
        className={[
          `relative inline-flex shrink-0 rounded-full border-2 border-transparent`,
          'transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2',
          config.track,
          checked ? 'bg-blue-600' : 'bg-slate-200',
          disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <span
          aria-hidden="true"
          className={[
            'absolute rounded-full bg-white shadow-sm',
            'transition-transform duration-200 ease-in-out',
            config.thumb,
            checked ? config.translate : 'translate-x-0',
          ]
            .filter(Boolean)
            .join(' ')}
        />
      </button>

      {(label || description) && (
        <label htmlFor={id} className={`cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
          {label && (
            <span className="block text-sm font-medium text-slate-900">{label}</span>
          )}
          {description && (
            <span className="block text-sm text-slate-500">{description}</span>
          )}
        </label>
      )}
    </div>
  )
}

export { Toggle }
export type { ToggleProps, ToggleSize }

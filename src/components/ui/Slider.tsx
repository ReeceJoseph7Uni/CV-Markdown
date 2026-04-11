'use client'

import React, { useId } from 'react'

interface SliderProps {
  min: number
  max: number
  step?: number
  value: number
  onChange: (value: number) => void
  label?: string
  prefix?: string
  suffix?: string
  disabled?: boolean
  className?: string
  formatValue?: (value: number) => string
}

function Slider({
  min,
  max,
  step = 1,
  value,
  onChange,
  label,
  prefix = '',
  suffix = '',
  disabled = false,
  className = '',
  formatValue,
}: SliderProps) {
  const id = useId()
  const percentage = ((value - min) / (max - min)) * 100

  const displayValue = formatValue
    ? formatValue(value)
    : `${prefix}${value.toLocaleString('en-ZA')}${suffix}`

  return (
    <div className={`w-full ${className}`}>
      {(label || displayValue) && (
        <div className="flex items-center justify-between mb-3">
          {label && (
            <label htmlFor={id} className="text-sm font-medium text-slate-700">
              {label}
            </label>
          )}
          <span className="text-sm font-semibold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-lg">
            {displayValue}
          </span>
        </div>
      )}

      <div className="relative">
        {/* Track background */}
        <div className="relative h-2 rounded-full bg-slate-200">
          {/* Filled track */}
          <div
            className="absolute h-2 rounded-full bg-blue-600 transition-all duration-100"
            style={{ width: `${percentage}%` }}
            aria-hidden="true"
          />
        </div>

        <input
          id={id}
          type="range"
          role="slider"
          min={min}
          max={max}
          step={step}
          value={value}
          disabled={disabled}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
          aria-valuetext={displayValue}
          aria-label={label}
          onChange={(e) => onChange(Number(e.target.value))}
          className={[
            'absolute inset-0 w-full h-2 opacity-0 cursor-pointer',
            disabled ? 'cursor-not-allowed' : '',
          ]
            .filter(Boolean)
            .join(' ')}
          style={{ WebkitAppearance: 'none' }}
        />

        {/* Thumb */}
        <div
          aria-hidden="true"
          className={[
            'absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-white border-2 border-blue-600 shadow-md',
            'transition-all duration-100 pointer-events-none',
            disabled ? 'opacity-50' : '',
          ]
            .filter(Boolean)
            .join(' ')}
          style={{ left: `calc(${percentage}% - 10px)` }}
        />
      </div>

      <div className="flex justify-between mt-2">
        <span className="text-xs text-slate-400">
          {prefix}{min.toLocaleString('en-ZA')}{suffix}
        </span>
        <span className="text-xs text-slate-400">
          {prefix}{max.toLocaleString('en-ZA')}{suffix}
        </span>
      </div>
    </div>
  )
}

export { Slider }
export type { SliderProps }

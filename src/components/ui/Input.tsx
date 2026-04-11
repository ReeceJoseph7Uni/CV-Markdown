'use client'

import React, { forwardRef, useId, useState } from 'react'

type InputSize = 'sm' | 'md' | 'lg'
type InputType = 'text' | 'number' | 'email' | 'tel'

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'type' | 'onChange'> {
  label?: string
  size?: InputSize
  type?: InputType
  prefix?: string
  suffix?: string
  error?: string
  helpText?: string
  className?: string
  onChange?: React.ChangeEventHandler<HTMLInputElement>
  onValueChange?: (value: string) => void
}

const sizeConfig: Record<InputSize, { input: string; label: string; labelFloat: string }> = {
  sm: {
    input: 'px-3 pt-5 pb-1.5 text-sm',
    label: 'text-xs top-3',
    labelFloat: 'text-xs top-1.5',
  },
  md: {
    input: 'px-3 pt-6 pb-2 text-sm',
    label: 'text-sm top-4',
    labelFloat: 'text-xs top-2',
  },
  lg: {
    input: 'px-4 pt-7 pb-2.5 text-base',
    label: 'text-base top-5',
    labelFloat: 'text-xs top-2.5',
  },
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      size = 'md',
      type = 'text',
      prefix,
      suffix,
      error,
      helpText,
      className = '',
      value,
      defaultValue,
      onChange,
      onValueChange,
      disabled,
      id: providedId,
      ...props
    },
    ref
  ) => {
    const generatedId = useId()
    const id = providedId ?? generatedId
    const errorId = `${id}-error`
    const helpId = `${id}-help`

    const [internalValue, setInternalValue] = useState(defaultValue ?? '')
    const isControlled = value !== undefined
    const currentValue = isControlled ? value : internalValue

    const isFilled = String(currentValue ?? '').length > 0
    const config = sizeConfig[size]

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!isControlled) setInternalValue(e.target.value)
      onChange?.(e)
      if (onValueChange) {
        const cleaned = e.target.value.replace(/[^0-9.]/g, '')
        onValueChange(cleaned)
      }
    }

    const ariaDescribedBy =
      [error ? errorId : '', helpText ? helpId : ''].filter(Boolean).join(' ') || undefined

    return (
      <div className={`w-full ${className}`}>
        <div className="relative">
          {prefix && (
            <span
              className={`absolute left-3 bottom-0 text-slate-500 pointer-events-none select-none
                ${size === 'sm' ? 'pb-1.5 text-sm' : size === 'lg' ? 'pb-2.5 text-base' : 'pb-2 text-sm'}`}
            >
              {prefix}
            </span>
          )}

          <input
            ref={ref}
            id={id}
            type={type}
            disabled={disabled}
            value={isControlled ? value : internalValue}
            onChange={handleChange}
            aria-invalid={!!error}
            aria-describedby={ariaDescribedBy}
            className={[
              'peer w-full rounded-lg border bg-white transition-colors duration-150',
              'focus:outline-none focus:ring-2',
              error
                ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
                : 'border-slate-300 focus:border-blue-600 focus:ring-blue-100',
              disabled ? 'bg-slate-50 cursor-not-allowed text-slate-400' : 'text-slate-900',
              config.input,
              prefix ? (size === 'lg' ? 'pl-8' : 'pl-7') : '',
              suffix ? (size === 'lg' ? 'pr-8' : 'pr-7') : '',
              label ? '' : '',
            ]
              .filter(Boolean)
              .join(' ')}
            {...props}
          />

          {label && (
            <label
              htmlFor={id}
              className={[
                'absolute left-3 transition-all duration-150 pointer-events-none text-slate-500',
                isFilled
                  ? config.labelFloat
                  : `${config.label} peer-focus:${config.labelFloat.split(' ')[0]} peer-focus:${config.labelFloat.split(' ')[1]}`,
                'peer-focus:text-xs',
                error ? 'text-red-500' : 'peer-focus:text-blue-600',
                prefix ? (size === 'lg' ? 'left-8' : 'left-7') : '',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              {label}
            </label>
          )}

          {suffix && (
            <span
              className={`absolute right-3 bottom-0 text-slate-500 pointer-events-none select-none
                ${size === 'sm' ? 'pb-1.5 text-sm' : size === 'lg' ? 'pb-2.5 text-base' : 'pb-2 text-sm'}`}
            >
              {suffix}
            </span>
          )}
        </div>

        {error && (
          <p id={errorId} role="alert" className="mt-1 text-xs text-red-600">
            {error}
          </p>
        )}

        {!error && helpText && (
          <p id={helpId} className="mt-1 text-xs text-slate-500">
            {helpText}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export { Input }
export type { InputProps, InputSize, InputType }

'use client'

import React, { forwardRef } from 'react'
import { Loader2 } from 'lucide-react'

type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'danger' | 'ghost'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  isLoading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  href?: string
  className?: string
  children?: React.ReactNode
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-blue-700 text-white hover:bg-blue-800 focus-visible:ring-blue-700 border border-blue-700',
  secondary:
    'bg-emerald-600 text-white hover:bg-emerald-700 focus-visible:ring-emerald-600 border border-emerald-600',
  tertiary:
    'bg-white text-blue-700 hover:bg-blue-50 focus-visible:ring-blue-700 border border-blue-700',
  danger:
    'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-600 border border-red-600',
  ghost:
    'bg-transparent text-slate-700 hover:bg-slate-100 focus-visible:ring-slate-400 border border-transparent',
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm gap-1.5',
  md: 'px-4 py-2 text-sm gap-2',
  lg: 'px-6 py-3 text-base gap-2.5',
}

const iconSizeClasses: Record<ButtonSize, string> = {
  sm: 'w-3.5 h-3.5',
  md: 'w-4 h-4',
  lg: 'w-5 h-5',
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      href,
      className = '',
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || isLoading

    const baseClasses = [
      'inline-flex items-center justify-center font-medium rounded-lg',
      'transition-colors duration-150',
      'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      variantClasses[variant],
      sizeClasses[size],
      className,
    ]
      .filter(Boolean)
      .join(' ')

    const content = (
      <>
        {isLoading ? (
          <Loader2
            className={`${iconSizeClasses[size]} animate-spin shrink-0`}
            aria-hidden="true"
          />
        ) : (
          leftIcon && (
            <span className={`${iconSizeClasses[size]} shrink-0`} aria-hidden="true">
              {leftIcon}
            </span>
          )
        )}
        {children && <span>{children}</span>}
        {!isLoading && rightIcon && (
          <span className={`${iconSizeClasses[size]} shrink-0`} aria-hidden="true">
            {rightIcon}
          </span>
        )}
      </>
    )

    if (href && !isDisabled) {
      return (
        <a href={href} className={baseClasses} aria-disabled={isDisabled}>
          {content}
        </a>
      )
    }

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        aria-busy={isLoading}
        aria-disabled={isDisabled}
        className={baseClasses}
        {...props}
      >
        {content}
      </button>
    )
  }
)

Button.displayName = 'Button'

export { Button }
export type { ButtonProps, ButtonVariant, ButtonSize }

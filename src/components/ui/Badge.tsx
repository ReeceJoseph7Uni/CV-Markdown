import React from 'react'

type BadgeVariant =
  | 'default'
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'tfsa'
  | 'promotional'
  | 'new'

type BadgeSize = 'sm' | 'md'

interface BadgeProps {
  variant?: BadgeVariant
  size?: BadgeSize
  icon?: React.ReactNode
  dot?: boolean
  className?: string
  children?: React.ReactNode
}

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-slate-100 text-slate-700 border-slate-200',
  success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  warning: 'bg-amber-50 text-amber-700 border-amber-200',
  error: 'bg-red-50 text-red-700 border-red-200',
  info: 'bg-blue-50 text-blue-700 border-blue-200',
  tfsa: 'bg-purple-50 text-purple-700 border-purple-200',
  promotional: 'bg-orange-50 text-orange-700 border-orange-200',
  new: 'bg-teal-50 text-teal-700 border-teal-200',
}

const dotColors: Record<BadgeVariant, string> = {
  default: 'bg-slate-500',
  success: 'bg-emerald-500',
  warning: 'bg-amber-500',
  error: 'bg-red-500',
  info: 'bg-blue-500',
  tfsa: 'bg-purple-500',
  promotional: 'bg-orange-500',
  new: 'bg-teal-500',
}

const sizeClasses: Record<BadgeSize, string> = {
  sm: 'px-2 py-0.5 text-xs gap-1',
  md: 'px-2.5 py-1 text-sm gap-1.5',
}

function Badge({
  variant = 'default',
  size = 'md',
  icon,
  dot = false,
  className = '',
  children,
}: BadgeProps) {
  return (
    <span
      className={[
        'inline-flex items-center font-medium rounded-full border',
        variantClasses[variant],
        sizeClasses[size],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {dot && (
        <span
          className={`rounded-full shrink-0 ${dotColors[variant]} ${size === 'sm' ? 'w-1.5 h-1.5' : 'w-2 h-2'}`}
          aria-hidden="true"
        />
      )}
      {icon && !dot && (
        <span className={`shrink-0 ${size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'}`} aria-hidden="true">
          {icon}
        </span>
      )}
      {children}
    </span>
  )
}

export { Badge }
export type { BadgeProps, BadgeVariant, BadgeSize }

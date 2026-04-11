import React from 'react'

type CardVariant = 'default' | 'elevated' | 'outlined' | 'highlight'
type CardPadding = 'none' | 'sm' | 'md' | 'lg'

interface CardProps {
  variant?: CardVariant
  padding?: CardPadding
  hover?: boolean
  className?: string
  children?: React.ReactNode
}

const variantClasses: Record<CardVariant, string> = {
  default: 'bg-white border border-slate-200',
  elevated: 'bg-white shadow-md border border-slate-100',
  outlined: 'bg-white border-2 border-slate-300',
  highlight: 'bg-white border-2 border-blue-600 shadow-sm',
}

const paddingClasses: Record<CardPadding, string> = {
  none: '',
  sm: 'p-3',
  md: 'p-5',
  lg: 'p-7',
}

function Card({
  variant = 'default',
  padding = 'md',
  hover = false,
  className = '',
  children,
}: CardProps) {
  return (
    <div
      className={[
        'rounded-xl transition-shadow duration-200',
        variantClasses[variant],
        paddingClasses[padding],
        hover ? 'hover:shadow-lg cursor-pointer' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </div>
  )
}

interface CardSectionProps {
  className?: string
  children?: React.ReactNode
}

function CardHeader({ className = '', children }: CardSectionProps) {
  return (
    <div className={`pb-4 border-b border-slate-100 ${className}`}>
      {children}
    </div>
  )
}

function CardBody({ className = '', children }: CardSectionProps) {
  return <div className={`py-4 ${className}`}>{children}</div>
}

function CardFooter({ className = '', children }: CardSectionProps) {
  return (
    <div className={`pt-4 border-t border-slate-100 ${className}`}>
      {children}
    </div>
  )
}

export { Card, CardHeader, CardBody, CardFooter }
export type { CardProps, CardVariant, CardPadding }

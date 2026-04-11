import React from 'react'
import { Tooltip } from '../ui/Tooltip'
import { Info } from 'lucide-react'

interface RateBadgeProps {
  rate: number
  isNominal?: boolean
  isPromotional?: boolean
  isGood?: boolean
  suffix?: string
  className?: string
}

function RateBadge({
  rate,
  isNominal = true,
  isPromotional = false,
  isGood = false,
  suffix = 'p.a.',
  className = '',
}: RateBadgeProps) {
  const formattedRate = `${rate.toFixed(2)}% ${suffix}`
  const rateType = isNominal ? 'Nominal' : 'Effective'

  const tooltipContent = (
    <span>
      <strong>{rateType} rate</strong>
      <br />
      {isNominal
        ? 'Nominal rate before compounding is applied.'
        : 'Effective rate accounts for compounding.'}
    </span>
  )

  return (
    <span
      className={[
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-sm font-semibold border',
        isPromotional
          ? 'bg-orange-50 text-orange-700 border-orange-200'
          : isGood
          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
          : 'bg-slate-50 text-slate-700 border-slate-200',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {isPromotional && (
        <span className="inline-flex items-center px-1.5 py-0.5 text-xs font-bold bg-orange-500 text-white rounded-full leading-none">
          PROMO
        </span>
      )}
      <span>{formattedRate}</span>
      <Tooltip content={tooltipContent} position="top">
        <button
          type="button"
          aria-label={`${rateType} rate information`}
          className="inline-flex opacity-60 hover:opacity-100 transition-opacity focus:outline-none"
        >
          <Info className="w-3.5 h-3.5" aria-hidden="true" />
        </button>
      </Tooltip>
    </span>
  )
}

export { RateBadge }
export type { RateBadgeProps }

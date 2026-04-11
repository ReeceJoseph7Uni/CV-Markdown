import React from 'react'
import Link from 'next/link'
import { Shield, Info } from 'lucide-react'

interface TrustBadgeProps {
  compact?: boolean
  methodologyHref?: string
  className?: string
}

function TrustBadge({
  compact = false,
  methodologyHref = '/methodology',
  className = '',
}: TrustBadgeProps) {
  if (compact) {
    return (
      <span
        className={`inline-flex items-center gap-1.5 text-xs text-slate-500 ${className}`}
      >
        <Shield className="w-3.5 h-3.5 text-emerald-600 shrink-0" aria-hidden="true" />
        <span>Official sources</span>
        {methodologyHref && (
          <Link
            href={methodologyHref}
            className="text-blue-600 hover:text-blue-700 transition-colors"
            aria-label="View our data methodology"
          >
            <Info className="w-3 h-3" aria-hidden="true" />
          </Link>
        )}
      </span>
    )
  }

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-2 bg-emerald-50 border border-emerald-200 rounded-lg ${className}`}
    >
      <Shield className="w-4 h-4 text-emerald-600 shrink-0" aria-hidden="true" />
      <span className="text-sm text-emerald-800 font-medium">
        Data sourced from official sources
      </span>
      {methodologyHref && (
        <Link
          href={methodologyHref}
          className="text-emerald-600 hover:text-emerald-800 transition-colors"
          aria-label="View our data methodology"
        >
          <Info className="w-3.5 h-3.5" aria-hidden="true" />
        </Link>
      )}
    </div>
  )
}

export { TrustBadge }
export type { TrustBadgeProps }

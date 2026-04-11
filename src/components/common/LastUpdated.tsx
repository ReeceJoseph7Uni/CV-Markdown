import React from 'react'
import { Clock, ExternalLink } from 'lucide-react'

interface LastUpdatedProps {
  date: Date | string
  sourceLabel?: string
  sourceHref?: string
  className?: string
}

function getRelativeTime(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return 'today'
  if (diffDays === 1) return 'yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
  return null as unknown as string
}

function getFreshnessClasses(diffDays: number): string {
  if (diffDays < 7) return 'bg-emerald-50 text-emerald-700 border-emerald-200'
  if (diffDays <= 30) return 'bg-amber-50 text-amber-700 border-amber-200'
  return 'bg-red-50 text-red-700 border-red-200'
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-ZA', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function LastUpdated({ date, sourceLabel, sourceHref, className = '' }: LastUpdatedProps) {
  const parsedDate = date instanceof Date ? date : new Date(date)
  const now = new Date()
  const diffDays = Math.floor((now.getTime() - parsedDate.getTime()) / (1000 * 60 * 60 * 24))
  const relative = getRelativeTime(parsedDate)
  const freshnessClasses = getFreshnessClasses(diffDays)

  return (
    <div className={`inline-flex items-center gap-2 flex-wrap ${className}`}>
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full border ${freshnessClasses}`}
      >
        <Clock className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
        <time dateTime={parsedDate.toISOString()}>
          Last updated: {formatDate(parsedDate)}
          {relative ? ` (${relative})` : ''}
        </time>
      </span>

      {sourceLabel && (
        <>
          {sourceHref ? (
            <a
              href={sourceHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-blue-600 transition-colors"
            >
              <ExternalLink className="w-3 h-3" aria-hidden="true" />
              {sourceLabel}
            </a>
          ) : (
            <span className="text-xs text-slate-400">{sourceLabel}</span>
          )}
        </>
      )}
    </div>
  )
}

export { LastUpdated }
export type { LastUpdatedProps }

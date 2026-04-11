import React from 'react'
import { ExternalLink } from 'lucide-react'

interface SourceLinkProps {
  label: string
  href: string
  className?: string
}

function SourceLink({ label, href, className = '' }: SourceLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-1 text-xs text-slate-500 hover:text-blue-600 transition-colors underline-offset-2 hover:underline ${className}`}
    >
      <ExternalLink className="w-3 h-3 shrink-0" aria-hidden="true" />
      <span>Source: {label}</span>
    </a>
  )
}

export { SourceLink }
export type { SourceLinkProps }

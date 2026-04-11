'use client'

import React, { useState } from 'react'
import { Share2, Check } from 'lucide-react'
import { useToast } from '../ui/Toast'

interface ShareButtonProps {
  url?: string
  title?: string
  label?: string
  className?: string
}

function ShareButton({
  url,
  title = 'EveryRandSA',
  label = 'Share',
  className = '',
}: ShareButtonProps) {
  const { toast } = useToast()
  const [copied, setCopied] = useState(false)

  const handleShare = async () => {
    const shareUrl = url ?? (typeof window !== 'undefined' ? window.location.href : '')

    if (typeof navigator !== 'undefined' && 'share' in navigator) {
      try {
        await navigator.share({ title, url: shareUrl })
        return
      } catch {
        // User cancelled or not supported — fall through to clipboard
      }
    }

    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      toast.success('Link copied to clipboard!')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('Could not copy link. Please copy the URL manually.')
    }
  }

  return (
    <button
      onClick={handleShare}
      aria-label="Share this page"
      className={[
        'inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600',
        'hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {copied ? (
        <Check className="w-4 h-4 text-emerald-600" aria-hidden="true" />
      ) : (
        <Share2 className="w-4 h-4" aria-hidden="true" />
      )}
      <span>{copied ? 'Copied!' : label}</span>
    </button>
  )
}

export { ShareButton }
export type { ShareButtonProps }

'use client'

import React, { useState, useRef, useEffect, useId, useCallback } from 'react'

type TooltipPosition = 'top' | 'right' | 'bottom' | 'left'

interface TooltipProps {
  content: React.ReactNode
  position?: TooltipPosition
  delay?: number
  className?: string
  children: React.ReactElement
}

const positionClasses: Record<TooltipPosition, { tooltip: string; arrow: string }> = {
  top: {
    tooltip: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    arrow: 'top-full left-1/2 -translate-x-1/2 border-t-slate-800 border-x-transparent border-b-transparent',
  },
  bottom: {
    tooltip: 'top-full left-1/2 -translate-x-1/2 mt-2',
    arrow: 'bottom-full left-1/2 -translate-x-1/2 border-b-slate-800 border-x-transparent border-t-transparent',
  },
  left: {
    tooltip: 'right-full top-1/2 -translate-y-1/2 mr-2',
    arrow: 'left-full top-1/2 -translate-y-1/2 border-l-slate-800 border-y-transparent border-r-transparent',
  },
  right: {
    tooltip: 'left-full top-1/2 -translate-y-1/2 ml-2',
    arrow: 'right-full top-1/2 -translate-y-1/2 border-r-slate-800 border-y-transparent border-l-transparent',
  },
}

function Tooltip({
  content,
  position = 'top',
  delay = 300,
  className = '',
  children,
}: TooltipProps) {
  const [visible, setVisible] = useState(false)
  const showTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const tooltipId = useId()

  const show = useCallback(() => {
    if (hideTimer.current) clearTimeout(hideTimer.current)
    showTimer.current = setTimeout(() => setVisible(true), delay)
  }, [delay])

  const hide = useCallback(() => {
    if (showTimer.current) clearTimeout(showTimer.current)
    hideTimer.current = setTimeout(() => setVisible(false), 150)
  }, [])

  useEffect(() => {
    return () => {
      if (showTimer.current) clearTimeout(showTimer.current)
      if (hideTimer.current) clearTimeout(hideTimer.current)
    }
  }, [])

  const pos = positionClasses[position]

  return (
    <span
      className="relative inline-flex"
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      {React.cloneElement(children as React.ReactElement<React.HTMLAttributes<HTMLElement>>, {
        'aria-describedby': visible ? tooltipId : undefined,
      })}

      {visible && (
        <span
          id={tooltipId}
          role="tooltip"
          className={[
            'absolute z-50 px-2.5 py-1.5 text-xs font-medium text-white bg-slate-800 rounded-lg whitespace-nowrap shadow-lg',
            'pointer-events-none select-none',
            'animate-in fade-in zoom-in-95 duration-150',
            pos.tooltip,
            className,
          ]
            .filter(Boolean)
            .join(' ')}
        >
          {content}
          <span
            className={`absolute w-0 h-0 border-4 ${pos.arrow}`}
            aria-hidden="true"
          />
        </span>
      )}
    </span>
  )
}

export { Tooltip }
export type { TooltipProps, TooltipPosition }

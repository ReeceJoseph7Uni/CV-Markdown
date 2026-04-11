'use client'

import React, { useState } from 'react'
import { ChevronDown } from 'lucide-react'

interface AccordionItem {
  id: string
  title: string
  content: React.ReactNode
}

interface AccordionProps {
  items: AccordionItem[]
  allowMultiple?: boolean
  defaultOpen?: string[]
  className?: string
}

function Accordion({
  items,
  allowMultiple = false,
  defaultOpen = [],
  className = '',
}: AccordionProps) {
  const [openIds, setOpenIds] = useState<Set<string>>(new Set(defaultOpen))

  const toggle = (id: string) => {
    setOpenIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        if (!allowMultiple) next.clear()
        next.add(id)
      }
      return next
    })
  }

  return (
    <div className={`divide-y divide-slate-200 border border-slate-200 rounded-xl overflow-hidden ${className}`}>
      {items.map((item) => {
        const isOpen = openIds.has(item.id)
        return (
          <div key={item.id}>
            <button
              type="button"
              onClick={() => toggle(item.id)}
              aria-expanded={isOpen}
              aria-controls={`accordion-panel-${item.id}`}
              id={`accordion-header-${item.id}`}
              className="w-full flex items-center justify-between px-5 py-4 text-left text-sm font-medium text-slate-900 hover:bg-slate-50 transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600"
            >
              <span>{item.title}</span>
              <ChevronDown
                aria-hidden="true"
                className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
              />
            </button>

            <div
              id={`accordion-panel-${item.id}`}
              role="region"
              aria-labelledby={`accordion-header-${item.id}`}
              className={[
                'overflow-hidden transition-all duration-300 ease-in-out',
                isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0',
              ].join(' ')}
            >
              <div className="px-5 pb-5 pt-1 text-sm text-slate-600">{item.content}</div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export { Accordion }
export type { AccordionProps, AccordionItem }

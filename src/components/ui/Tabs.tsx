'use client'

import React, { useId, useRef, KeyboardEvent } from 'react'

type TabsVariant = 'line' | 'pills' | 'enclosed'

interface Tab {
  id: string
  label: string
  icon?: React.ReactNode
}

interface TabsProps {
  tabs: Tab[]
  activeTab: string
  onTabChange: (tabId: string) => void
  variant?: TabsVariant
  className?: string
  children?: React.ReactNode
}

const variantContainerClasses: Record<TabsVariant, string> = {
  line: 'border-b border-slate-200',
  pills: 'bg-slate-100 p-1 rounded-xl',
  enclosed: 'border-b border-slate-200',
}

function getTabClasses(variant: TabsVariant, isActive: boolean): string {
  const base =
    'inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 whitespace-nowrap'

  if (variant === 'line') {
    return [
      base,
      '-mb-px border-b-2',
      isActive
        ? 'border-blue-600 text-blue-600'
        : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300',
    ].join(' ')
  }

  if (variant === 'pills') {
    return [
      base,
      'rounded-lg',
      isActive
        ? 'bg-white text-blue-700 shadow-sm'
        : 'text-slate-600 hover:text-slate-900',
    ].join(' ')
  }

  // enclosed
  return [
    base,
    'rounded-t-lg border border-b-0',
    isActive
      ? 'border-slate-200 bg-white text-slate-900 -mb-px'
      : 'border-transparent text-slate-600 hover:text-slate-900',
  ].join(' ')
}

function Tabs({
  tabs,
  activeTab,
  onTabChange,
  variant = 'line',
  className = '',
  children,
}: TabsProps) {
  const tablistId = useId()
  const tabRefs = useRef<Map<string, HTMLButtonElement>>(new Map())

  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>, currentIndex: number) => {
    let nextIndex: number | null = null

    if (e.key === 'ArrowLeft') {
      nextIndex = (currentIndex - 1 + tabs.length) % tabs.length
    } else if (e.key === 'ArrowRight') {
      nextIndex = (currentIndex + 1) % tabs.length
    } else if (e.key === 'Home') {
      nextIndex = 0
    } else if (e.key === 'End') {
      nextIndex = tabs.length - 1
    }

    if (nextIndex !== null) {
      e.preventDefault()
      const nextTab = tabs[nextIndex]
      onTabChange(nextTab.id)
      tabRefs.current.get(nextTab.id)?.focus()
    }
  }

  return (
    <div className={className}>
      <div
        role="tablist"
        id={tablistId}
        aria-label="Tabs"
        className={`flex ${variantContainerClasses[variant]}`}
      >
        {tabs.map((tab, index) => {
          const isActive = tab.id === activeTab
          return (
            <button
              key={tab.id}
              ref={(el) => {
                if (el) tabRefs.current.set(tab.id, el)
                else tabRefs.current.delete(tab.id)
              }}
              role="tab"
              aria-selected={isActive}
              aria-controls={`tabpanel-${tab.id}`}
              id={`tab-${tab.id}`}
              tabIndex={isActive ? 0 : -1}
              onClick={() => onTabChange(tab.id)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className={getTabClasses(variant, isActive)}
            >
              {tab.icon && (
                <span className="w-4 h-4 shrink-0" aria-hidden="true">
                  {tab.icon}
                </span>
              )}
              {tab.label}
            </button>
          )
        })}
      </div>

      <div className="mt-4">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            id={`tabpanel-${tab.id}`}
            role="tabpanel"
            aria-labelledby={`tab-${tab.id}`}
            hidden={tab.id !== activeTab}
          >
            {tab.id === activeTab && children}
          </div>
        ))}
      </div>
    </div>
  )
}

export { Tabs }
export type { TabsProps, Tab, TabsVariant }

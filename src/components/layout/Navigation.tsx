'use client'

import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronDown, Menu, X, TrendingUp } from 'lucide-react'

interface DropdownItem {
  label: string
  href: string
}

interface NavItem {
  label: string
  href?: string
  dropdown?: DropdownItem[]
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Calculators', href: '/calculators' },
  {
    label: 'Compare',
    dropdown: [
      { label: 'Savings Accounts', href: '/compare/savings' },
      { label: 'Loans', href: '/compare/loans' },
    ],
  },
  { label: 'Learn', href: '/learn' },
]

function Navigation() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenDropdown(null)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  // Close mobile on route change
  useEffect(() => {
    const id = setTimeout(() => {
      setMobileOpen(false)
      setOpenDropdown(null)
    }, 0)
    return () => clearTimeout(id)
  }, [pathname])

  // Lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  const isActive = (href?: string) =>
    href ? (href === '/' ? pathname === '/' : pathname.startsWith(href)) : false

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <nav
        role="navigation"
        aria-label="Main navigation"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 group focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded-lg"
          >
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-700 text-white">
              <TrendingUp className="w-4 h-4" aria-hidden="true" />
            </span>
            <span className="font-bold text-slate-900 text-lg leading-none">
              Every<span className="text-blue-700">Rand</span>SA
            </span>
          </Link>

          {/* Desktop nav */}
          <div ref={dropdownRef} className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              if (item.dropdown) {
                const isDropOpen = openDropdown === item.label
                return (
                  <div key={item.label} className="relative">
                    <button
                      onClick={() => setOpenDropdown(isDropOpen ? null : item.label)}
                      aria-expanded={isDropOpen}
                      aria-haspopup="true"
                      className="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                    >
                      {item.label}
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-200 ${isDropOpen ? 'rotate-180' : ''}`}
                        aria-hidden="true"
                      />
                    </button>

                    {isDropOpen && (
                      <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-xl shadow-lg border border-slate-200 py-1 z-50 animate-in fade-in zoom-in-95 duration-150">
                        {item.dropdown.map((sub) => (
                          <Link
                            key={sub.href}
                            href={sub.href}
                            className="block px-4 py-2 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                          >
                            {sub.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                )
              }

              return (
                <Link
                  key={item.label}
                  href={item.href!}
                  className={[
                    'px-3 py-2 text-sm font-medium rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600',
                    isActive(item.href)
                      ? 'text-blue-700 bg-blue-50'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100',
                  ].join(' ')}
                  aria-current={isActive(item.href) ? 'page' : undefined}
                >
                  {item.label}
                </Link>
              )
            })}
          </div>

          {/* CTA + Mobile toggle */}
          <div className="flex items-center gap-2">
            <Link
              href="/get-started"
              className="hidden sm:inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2"
            >
              Get Started
            </Link>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              className="md:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
            >
              {mobileOpen ? (
                <X className="w-5 h-5" aria-hidden="true" />
              ) : (
                <Menu className="w-5 h-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      {mobileOpen && (
        <div
          id="mobile-menu"
          className="md:hidden fixed inset-0 top-16 z-30 bg-white animate-in fade-in duration-200"
        >
          <nav
            aria-label="Mobile navigation"
            className="flex flex-col px-4 py-6 gap-1"
          >
            {NAV_ITEMS.map((item) => {
              if (item.dropdown) {
                return (
                  <div key={item.label}>
                    <p className="px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      {item.label}
                    </p>
                    {item.dropdown.map((sub) => (
                      <Link
                        key={sub.href}
                        href={sub.href}
                        className="block px-6 py-2 text-sm text-slate-700 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                )
              }
              return (
                <Link
                  key={item.label}
                  href={item.href!}
                  aria-current={isActive(item.href) ? 'page' : undefined}
                  className={[
                    'px-3 py-3 text-base font-medium rounded-lg transition-colors',
                    isActive(item.href)
                      ? 'text-blue-700 bg-blue-50'
                      : 'text-slate-700 hover:text-blue-700 hover:bg-blue-50',
                  ].join(' ')}
                >
                  {item.label}
                </Link>
              )
            })}

            <div className="mt-4 pt-4 border-t border-slate-200">
              <Link
                href="/get-started"
                className="flex items-center justify-center px-4 py-3 text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors"
              >
                Get Started
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}

export { Navigation }

import React from 'react'
import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'
import { Navigation } from './Navigation'
import { Footer } from './Footer'
import { ToastProvider } from '../ui/Toast'

interface Breadcrumb {
  label: string
  href?: string
}

interface LayoutProps {
  children: React.ReactNode
  breadcrumbs?: Breadcrumb[]
  title?: string
}

function Breadcrumbs({ items }: { items: Breadcrumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="bg-slate-50 border-b border-slate-200">
      <ol className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center gap-1.5 text-sm flex-wrap">
        <li>
          <Link
            href="/"
            className="text-slate-500 hover:text-slate-900 transition-colors flex items-center gap-1"
          >
            <Home className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Home</span>
          </Link>
        </li>
        {items.map((crumb, i) => {
          const isLast = i === items.length - 1
          return (
            <li key={i} className="flex items-center gap-1.5">
              <ChevronRight
                className="w-3.5 h-3.5 text-slate-400 shrink-0"
                aria-hidden="true"
              />
              {crumb.href && !isLast ? (
                <Link
                  href={crumb.href}
                  className="text-slate-500 hover:text-slate-900 transition-colors"
                >
                  {crumb.label}
                </Link>
              ) : (
                <span
                  aria-current={isLast ? 'page' : undefined}
                  className={isLast ? 'text-slate-900 font-medium' : 'text-slate-500'}
                >
                  {crumb.label}
                </span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

function Layout({ children, breadcrumbs, title }: LayoutProps) {
  return (
    <ToastProvider>
      <div className="min-h-screen flex flex-col">
        {/* Skip to content */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-white focus:text-blue-700 focus:rounded-lg focus:shadow-lg focus:font-medium focus:text-sm"
        >
          Skip to main content
        </a>

        <Navigation />

        {breadcrumbs && breadcrumbs.length > 0 && (
          <Breadcrumbs items={breadcrumbs} />
        )}

        <main id="main-content" className="flex-1" tabIndex={-1}>
          {title && (
            <div className="sr-only">
              <h1>{title}</h1>
            </div>
          )}
          {children}
        </main>

        <Footer />
      </div>
    </ToastProvider>
  )
}

export { Layout }
export type { LayoutProps, Breadcrumb }

import React from 'react'
import Link from 'next/link'
import { GitBranch, TrendingUp } from 'lucide-react'

const FOOTER_LINKS = {
  Calculators: [
    { label: 'Savings Calculator', href: '/calculators/savings' },
    { label: 'Loan Calculator', href: '/calculators/loan' },
    { label: 'Tax Calculator', href: '/calculators/tax' },
    { label: 'Investment Returns', href: '/calculators/investment' },
  ],
  Compare: [
    { label: 'Savings Accounts', href: '/compare/savings' },
    { label: 'Loans', href: '/compare/loans' },
  ],
  Learn: [
    { label: 'Articles', href: '/learn' },
    { label: 'Glossary', href: '/learn/glossary' },
    { label: 'SARB Rates', href: '/learn/sarb-rates' },
  ],
  Legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Use', href: '/terms' },
    { label: 'Disclaimer', href: '/disclaimer' },
  ],
}

function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-slate-900 text-slate-300" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Top grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8 pb-10 border-b border-slate-700">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-3 lg:col-span-1">
            <Link
              href="/"
              className="inline-flex items-center gap-2 mb-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 rounded"
            >
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-600">
                <TrendingUp className="w-4 h-4 text-white" aria-hidden="true" />
              </span>
              <span className="font-bold text-white text-lg">
                Every<span className="text-blue-400">Rand</span>SA
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed max-w-xs">
              Making South African financial decisions smarter — free tools, real data.
            </p>
            <div className="mt-4 flex gap-3">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="EveryRandSA on GitHub"
                className="text-slate-400 hover:text-white transition-colors"
              >
                <GitBranch className="w-5 h-5" aria-hidden="true" />
              </a>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([heading, links]) => (
            <div key={heading}>
              <h3 className="text-sm font-semibold text-white mb-3">{heading}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Disclaimer */}
        <div className="mt-8 p-4 bg-slate-800 rounded-xl">
          <p className="text-xs text-slate-400 leading-relaxed">
            <strong className="text-slate-300">Disclaimer:</strong> All rates and financial information
            on EveryRandSA are sourced from publicly available data (including SARB) and are provided
            for informational purposes only. Rates are subject to change without notice. This is not
            financial advice. Always consult a qualified financial advisor before making financial
            decisions. Last SARB repo rate reference: January 2025.
          </p>
        </div>

        {/* Copyright */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <p>© {currentYear} EveryRandSA. All rights reserved.</p>
          <p>Built for South Africans 🇿🇦</p>
        </div>
      </div>
    </footer>
  )
}

export { Footer }

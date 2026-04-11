import { Layout } from "@/components/layout/Layout";
import Link from "next/link";
import {
  Calculator, TrendingUp, Shield, BookOpen,
  ArrowRight, Star, Zap, PiggyBank,
  CreditCard, BarChart3, Percent,
} from "lucide-react";

const SARB_POLICY_RATE = 6.75;
const PRIME_RATE = 10.25;
const TFSA_ANNUAL_LIMIT = 46000;
const TFSA_LIFETIME_LIMIT = 500000;
const LAST_UPDATED = "March 2026";

const calculators = [
  { href: "/calculators/paye", label: "PAYE Tax", description: "Calculate your take-home pay" },
  { href: "/calculators/loan", label: "Loan Repayment", description: "Monthly repayment & total cost" },
  { href: "/calculators/bond", label: "Bond / Home Loan", description: "Bond repayments & transfer duty" },
  { href: "/calculators/savings", label: "Savings Growth", description: "Grow your savings over time" },
  { href: "/calculators/tfsa", label: "TFSA Tracker", description: "Track your TFSA contributions" },
  { href: "/calculators/debt", label: "Debt Snowball", description: "Plan your debt payoff strategy" },
];

const guides = [
  { href: "/learn/how-paye-works", title: "How PAYE Works in SA", readTime: "5 min read", category: "Tax" },
  { href: "/learn/understanding-tfsa", title: "Understanding Tax-Free Savings", readTime: "4 min read", category: "Savings" },
  { href: "/learn/how-notice-accounts-work", title: "How Notice Accounts Work", readTime: "3 min read", category: "Banking" },
  { href: "/learn/comparing-bank-products", title: "How to Compare Bank Products", readTime: "6 min read", category: "Guide" },
];

export default function HomePage() {
  return (
    <Layout>
      <section className="bg-gradient-to-br from-blue-700 to-blue-900 text-white py-20 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-blue-600/50 rounded-full px-4 py-2 text-sm mb-6">
            <Shield size={14} />
            <span>Data sourced from SARB &amp; SARS · Updated {LAST_UPDATED}</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Make Every Rand<br />
            <span className="text-blue-200">Work Harder</span>
          </h1>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Free South African finance calculators and bank product comparisons.
            See the real value of savings accounts, loans, and tax — not just the headline rate.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/calculators"
              className="inline-flex items-center gap-2 bg-white text-blue-700 font-semibold px-8 py-4 rounded-lg hover:bg-blue-50 transition-colors text-lg"
            >
              <Calculator size={20} /> Open Calculators
            </Link>
            <Link
              href="/compare/savings"
              className="inline-flex items-center gap-2 border-2 border-white text-white font-semibold px-8 py-4 rounded-lg hover:bg-white/10 transition-colors text-lg"
            >
              Compare Savings <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Rate Snapshot */}
      <section className="bg-slate-50 border-b border-slate-200 py-6 px-4" aria-label="Today's key interest rates">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
            <div className="text-center">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">SARB Policy Rate</p>
              <p className="text-3xl font-bold text-blue-700">{SARB_POLICY_RATE}%</p>
            </div>
            <div className="hidden sm:block w-px h-12 bg-slate-300" />
            <div className="text-center">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Prime Lending Rate</p>
              <p className="text-3xl font-bold text-blue-700">{PRIME_RATE}%</p>
            </div>
            <div className="hidden sm:block w-px h-12 bg-slate-300" />
            <div className="text-center">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">TFSA Annual Limit</p>
              <p className="text-3xl font-bold text-emerald-600">R{TFSA_ANNUAL_LIMIT.toLocaleString()}</p>
              <p className="text-xs text-slate-500">from 1 March 2026</p>
            </div>
            <div className="hidden sm:block w-px h-12 bg-slate-300" />
            <div className="text-center">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">TFSA Lifetime Limit</p>
              <p className="text-3xl font-bold text-emerald-600">R{(TFSA_LIFETIME_LIMIT / 1000).toFixed(0)}k</p>
            </div>
          </div>
          <p className="text-center text-xs text-slate-400 mt-4">
            Rates as published by SARB. Updated {LAST_UPDATED}.{" "}
            <a href="https://www.sarb.co.za" target="_blank" rel="noopener noreferrer" className="underline">
              Source: SARB
            </a>
          </p>
        </div>
      </section>

      {/* Calculators Grid */}
      <section className="py-16 px-4" aria-labelledby="calculators-heading">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 id="calculators-heading" className="text-3xl font-bold text-slate-900 mb-3">
              Financial Calculators
            </h2>
            <p className="text-slate-600 text-lg">
              Fast, accurate calculators built for South African tax laws and financial products.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {calculators.map((calc) => (
              <Link
                key={calc.href}
                href={calc.href}
                className="group block bg-white border border-slate-200 rounded-xl p-6 hover:border-blue-300 hover:shadow-md transition-all duration-200"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-blue-100 text-blue-700 mb-4 group-hover:bg-blue-700 group-hover:text-white transition-colors">
                  <Calculator size={22} />
                </div>
                <h3 className="font-semibold text-slate-900 text-lg mb-1 group-hover:text-blue-700 transition-colors">
                  {calc.label}
                </h3>
                <p className="text-slate-500 text-sm">{calc.description}</p>
                <div className="flex items-center gap-1 mt-3 text-blue-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  Open calculator <ArrowRight size={14} />
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/calculators" className="inline-flex items-center gap-2 text-blue-700 font-semibold hover:underline">
              View all calculators <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Compare Section */}
      <section className="bg-gradient-to-r from-emerald-50 to-teal-50 py-16 px-4" aria-labelledby="compare-heading">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 id="compare-heading" className="text-3xl font-bold text-slate-900 mb-3">Compare Bank Products</h2>
            <p className="text-slate-600 text-lg max-w-xl mx-auto">
              See the real return after fees — not just the headline rate.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-8 border border-emerald-200 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <PiggyBank size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-slate-900">Savings Accounts</h3>
                  <p className="text-sm text-slate-500">Including TFSA eligible</p>
                </div>
              </div>
              <ul className="space-y-2 text-sm text-slate-600 mb-6">
                <li className="flex items-center gap-2"><Star size={14} className="text-emerald-500" /> Compare by effective yield after fees</li>
                <li className="flex items-center gap-2"><Star size={14} className="text-emerald-500" /> Filter by TFSA eligibility</li>
                <li className="flex items-center gap-2"><Star size={14} className="text-emerald-500" /> Compare access type &amp; notice periods</li>
              </ul>
              <Link
                href="/compare/savings"
                className="inline-flex items-center gap-2 bg-emerald-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors w-full justify-center"
              >
                Compare Savings <ArrowRight size={16} />
              </Link>
            </div>
            <div className="bg-white rounded-xl p-8 border border-blue-200 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                  <CreditCard size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-slate-900">Loans</h3>
                  <p className="text-sm text-slate-500">Personal &amp; home loans</p>
                </div>
              </div>
              <ul className="space-y-2 text-sm text-slate-600 mb-6">
                <li className="flex items-center gap-2"><Star size={14} className="text-blue-500" /> Compare total cost of borrowing</li>
                <li className="flex items-center gap-2"><Star size={14} className="text-blue-500" /> See initiation fees included</li>
                <li className="flex items-center gap-2"><Star size={14} className="text-blue-500" /> Fixed vs variable rate comparison</li>
              </ul>
              <Link
                href="/compare/loans"
                className="inline-flex items-center gap-2 bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-800 transition-colors w-full justify-center"
              >
                Compare Loans <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* TFSA Callout */}
      <section className="py-16 px-4 bg-white" aria-labelledby="tfsa-heading">
        <div className="max-w-5xl mx-auto">
          <div className="bg-gradient-to-r from-teal-600 to-emerald-600 rounded-2xl p-8 md:p-12 text-white">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-3 py-1 text-sm mb-4">
                  <Zap size={14} /> Updated for 2026
                </div>
                <h2 id="tfsa-heading" className="text-2xl md:text-3xl font-bold mb-3">
                  TFSA Limits Updated for March 2026
                </h2>
                <p className="text-teal-100 text-lg mb-6">
                  Annual limit increases to <strong className="text-white">R46,000</strong>.
                  Lifetime cap remains <strong className="text-white">R500,000</strong>.
                  Track exactly how much you can contribute tax-free.
                </p>
                <Link
                  href="/calculators/tfsa"
                  className="inline-flex items-center gap-2 bg-white text-teal-700 font-bold px-6 py-3 rounded-lg hover:bg-teal-50 transition-colors"
                >
                  <Percent size={18} /> Track My TFSA
                </Link>
              </div>
              <div className="hidden md:block">
                <div className="bg-white/10 rounded-xl p-6 text-center min-w-48">
                  <p className="text-teal-200 text-sm font-medium uppercase tracking-wider mb-2">Annual Limit</p>
                  <p className="text-4xl font-bold">R46,000</p>
                  <div className="border-t border-white/20 mt-4 pt-4">
                    <p className="text-teal-200 text-sm font-medium uppercase tracking-wider mb-2">Lifetime Limit</p>
                    <p className="text-4xl font-bold">R500k</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Learn Section */}
      <section className="py-16 px-4 bg-slate-50" aria-labelledby="learn-heading">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 id="learn-heading" className="text-3xl font-bold text-slate-900 mb-2">
                Learn About SA Finance
              </h2>
              <p className="text-slate-600">Plain English guides to South African tax and banking.</p>
            </div>
            <Link href="/learn" className="hidden sm:flex items-center gap-1 text-blue-700 font-semibold hover:underline text-sm">
              All guides <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {guides.map((guide) => (
              <Link
                key={guide.href}
                href={guide.href}
                className="group block bg-white rounded-xl p-5 border border-slate-200 hover:border-blue-200 hover:shadow-sm transition-all"
              >
                <div className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-xs font-semibold px-2 py-1 rounded-full mb-3">
                  <BookOpen size={11} /> {guide.category}
                </div>
                <h3 className="font-semibold text-slate-900 text-sm leading-snug mb-3 group-hover:text-blue-700 transition-colors">
                  {guide.title}
                </h3>
                <p className="text-xs text-slate-400">{guide.readTime}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-12 px-4 bg-white border-t border-slate-100">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-xl font-semibold text-slate-700 mb-8">Why Trust EveryRandSA?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-700">
                <Shield size={24} />
              </div>
              <h3 className="font-semibold text-slate-900">Official Sources</h3>
              <p className="text-sm text-slate-500">
                Tax brackets and rates sourced directly from SARS and SARB official publications.
              </p>
            </div>
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
                <TrendingUp size={24} />
              </div>
              <h3 className="font-semibold text-slate-900">Effective Yield</h3>
              <p className="text-sm text-slate-500">
                We calculate real returns after fees, not just headline rates. See what you actually earn.
              </p>
            </div>
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-700">
                <BarChart3 size={24} />
              </div>
              <h3 className="font-semibold text-slate-900">Always Free</h3>
              <p className="text-sm text-slate-500">
                All calculators and comparisons are free. No sign-up required. No hidden catches.
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}

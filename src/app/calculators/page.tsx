'use client';

import { useState, useMemo } from "react";
import { Layout } from "@/components/layout/Layout";
import Link from "next/link";
import { Calculator, Search, ArrowRight, X } from "lucide-react";

interface CalculatorEntry {
  href: string;
  label: string;
  description: string;
  category: "Tax" | "Loans" | "Savings" | "Debt";
  tags: string[];
}

const ALL_CALCULATORS: CalculatorEntry[] = [
  {
    href: "/calculators/paye",
    label: "PAYE Tax Calculator",
    description: "Calculate your monthly take-home pay based on your gross salary. Uses the latest SARS tax tables including rebates and medical credits.",
    category: "Tax",
    tags: ["income tax", "salary", "take-home", "SARS", "rebates"],
  },
  {
    href: "/calculators/loan",
    label: "Loan Repayment",
    description: "Calculate monthly repayments, total interest, and total cost of any personal or vehicle loan.",
    category: "Loans",
    tags: ["personal loan", "repayment", "interest", "vehicle", "monthly"],
  },
  {
    href: "/calculators/bond",
    label: "Bond / Home Loan",
    description: "Calculate bond repayments, transfer duty, bond registration costs, and affordability.",
    category: "Loans",
    tags: ["bond", "home loan", "transfer duty", "property", "mortgage"],
  },
  {
    href: "/calculators/savings",
    label: "Savings Growth",
    description: "Project how your savings grow over time with compound interest. Compare different rates and deposit frequencies.",
    category: "Savings",
    tags: ["savings", "compound interest", "growth", "deposit", "returns"],
  },
  {
    href: "/calculators/tfsa",
    label: "TFSA Tracker",
    description: "Track your Tax-Free Savings Account contributions against annual (R46,000) and lifetime (R500,000) limits.",
    category: "Savings",
    tags: ["TFSA", "tax-free", "contributions", "limits", "2026"],
  },
  {
    href: "/calculators/interest",
    label: "Interest Calculator",
    description: "Calculate simple and compound interest. Understand the difference between nominal and effective rates.",
    category: "Savings",
    tags: ["interest", "compound", "simple", "nominal", "effective rate"],
  },
  {
    href: "/calculators/debt",
    label: "Debt Snowball / Avalanche",
    description: "Plan your debt payoff strategy using the snowball (smallest balance first) or avalanche (highest rate first) method.",
    category: "Debt",
    tags: ["debt", "snowball", "avalanche", "payoff", "credit card"],
  },
  {
    href: "/calculators/net-to-gross",
    label: "Salary Net-to-Gross",
    description: "Work backwards from a desired take-home salary to find the gross salary you need to negotiate.",
    category: "Tax",
    tags: ["salary", "net to gross", "negotiation", "gross salary", "PAYE"],
  },
];

const CATEGORY_COLORS: Record<string, string> = {
  Tax: "bg-blue-100 text-blue-700",
  Loans: "bg-purple-100 text-purple-700",
  Savings: "bg-emerald-100 text-emerald-700",
  Debt: "bg-orange-100 text-orange-700",
};

const CATEGORIES = ["All", "Tax", "Loans", "Savings", "Debt"] as const;

export default function CalculatorsPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return ALL_CALCULATORS.filter((c) => {
      const matchesCategory = activeCategory === "All" || c.category === activeCategory;
      if (!matchesCategory) return false;
      if (!q) return true;
      return (
        c.label.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.tags.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [search, activeCategory]);

  return (
    <Layout breadcrumbs={[{ label: "Calculators" }]}>
      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-slate-900 mb-3">Financial Calculators</h1>
          <p className="text-slate-600 text-lg max-w-2xl">
            Free South African finance calculators built on official SARS tax tables and SARB rates.
            No sign-up required.
          </p>
        </div>

        {/* Search + Category Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" aria-hidden="true" />
            <input
              type="search"
              placeholder="Search calculators…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              aria-label="Search calculators"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeCategory === cat
                    ? "bg-blue-700 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Results count */}
        <p className="text-sm text-slate-500 mb-6">
          Showing {filtered.length} of {ALL_CALCULATORS.length} calculators
        </p>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 bg-slate-50 rounded-2xl border border-slate-200">
            <Calculator className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-slate-700 mb-2">No calculators found</h2>
            <p className="text-slate-500 text-sm mb-4">
              Try a different search term or clear your filters.
            </p>
            <button
              onClick={() => { setSearch(""); setActiveCategory("All"); }}
              className="inline-flex items-center gap-1 text-blue-700 font-medium text-sm hover:underline"
            >
              <X className="w-3.5 h-3.5" /> Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((calc) => (
              <Link
                key={calc.href}
                href={calc.href}
                className="group block bg-white border border-slate-200 rounded-xl p-6 hover:border-blue-300 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="inline-flex items-center justify-center w-11 h-11 rounded-lg bg-blue-100 text-blue-700 group-hover:bg-blue-700 group-hover:text-white transition-colors">
                    <Calculator size={20} />
                  </div>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${CATEGORY_COLORS[calc.category]}`}>
                    {calc.category}
                  </span>
                </div>
                <h2 className="font-semibold text-slate-900 text-base mb-2 group-hover:text-blue-700 transition-colors">
                  {calc.label}
                </h2>
                <p className="text-slate-500 text-sm leading-relaxed mb-4">{calc.description}</p>
                <div className="flex flex-wrap gap-1 mb-4">
                  {calc.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-1 text-blue-600 text-sm font-medium">
                  Open Calculator <ArrowRight size={14} />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}

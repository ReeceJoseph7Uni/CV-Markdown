import { Layout } from "@/components/layout/Layout";
import Link from "next/link";
import { BookOpen, ArrowRight, Clock } from "lucide-react";

interface Guide {
  slug: string;
  title: string;
  excerpt: string;
  readTime: string;
  category: string;
  relatedCalcs: { href: string; label: string }[];
  lastUpdated: string;
}

const GUIDES: Guide[] = [
  {
    slug: "how-paye-works",
    title: "How PAYE Works in South Africa",
    excerpt: "Understand how Pay-As-You-Earn tax is calculated on your salary, including tax brackets, rebates, and medical credits for the 2025/26 tax year.",
    readTime: "5 min read",
    category: "Tax",
    relatedCalcs: [
      { href: "/calculators/paye", label: "PAYE Calculator" },
      { href: "/calculators/net-to-gross", label: "Net-to-Gross" },
    ],
    lastUpdated: "March 2026",
  },
  {
    slug: "understanding-tfsa",
    title: "Understanding Tax-Free Savings Accounts",
    excerpt: "Everything you need to know about TFSAs in South Africa: annual limits, lifetime caps, eligible products, and the power of tax-free compound growth.",
    readTime: "4 min read",
    category: "Savings",
    relatedCalcs: [
      { href: "/calculators/tfsa", label: "TFSA Tracker" },
      { href: "/calculators/savings", label: "Savings Growth" },
    ],
    lastUpdated: "March 2026",
  },
  {
    slug: "how-notice-accounts-work",
    title: "How Notice Accounts Work",
    excerpt: "Notice deposit accounts offer higher rates in exchange for giving the bank advance notice before withdrawing. Here's how they work and whether they're right for you.",
    readTime: "3 min read",
    category: "Banking",
    relatedCalcs: [
      { href: "/compare/savings", label: "Compare Savings" },
      { href: "/calculators/savings", label: "Savings Growth" },
    ],
    lastUpdated: "February 2026",
  },
  {
    slug: "comparing-bank-products",
    title: "How to Compare Bank Products",
    excerpt: "Headline rates don't tell the whole story. Learn how to compare savings accounts and loans using effective yield, total cost of credit, and fee-adjusted returns.",
    readTime: "6 min read",
    category: "Guide",
    relatedCalcs: [
      { href: "/compare/savings", label: "Compare Savings" },
      { href: "/compare/loans", label: "Compare Loans" },
    ],
    lastUpdated: "February 2026",
  },
  {
    slug: "interest-rate-types-explained",
    title: "Interest Rate Types Explained",
    excerpt: "Fixed vs variable, nominal vs effective, prime-linked — understanding SA interest rate terminology helps you make better borrowing and saving decisions.",
    readTime: "5 min read",
    category: "Banking",
    relatedCalcs: [
      { href: "/calculators/interest", label: "Interest Calculator" },
      { href: "/calculators/loan", label: "Loan Calculator" },
    ],
    lastUpdated: "January 2026",
  },
  {
    slug: "glossary",
    title: "Glossary of South African Financial Terms",
    excerpt: "A plain English glossary covering PAYE, prime rate, SARB repo rate, TFSA, effective yield, transfer duty, NCR, and more South African financial terminology.",
    readTime: "8 min read",
    category: "Reference",
    relatedCalcs: [
      { href: "/calculators", label: "All Calculators" },
    ],
    lastUpdated: "March 2026",
  },
];

const CATEGORIES = ["All", "Tax", "Savings", "Banking", "Guide", "Reference"] as const;

const CATEGORY_COLORS: Record<string, string> = {
  Tax: "bg-blue-100 text-blue-700",
  Savings: "bg-emerald-100 text-emerald-700",
  Banking: "bg-slate-100 text-slate-700",
  Guide: "bg-purple-100 text-purple-700",
  Reference: "bg-amber-100 text-amber-700",
};

export default function LearnPage() {
  return (
    <Layout breadcrumbs={[{ label: "Learn" }]}>
      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-slate-900 mb-3">
            Learn About South African Finance
          </h1>
          <p className="text-slate-600 text-lg max-w-2xl">
            Plain English guides to SA tax, banking, and personal finance. No jargon, just clarity.
          </p>
        </div>

        {/* Category chips */}
        <div className="flex flex-wrap gap-2 mb-10">
          {CATEGORIES.map((cat) => (
            <span
              key={cat}
              className={`px-3 py-1.5 rounded-full text-sm font-medium cursor-default ${
                cat === "All"
                  ? "bg-slate-900 text-white"
                  : (CATEGORY_COLORS[cat] ?? "bg-slate-100 text-slate-600")
              }`}
            >
              {cat}
            </span>
          ))}
        </div>

        {/* Guide cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {GUIDES.map((guide) => (
            <Link
              key={guide.slug}
              href={`/learn/${guide.slug}`}
              className="group block bg-white border border-slate-200 rounded-2xl p-6 hover:border-blue-300 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center justify-between mb-3">
                <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${CATEGORY_COLORS[guide.category] ?? "bg-slate-100 text-slate-600"}`}>
                  <BookOpen size={11} /> {guide.category}
                </span>
                <span className="flex items-center gap-1 text-xs text-slate-400">
                  <Clock size={11} /> {guide.readTime}
                </span>
              </div>

              <h2 className="font-bold text-slate-900 text-lg mb-2 leading-snug group-hover:text-blue-700 transition-colors">
                {guide.title}
              </h2>

              <p className="text-slate-500 text-sm leading-relaxed mb-4">{guide.excerpt}</p>

              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-1">
                  {guide.relatedCalcs.map((calc) => (
                    <span key={calc.href} className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
                      {calc.label}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-1 text-blue-600 text-sm font-medium shrink-0 ml-2">
                  Read <ArrowRight size={14} />
                </div>
              </div>

              <p className="text-xs text-slate-400 mt-3">Updated {guide.lastUpdated}</p>
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  );
}

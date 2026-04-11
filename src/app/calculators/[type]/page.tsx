import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Layout } from "@/components/layout/Layout";
import Link from "next/link";
import { ArrowRight, Calculator } from "lucide-react";
import CalculatorRenderer from "@/components/calculators/CalculatorRenderer";

interface CalculatorConfig {
  title: string;
  description: string;
  category: string;
  relatedSlugs: string[];
}

const CALCULATOR_MAP: Record<string, CalculatorConfig> = {
  paye: {
    title: "PAYE Tax Calculator",
    description: "Calculate your monthly take-home pay based on your gross salary. Uses the latest SARS tax tables including rebates and medical credits.",
    category: "Tax",
    relatedSlugs: ["net-to-gross", "savings", "tfsa"],
  },
  loan: {
    title: "Loan Repayment Calculator",
    description: "Calculate monthly repayments, total interest, and the full cost of any personal or vehicle loan.",
    category: "Loans",
    relatedSlugs: ["bond", "debt", "paye"],
  },
  bond: {
    title: "Bond / Home Loan Calculator",
    description: "Calculate bond repayments, transfer duty, bond registration costs, and affordability for SA property purchases.",
    category: "Loans",
    relatedSlugs: ["loan", "paye", "savings"],
  },
  savings: {
    title: "Savings Growth Calculator",
    description: "Project how your savings grow over time with compound interest. Compare different rates and deposit frequencies.",
    category: "Savings",
    relatedSlugs: ["tfsa", "interest", "paye"],
  },
  tfsa: {
    title: "TFSA Tracker",
    description: "Track your Tax-Free Savings Account contributions against the annual (R46,000) and lifetime (R500,000) limits. Updated for 2026.",
    category: "Savings",
    relatedSlugs: ["savings", "interest", "paye"],
  },
  interest: {
    title: "Interest Calculator",
    description: "Calculate simple and compound interest. Understand the difference between nominal and effective annual rates.",
    category: "Savings",
    relatedSlugs: ["savings", "tfsa", "loan"],
  },
  debt: {
    title: "Debt Snowball / Avalanche Calculator",
    description: "Plan your debt payoff strategy using the snowball (smallest balance first) or avalanche (highest rate first) method.",
    category: "Debt",
    relatedSlugs: ["loan", "paye", "savings"],
  },
  "net-to-gross": {
    title: "Salary Net-to-Gross Calculator",
    description: "Work backwards from a desired take-home pay to find the gross salary you need to negotiate with your employer.",
    category: "Tax",
    relatedSlugs: ["paye", "savings", "tfsa"],
  },
};

const CATEGORY_COLORS: Record<string, string> = {
  Tax: "bg-blue-100 text-blue-700",
  Loans: "bg-purple-100 text-purple-700",
  Savings: "bg-emerald-100 text-emerald-700",
  Debt: "bg-orange-100 text-orange-700",
};

type Props = {
  params: Promise<{ type: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { type } = await params;
  const config = CALCULATOR_MAP[type];
  if (!config) {
    return { title: "Calculator Not Found – EveryRandSA" };
  }
  return {
    title: `${config.title} – EveryRandSA`,
    description: config.description,
  };
}

export function generateStaticParams() {
  return Object.keys(CALCULATOR_MAP).map((type) => ({ type }));
}

export default async function CalculatorPage({ params }: Props) {
  const { type } = await params;
  const config = CALCULATOR_MAP[type];

  if (!config) {
    notFound();
  }

  const { relatedSlugs } = config;
  const relatedCalculators = relatedSlugs
    .map((slug) => ({ slug, ...CALCULATOR_MAP[slug] }))
    .filter(Boolean);

  return (
    <Layout
      breadcrumbs={[
        { label: "Calculators", href: "/calculators" },
        { label: config.title },
      ]}
    >
      <div className="max-w-4xl mx-auto px-4 py-10">
        {/* Page header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${CATEGORY_COLORS[config.category]}`}>
              {config.category}
            </span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">{config.title}</h1>
          <p className="text-slate-600 text-lg">{config.description}</p>
        </div>

        {/* Calculator */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 md:p-8 mb-10">
          <CalculatorRenderer type={type} />
        </div>

        {/* Related Calculators */}
        {relatedCalculators.length > 0 && (
          <section aria-labelledby="related-heading">
            <h2 id="related-heading" className="text-xl font-bold text-slate-900 mb-4">
              Related Calculators
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {relatedCalculators.map(({ slug, title, description, category }) => (
                <Link
                  key={slug}
                  href={`/calculators/${slug}`}
                  className="group block bg-white border border-slate-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-sm transition-all"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center group-hover:bg-blue-700 group-hover:text-white transition-colors">
                      <Calculator size={15} />
                    </div>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${CATEGORY_COLORS[category]}`}>
                      {category}
                    </span>
                  </div>
                  <h3 className="font-semibold text-slate-900 text-sm mb-1 group-hover:text-blue-700 transition-colors">
                    {title}
                  </h3>
                  <p className="text-slate-500 text-xs leading-relaxed line-clamp-2">{description}</p>
                  <div className="flex items-center gap-1 mt-3 text-blue-600 text-xs font-medium">
                    Open <ArrowRight size={12} />
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </Layout>
  );
}

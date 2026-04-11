import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Layout } from "@/components/layout/Layout";
import Link from "next/link";
import { TrustBadge } from "@/components/common/TrustBadge";
import { DisclaimerBanner } from "@/components/common/DisclaimerBanner";
import { ExternalLink, ArrowRight, Shield, CheckCircle } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface RateTierDisplay {
  minBalance: number;
  maxBalance: number | null;
  rate: number;
  isPromotional?: boolean;
}

interface FeeDisplay {
  type: string;
  amount: number;
  description: string;
  isMonthly?: boolean;
}

interface ProductDetail {
  id: string;
  institutionName: string;
  productName: string;
  productType: string;
  category: "savings" | "loan";
  taxStatus: "TFSA" | "taxable" | "exempt";
  accessType: string;
  rateType: string;
  rateTiers: RateTierDisplay[];
  fees: FeeDisplay[];
  minDeposit: number;
  eligibility: string[];
  howToApplyUrl: string;
  sourceUrl: string;
  lastCheckedDate: string;
  notes?: string;
  similarIds: string[];
}

// ─── Mock product database ────────────────────────────────────────────────────

const PRODUCTS: Record<string, ProductDetail> = {
  "absa-tfsa": {
    id: "absa-tfsa",
    institutionName: "ABSA",
    productName: "Tax Free Savings Account",
    productType: "TFSA",
    category: "savings",
    taxStatus: "TFSA",
    accessType: "INSTANT",
    rateType: "Variable",
    rateTiers: [
      { minBalance: 0, maxBalance: null, rate: 7.5 },
    ],
    fees: [
      { type: "Monthly fee", amount: 0, description: "No monthly account fee", isMonthly: true },
      { type: "Withdrawal fee", amount: 0, description: "No fee for withdrawals" },
    ],
    minDeposit: 100,
    eligibility: [
      "South African resident",
      "Valid South African ID or passport",
      "ABSA bank account (recommended)",
      "Age 18+",
    ],
    howToApplyUrl: "https://www.absa.co.za",
    sourceUrl: "https://www.absa.co.za/personal/savings-investments/tfsa/",
    lastCheckedDate: "2026-03-01",
    notes: "TFSA contributions count towards your annual (R46,000) and lifetime (R500,000) limits. Withdrawals do not restore contribution room.",
    similarIds: ["capitec-tfsa", "nedbank-tfsa", "fnb-savings-pocket"],
  },
  "capitec-tfsa": {
    id: "capitec-tfsa",
    institutionName: "Capitec",
    productName: "Tax Free Savings",
    productType: "TFSA",
    category: "savings",
    taxStatus: "TFSA",
    accessType: "INSTANT",
    rateType: "Variable (Promotional)",
    rateTiers: [
      { minBalance: 0, maxBalance: null, rate: 8.25, isPromotional: true },
    ],
    fees: [
      { type: "Monthly fee", amount: 0, description: "No monthly fee", isMonthly: true },
    ],
    minDeposit: 0,
    eligibility: [
      "South African ID holder",
      "Age 16+ (minors with guardian consent)",
      "Capitec account not required to apply",
    ],
    howToApplyUrl: "https://www.capitecbank.co.za",
    sourceUrl: "https://www.capitecbank.co.za/personal-banking/save/tax-free-savings-account/",
    lastCheckedDate: "2026-03-01",
    notes: "Current rate is promotional. Revert rate may be lower. Always confirm the post-promotional rate before opening.",
    similarIds: ["absa-tfsa", "nedbank-tfsa", "tymebank-goalset"],
  },
  "tymebank-goalset": {
    id: "tymebank-goalset",
    institutionName: "TymeBank",
    productName: "GoalSave",
    productType: "SAVINGS_ACCOUNT",
    category: "savings",
    taxStatus: "taxable",
    accessType: "NOTICE_90_DAYS",
    rateType: "Variable",
    rateTiers: [
      { minBalance: 0, maxBalance: null, rate: 10.0 },
    ],
    fees: [
      { type: "Monthly fee", amount: 0, description: "No monthly fee", isMonthly: true },
      { type: "Withdrawal fee", amount: 0, description: "No fee after notice period" },
    ],
    minDeposit: 0,
    eligibility: [
      "South African resident",
      "TymeBank account required",
      "Valid South African ID",
    ],
    howToApplyUrl: "https://www.tymebank.co.za",
    sourceUrl: "https://www.tymebank.co.za/personal/save/goalsave/",
    lastCheckedDate: "2026-03-01",
    notes: "Highest rate requires 90-day notice before withdrawal. Ideal for medium-term savings goals.",
    similarIds: ["african-bank-32day", "fnb-60day-notice", "capitec-tfsa"],
  },
  "investec-prime-saver": {
    id: "investec-prime-saver",
    institutionName: "Investec",
    productName: "Prime Saver",
    productType: "SAVINGS_ACCOUNT",
    category: "savings",
    taxStatus: "taxable",
    accessType: "INSTANT",
    rateType: "Prime-Linked",
    rateTiers: [
      { minBalance: 100000, maxBalance: null, rate: 9.75 },
    ],
    fees: [
      { type: "Monthly account fee", amount: 95, description: "Monthly service fee", isMonthly: true },
    ],
    minDeposit: 100000,
    eligibility: [
      "Minimum balance R100,000",
      "Investec Private Client or Corporate account",
      "South African resident or qualifying non-resident",
    ],
    howToApplyUrl: "https://www.investec.com",
    sourceUrl: "https://www.investec.com/en_za/banking/private-client/savings.html",
    lastCheckedDate: "2026-03-01",
    notes: "Rate linked to prime. High minimum balance. Monthly fee significantly impacts net yield at lower balance levels.",
    similarIds: ["fnb-60day-notice", "absa-tfsa", "african-bank-32day"],
  },
  "african-bank-32day": {
    id: "african-bank-32day",
    institutionName: "African Bank",
    productName: "32-Day Notice",
    productType: "NOTICE_DEPOSIT",
    category: "savings",
    taxStatus: "taxable",
    accessType: "NOTICE_32_DAYS",
    rateType: "Fixed",
    rateTiers: [
      { minBalance: 1000, maxBalance: null, rate: 9.5 },
    ],
    fees: [
      { type: "Monthly fee", amount: 0, description: "No monthly fee", isMonthly: true },
    ],
    minDeposit: 1000,
    eligibility: [
      "South African ID or valid passport",
      "Minimum deposit R1,000",
    ],
    howToApplyUrl: "https://www.africanbank.co.za",
    sourceUrl: "https://www.africanbank.co.za/en/home/investments/notice-deposits/",
    lastCheckedDate: "2026-03-01",
    notes: "Competitive fixed rate with 32-day notice. No monthly fees. Good for emergency fund held with a buffer.",
    similarIds: ["tymebank-goalset", "fnb-60day-notice", "capitec-tfsa"],
  },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function accessLabel(accessType: string): string {
  const map: Record<string, string> = {
    INSTANT: "Instant Access",
    NOTICE_32_DAYS: "32-Day Notice",
    NOTICE_60_DAYS: "60-Day Notice",
    NOTICE_90_DAYS: "90-Day Notice",
    FIXED_TERM: "Fixed Term",
    ON_DEMAND: "On Demand",
  };
  return map[accessType] ?? accessType;
}

function bankColor(name: string): string {
  const colors: Record<string, string> = {
    ABSA: "bg-red-600",
    FNB: "bg-orange-600",
    Nedbank: "bg-green-700",
    Standard: "bg-blue-700",
    Capitec: "bg-purple-700",
    Investec: "bg-slate-800",
    Discovery: "bg-pink-600",
    TymeBank: "bg-teal-600",
    African: "bg-amber-700",
  };
  for (const key of Object.keys(colors)) {
    if (name.toLowerCase().includes(key.toLowerCase())) return colors[key];
  }
  return "bg-blue-700";
}

function getInitials(name: string): string {
  return name.split(" ").map((w) => w[0]).join("").slice(0, 3).toUpperCase();
}

// ─── generateStaticParams / generateMetadata ─────────────────────────────────

export function generateStaticParams() {
  return Object.keys(PRODUCTS).map((id) => ({ id }));
}

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = PRODUCTS[id];
  if (!product) return { title: "Product Not Found – EveryRandSA" };
  return {
    title: `${product.institutionName} ${product.productName} – EveryRandSA`,
    description: `Full details for ${product.institutionName} ${product.productName}: rates, fees, eligibility, and tax treatment.`,
  };
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params;
  const product = PRODUCTS[id];

  if (!product) {
    notFound();
  }

  const bestRate = Math.max(...product.rateTiers.map((t) => t.rate));
  const isPromo = product.rateTiers.some((t) => t.isPromotional);
  const lastChecked = new Date(product.lastCheckedDate).toLocaleDateString("en-ZA", {
    day: "numeric", month: "long", year: "numeric",
  });

  const similarProducts = product.similarIds
    .map((sid) => PRODUCTS[sid])
    .filter(Boolean);

  return (
    <Layout
      breadcrumbs={[
        { label: "Compare", href: "/compare/savings" },
        { label: "Savings Accounts", href: "/compare/savings" },
        { label: `${product.institutionName} ${product.productName}` },
      ]}
    >
      <DisclaimerBanner />

      <div className="max-w-5xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="flex items-start gap-5 mb-8">
          <div className={`w-16 h-16 rounded-2xl ${bankColor(product.institutionName)} flex items-center justify-center shrink-0`}>
            <span className="text-white font-bold text-lg">{getInitials(product.institutionName)}</span>
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                product.taxStatus === "TFSA" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"
              }`}>
                {product.taxStatus === "TFSA" ? "TFSA Eligible" : product.productType.replace(/_/g, " ")}
              </span>
              {isPromo && (
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-100 text-amber-700">
                  Promotional Rate
                </span>
              )}
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
              {product.institutionName} {product.productName}
            </h1>
            <div className="flex items-center gap-3 mt-2">
              <TrustBadge compact />
              <span className="text-xs text-slate-400">Last verified {lastChecked}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          {/* Main details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Rate tiers */}
            <section className="bg-white border border-slate-200 rounded-2xl p-6">
              <h2 className="font-bold text-slate-900 text-lg mb-4">Interest Rate Tiers</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-2 text-slate-500 font-medium">Minimum Balance</th>
                      <th className="text-left py-2 text-slate-500 font-medium">Maximum Balance</th>
                      <th className="text-right py-2 text-slate-500 font-medium">Rate (p.a.)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {product.rateTiers.map((tier, i) => (
                      <tr key={i} className="border-b border-slate-100 last:border-0">
                        <td className="py-2.5 text-slate-700">
                          R {tier.minBalance.toLocaleString("en-ZA")}
                        </td>
                        <td className="py-2.5 text-slate-700">
                          {tier.maxBalance == null ? "No maximum" : `R ${tier.maxBalance.toLocaleString("en-ZA")}`}
                        </td>
                        <td className="py-2.5 text-right">
                          <span className={`font-bold ${tier.isPromotional ? "text-amber-600" : "text-blue-700"}`}>
                            {tier.rate.toFixed(2)}%
                          </span>
                          {tier.isPromotional && (
                            <span className="ml-1 text-xs text-amber-500">(promo)</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {isPromo && (
                <p className="text-xs text-amber-600 mt-3 flex items-start gap-1">
                  <Shield className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  Promotional rates are time-limited. Confirm the current rate and revert rate directly with {product.institutionName} before opening.
                </p>
              )}
            </section>

            {/* Fees */}
            <section className="bg-white border border-slate-200 rounded-2xl p-6">
              <h2 className="font-bold text-slate-900 text-lg mb-4">Fees</h2>
              <div className="space-y-3">
                {product.fees.map((fee, i) => (
                  <div key={i} className="flex items-start justify-between gap-4 pb-3 border-b border-slate-100 last:border-0 last:pb-0">
                    <div>
                      <p className="text-sm font-medium text-slate-800">{fee.type}</p>
                      <p className="text-xs text-slate-500">{fee.description}</p>
                    </div>
                    <span className={`text-sm font-semibold shrink-0 ${fee.amount === 0 ? "text-emerald-600" : "text-slate-900"}`}>
                      {fee.amount === 0 ? "Free" : `R ${fee.amount.toLocaleString("en-ZA")}${fee.isMonthly ? "/month" : ""}`}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* Eligibility */}
            <section className="bg-white border border-slate-200 rounded-2xl p-6">
              <h2 className="font-bold text-slate-900 text-lg mb-4">Eligibility Requirements</h2>
              <ul className="space-y-2">
                {product.eligibility.map((req, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    {req}
                  </li>
                ))}
              </ul>
            </section>

            {product.notes && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <p className="text-sm text-amber-800">
                  <strong>Note: </strong>{product.notes}
                </p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Rate summary */}
            <div className={`rounded-2xl p-6 text-center ${isPromo ? "bg-amber-50 border border-amber-200" : "bg-blue-50 border border-blue-200"}`}>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">{product.rateType} Rate</p>
              <p className={`text-5xl font-extrabold mb-1 ${isPromo ? "text-amber-600" : "text-blue-700"}`}>
                {bestRate.toFixed(2)}%
              </p>
              <p className="text-sm text-slate-500">per annum</p>
              <div className="mt-4 space-y-2 text-sm text-left">
                <div className="flex justify-between">
                  <span className="text-slate-500">Access</span>
                  <span className="font-medium text-slate-900">{accessLabel(product.accessType)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Min deposit</span>
                  <span className="font-medium text-slate-900">
                    {product.minDeposit === 0 ? "None" : `R ${product.minDeposit.toLocaleString("en-ZA")}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Tax treatment</span>
                  <span className={`font-semibold ${product.taxStatus === "TFSA" ? "text-emerald-600" : "text-slate-900"}`}>
                    {product.taxStatus === "TFSA" ? "Tax-Free" : "Taxable"}
                  </span>
                </div>
              </div>
            </div>

            {/* Apply button */}
            <a
              href={product.howToApplyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full bg-blue-700 text-white font-bold py-3 rounded-xl hover:bg-blue-800 transition-colors"
            >
              Apply at {product.institutionName} <ExternalLink size={15} />
            </a>

            <a
              href={product.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1 text-xs text-slate-500 hover:text-slate-700"
            >
              View source page <ExternalLink size={11} />
            </a>

            {/* Calculator CTA */}
            <Link
              href={product.category === "savings" ? "/calculators/savings" : "/calculators/loan"}
              className="flex items-center justify-center gap-2 w-full border border-blue-300 text-blue-700 font-semibold py-3 rounded-xl hover:bg-blue-50 transition-colors text-sm"
            >
              Calculate returns <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {/* Similar products */}
        {similarProducts.length > 0 && (
          <section aria-labelledby="similar-heading">
            <h2 id="similar-heading" className="text-xl font-bold text-slate-900 mb-4">
              Similar Products
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {similarProducts.map((similar) => {
                const simRate = Math.max(...similar.rateTiers.map((t) => t.rate));
                return (
                  <Link
                    key={similar.id}
                    href={`/products/${similar.id}`}
                    className="group block bg-white border border-slate-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-sm transition-all"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-10 h-10 rounded-xl ${bankColor(similar.institutionName)} flex items-center justify-center`}>
                        <span className="text-white font-bold text-xs">{getInitials(similar.institutionName)}</span>
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 text-sm group-hover:text-blue-700 transition-colors">
                          {similar.institutionName}
                        </p>
                        <p className="text-xs text-slate-500">{similar.productName}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-blue-700">{simRate.toFixed(2)}%</span>
                      {similar.taxStatus === "TFSA" && (
                        <span className="text-xs font-semibold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
                          TFSA
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-1">{accessLabel(similar.accessType)}</p>
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </Layout>
  );
}

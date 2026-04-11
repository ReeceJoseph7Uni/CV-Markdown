'use client';

import { useState, useMemo } from "react";
import { Layout } from "@/components/layout/Layout";
import SortDropdown from "@/components/comparison/SortDropdown";
import { DisclaimerBanner } from "@/components/common/DisclaimerBanner";
import { TrustBadge } from "@/components/common/TrustBadge";
import { CreditCard, ArrowRight, Info } from "lucide-react";
import Link from "next/link";

// ─── Types ────────────────────────────────────────────────────────────────────

interface LoanProduct {
  id: string;
  institutionName: string;
  productName: string;
  loanType: "personal" | "vehicle" | "home";
  minRate: number;
  maxRate: number;
  initiationFee: number;
  monthlyServiceFee: number;
  minAmount: number;
  maxAmount: number;
  minTermMonths: number;
  maxTermMonths: number;
  rateType: "fixed" | "variable" | "prime-linked";
  lastCheckedDate: string;
}

// ─── Monthly repayment helper ─────────────────────────────────────────────────

function calcMonthlyRepayment(principal: number, annualRate: number, months: number): number {
  if (annualRate === 0) return principal / months;
  const r = annualRate / 100 / 12;
  return (principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
}

function totalCost(principal: number, annualRate: number, months: number, initiationFee: number, serviceFeePm: number): number {
  const monthly = calcMonthlyRepayment(principal, annualRate, months);
  return monthly * months + initiationFee + serviceFeePm * months;
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const LOAN_PRODUCTS: LoanProduct[] = [
  {
    id: "absa-personal",
    institutionName: "ABSA",
    productName: "Personal Loan",
    loanType: "personal",
    minRate: 16.5,
    maxRate: 29.25,
    initiationFee: 1207.5,
    monthlyServiceFee: 69,
    minAmount: 1000,
    maxAmount: 350000,
    minTermMonths: 12,
    maxTermMonths: 84,
    rateType: "variable",
    lastCheckedDate: "2026-03-01",
  },
  {
    id: "fnb-personal",
    institutionName: "FNB",
    productName: "Personal Loan",
    loanType: "personal",
    minRate: 15.75,
    maxRate: 27.5,
    initiationFee: 1150,
    monthlyServiceFee: 69,
    minAmount: 1000,
    maxAmount: 300000,
    minTermMonths: 12,
    maxTermMonths: 60,
    rateType: "variable",
    lastCheckedDate: "2026-03-01",
  },
  {
    id: "std-bank-personal",
    institutionName: "Standard Bank",
    productName: "Personal Loan",
    loanType: "personal",
    minRate: 17.0,
    maxRate: 29.25,
    initiationFee: 1207.5,
    monthlyServiceFee: 69,
    minAmount: 500,
    maxAmount: 300000,
    minTermMonths: 12,
    maxTermMonths: 72,
    rateType: "variable",
    lastCheckedDate: "2026-03-01",
  },
  {
    id: "nedbank-personal",
    institutionName: "Nedbank",
    productName: "Personal Loan",
    loanType: "personal",
    minRate: 16.0,
    maxRate: 29.25,
    initiationFee: 1207.5,
    monthlyServiceFee: 69,
    minAmount: 2000,
    maxAmount: 350000,
    minTermMonths: 12,
    maxTermMonths: 72,
    rateType: "variable",
    lastCheckedDate: "2026-03-01",
  },
  {
    id: "capitec-personal",
    institutionName: "Capitec",
    productName: "Personal Loan",
    loanType: "personal",
    minRate: 12.9,
    maxRate: 29.25,
    initiationFee: 0,
    monthlyServiceFee: 50,
    minAmount: 1000,
    maxAmount: 250000,
    minTermMonths: 6,
    maxTermMonths: 84,
    rateType: "variable",
    lastCheckedDate: "2026-03-01",
  },
  {
    id: "african-bank-personal",
    institutionName: "African Bank",
    productName: "Personal Loan",
    loanType: "personal",
    minRate: 15.0,
    maxRate: 29.25,
    initiationFee: 1150,
    monthlyServiceFee: 69,
    minAmount: 500,
    maxAmount: 350000,
    minTermMonths: 12,
    maxTermMonths: 72,
    rateType: "fixed",
    lastCheckedDate: "2026-03-01",
  },
  {
    id: "discovery-personal",
    institutionName: "Discovery Bank",
    productName: "Personal Loan",
    loanType: "personal",
    minRate: 13.5,
    maxRate: 24.5,
    initiationFee: 1000,
    monthlyServiceFee: 59,
    minAmount: 5000,
    maxAmount: 500000,
    minTermMonths: 12,
    maxTermMonths: 84,
    rateType: "variable",
    lastCheckedDate: "2026-03-01",
  },
  {
    id: "tymebank-personal",
    institutionName: "TymeBank",
    productName: "MoreTyme Loan",
    loanType: "personal",
    minRate: 21.0,
    maxRate: 29.25,
    initiationFee: 0,
    monthlyServiceFee: 0,
    minAmount: 500,
    maxAmount: 10000,
    minTermMonths: 3,
    maxTermMonths: 6,
    rateType: "fixed",
    lastCheckedDate: "2026-03-01",
  },
];

// ─── Sort options ─────────────────────────────────────────────────────────────

const SORT_OPTIONS = [
  { value: "rate_asc", label: "Lowest Rate First" },
  { value: "monthly_asc", label: "Lowest Monthly Payment" },
  { value: "total_asc", label: "Lowest Total Cost" },
  { value: "rate_desc", label: "Highest Rate First" },
];

const LOAN_TYPE_OPTIONS = [
  { value: "all", label: "All Loan Types" },
  { value: "personal", label: "Personal Loan" },
  { value: "vehicle", label: "Vehicle Finance" },
];

const RATE_TYPE_OPTIONS = [
  { value: "all", label: "All Rate Types" },
  { value: "fixed", label: "Fixed Rate" },
  { value: "variable", label: "Variable Rate" },
  { value: "prime-linked", label: "Prime-Linked" },
];

// ─── Bank color helper ────────────────────────────────────────────────────────

function bankColor(name: string): string {
  const colors: Record<string, string> = {
    ABSA: "bg-red-600",
    FNB: "bg-orange-600",
    Nedbank: "bg-green-700",
    Standard: "bg-blue-700",
    Capitec: "bg-purple-700",
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

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CompareLoansPage() {
  const [sort, setSort] = useState("rate_asc");
  const [loanType, setLoanType] = useState("all");
  const [rateType, setRateType] = useState("all");
  const [exampleAmount] = useState(50000);
  const [exampleTermMonths] = useState(60);

  const filtered = useMemo(() => {
    let products = [...LOAN_PRODUCTS];

    if (loanType !== "all") {
      products = products.filter((p) => p.loanType === loanType);
    }
    if (rateType !== "all") {
      products = products.filter((p) => p.rateType === rateType);
    }

    products.sort((a, b) => {
      const aMonthly = calcMonthlyRepayment(exampleAmount, a.minRate, exampleTermMonths);
      const bMonthly = calcMonthlyRepayment(exampleAmount, b.minRate, exampleTermMonths);
      const aTotal = totalCost(exampleAmount, a.minRate, exampleTermMonths, a.initiationFee, a.monthlyServiceFee);
      const bTotal = totalCost(exampleAmount, b.minRate, exampleTermMonths, b.initiationFee, b.monthlyServiceFee);
      switch (sort) {
        case "rate_asc": return a.minRate - b.minRate;
        case "rate_desc": return b.minRate - a.minRate;
        case "monthly_asc": return aMonthly - bMonthly;
        case "total_asc": return aTotal - bTotal;
        default: return 0;
      }
    });

    return products;
  }, [sort, loanType, rateType, exampleAmount, exampleTermMonths]);

  return (
    <Layout breadcrumbs={[{ label: "Compare", href: "/compare/loans" }, { label: "Loans" }]}>
      <DisclaimerBanner />

      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
              <CreditCard size={22} />
            </div>
            <TrustBadge compact />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Compare Personal Loans</h1>
          <p className="text-slate-600 max-w-xl">
            Compare personal loan rates from major South African lenders. Repayments shown for R{exampleAmount.toLocaleString()} over {exampleTermMonths} months at minimum rate.
          </p>
        </div>

        {/* Example note */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
          <p className="text-sm text-blue-800">
            Monthly repayments shown are indicative for <strong>R{exampleAmount.toLocaleString()}</strong> over <strong>{exampleTermMonths} months</strong> at the advertised minimum rate. Actual rates depend on your credit profile. Maximum rate is 29.25% (NCR cap).
          </p>
        </div>

        {/* Filters row */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <div className="flex gap-2">
            {LOAN_TYPE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setLoanType(opt.value)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  loanType === opt.value
                    ? "bg-blue-700 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            {RATE_TYPE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setRateType(opt.value)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  rateType === opt.value
                    ? "bg-purple-700 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <div className="ml-auto">
            <SortDropdown sortOptions={SORT_OPTIONS} currentSort={sort} onSortChange={setSort} />
          </div>
        </div>

        <p className="text-sm text-slate-500 mb-5">
          Showing <strong>{filtered.length}</strong> loan products
        </p>

        {/* Products */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((product) => {
            const monthly = calcMonthlyRepayment(exampleAmount, product.minRate, exampleTermMonths);
            const total = totalCost(exampleAmount, product.minRate, exampleTermMonths, product.initiationFee, product.monthlyServiceFee);
            const lastChecked = new Date(product.lastCheckedDate).toLocaleDateString("en-ZA", {
              day: "numeric", month: "short", year: "numeric",
            });

            return (
              <div key={product.id} className="bg-white border border-slate-200 rounded-2xl p-6 hover:border-blue-300 hover:shadow-md transition-all">
                {/* Header */}
                <div className="flex items-start gap-3 mb-4">
                  <div className={`w-12 h-12 rounded-xl ${bankColor(product.institutionName)} flex items-center justify-center shrink-0`}>
                    <span className="text-white font-bold text-sm">{getInitials(product.institutionName)}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{product.institutionName}</p>
                    <p className="text-sm text-slate-500">{product.productName}</p>
                  </div>
                  <span className={`ml-auto text-xs font-semibold px-2 py-1 rounded-full shrink-0 ${
                    product.rateType === "fixed"
                      ? "bg-blue-100 text-blue-700"
                      : product.rateType === "prime-linked"
                        ? "bg-purple-100 text-purple-700"
                        : "bg-slate-100 text-slate-600"
                  }`}>
                    {product.rateType === "prime-linked" ? "Prime-linked" : product.rateType.charAt(0).toUpperCase() + product.rateType.slice(1)}
                  </span>
                </div>

                {/* Rate */}
                <div className="text-center bg-slate-50 rounded-xl py-3 mb-4">
                  <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Interest Rate</p>
                  <p className="text-3xl font-bold text-blue-700">{product.minRate.toFixed(2)}%</p>
                  <p className="text-xs text-slate-400">to {product.maxRate.toFixed(2)}% p.a.</p>
                </div>

                {/* Details */}
                <dl className="space-y-2 text-sm mb-4">
                  {[
                    { label: "Monthly repayment", value: `R ${monthly.toFixed(2)}` },
                    { label: "Total cost of loan", value: `R ${total.toLocaleString("en-ZA", { maximumFractionDigits: 0 })}` },
                    { label: "Initiation fee", value: product.initiationFee === 0 ? "None" : `R ${product.initiationFee.toLocaleString("en-ZA")}` },
                    { label: "Monthly service fee", value: product.monthlyServiceFee === 0 ? "None" : `R ${product.monthlyServiceFee}` },
                    { label: "Max loan amount", value: `R ${product.maxAmount.toLocaleString("en-ZA")}` },
                    { label: "Max term", value: `${product.maxTermMonths} months` },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between">
                      <dt className="text-slate-500">{label}</dt>
                      <dd className="font-medium text-slate-900">{value}</dd>
                    </div>
                  ))}
                </dl>

                <Link
                  href="/calculators/loan"
                  className="flex items-center justify-center gap-2 w-full bg-blue-700 text-white font-semibold py-2.5 rounded-lg hover:bg-blue-800 transition-colors text-sm"
                >
                  Calculate repayments <ArrowRight size={14} />
                </Link>

                <p className="text-center text-xs text-slate-400 mt-3">Updated {lastChecked}</p>
              </div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
}

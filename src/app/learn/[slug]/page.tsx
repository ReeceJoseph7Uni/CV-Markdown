import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Layout } from "@/components/layout/Layout";
import Link from "next/link";
import { ShareButton } from "@/components/common/ShareButton";
import { TrustBadge } from "@/components/common/TrustBadge";
import { BookOpen, Clock, ArrowRight, ExternalLink } from "lucide-react";

// ─── Article data ──────────────────────────────────────────────────────────────

interface Article {
  slug: string;
  title: string;
  category: string;
  readTime: string;
  lastUpdated: string;
  source: { label: string; url: string };
  relatedCalcs: { href: string; label: string }[];
  headings: string[];
  content: React.ReactNode;
}

const PAYE_CONTENT = (
  <div className="prose prose-slate max-w-none">
    <h2 id="what-is-paye">What is PAYE?</h2>
    <p>
      Pay-As-You-Earn (PAYE) is South Africa&apos;s system for collecting income tax from employees. Your employer deducts the tax from your salary each month and pays it to SARS on your behalf. This means you pay tax incrementally throughout the year rather than in one lump sum.
    </p>
    <p>
      PAYE is governed by the Income Tax Act and administered by the South African Revenue Service (SARS). Your employer is legally required to register as an employer with SARS and to withhold the correct amount of PAYE from your remuneration.
    </p>

    <h2 id="tax-brackets">Tax Brackets for 2025/26</h2>
    <p>South Africa uses a progressive tax system. The more you earn, the higher the marginal rate on each additional rand:</p>
    <table>
      <thead>
        <tr><th>Taxable Income (R)</th><th>Rate</th></tr>
      </thead>
      <tbody>
        <tr><td>1 – 237,100</td><td>18%</td></tr>
        <tr><td>237,101 – 370,500</td><td>26%</td></tr>
        <tr><td>370,501 – 512,800</td><td>31%</td></tr>
        <tr><td>512,801 – 673,000</td><td>36%</td></tr>
        <tr><td>673,001 – 857,900</td><td>39%</td></tr>
        <tr><td>857,901 – 1,817,000</td><td>41%</td></tr>
        <tr><td>1,817,001 and above</td><td>45%</td></tr>
      </tbody>
    </table>

    <h2 id="rebates">Tax Rebates</h2>
    <p>
      Before paying tax, South African residents are entitled to rebates that reduce their tax liability. Rebates are not deductions from income — they are direct reductions from the tax amount:
    </p>
    <ul>
      <li><strong>Primary rebate:</strong> R17,235 (available to all taxpayers)</li>
      <li><strong>Secondary rebate:</strong> R9,444 (for taxpayers aged 65 and over)</li>
      <li><strong>Tertiary rebate:</strong> R3,145 (for taxpayers aged 75 and over)</li>
    </ul>
    <p>
      The primary rebate effectively means taxpayers earning under R95,750 per year pay no income tax.
    </p>

    <h2 id="medical-credits">Medical Aid Tax Credits</h2>
    <p>
      If you contribute to a registered medical aid scheme, you receive a tax credit (not a deduction) that reduces your PAYE:
    </p>
    <ul>
      <li><strong>Main member:</strong> R364 per month</li>
      <li><strong>First dependant:</strong> R364 per month</li>
      <li><strong>Each additional dependant:</strong> R246 per month</li>
    </ul>

    <h2 id="calculation-example">Worked Example</h2>
    <p>
      Let&apos;s calculate the monthly PAYE for someone earning <strong>R45,000 gross per month</strong> (R540,000 p.a.) with a medical aid for themselves and one dependant:
    </p>
    <ol>
      <li>Annual gross income: <strong>R540,000</strong></li>
      <li>Tax on R540,000 using brackets: R512,800 × 36% bracket = R155,505 + R27,200 × 36% = R165,297 (approximate)</li>
      <li>Less primary rebate: −R17,235</li>
      <li>Less medical credits: −(R364 + R364) × 12 = −R8,736</li>
      <li>Annual tax payable: ≈ R139,326</li>
      <li>Monthly PAYE deduction: ≈ <strong>R11,610</strong></li>
    </ol>
    <p>
      Use the <Link href="/calculators/paye">PAYE Calculator</Link> to get an exact figure for your salary.
    </p>

    <h2 id="uif-and-other">UIF and Other Deductions</h2>
    <p>
      Beyond PAYE, your payslip may also show:
    </p>
    <ul>
      <li><strong>UIF (Unemployment Insurance Fund):</strong> 1% of gross salary (up to the UIF ceiling), matched by your employer.</li>
      <li><strong>Pension/Provident Fund:</strong> Contributions are tax-deductible up to 27.5% of the greater of remuneration or taxable income, capped at R350,000 per year.</li>
      <li><strong>Medical Aid:</strong> Member contributions (the portion not covered by the employer) reduce your taxable income in some cases.</li>
    </ul>

    <h2 id="tax-year">The SA Tax Year</h2>
    <p>
      South Africa&apos;s tax year runs from <strong>1 March to 28/29 February</strong>. Your employer calculates PAYE on a monthly basis using cumulative income for the year to date, adjusting for any over- or under-deductions.
    </p>
    <p>
      At year-end, SARS reconciles your actual tax liability through the annual income tax return (ITR12), refunding any overpayment or collecting any shortfall.
    </p>
  </div>
);

const ARTICLES: Record<string, Article> = {
  "how-paye-works": {
    slug: "how-paye-works",
    title: "How PAYE Works in South Africa",
    category: "Tax",
    readTime: "5 min read",
    lastUpdated: "March 2026",
    source: { label: "SARS Budget 2025/26", url: "https://www.sars.gov.za/tax-rates/income-tax/rates-of-tax-for-individuals/" },
    relatedCalcs: [
      { href: "/calculators/paye", label: "PAYE Calculator" },
      { href: "/calculators/net-to-gross", label: "Net-to-Gross Calculator" },
    ],
    headings: ["What is PAYE?", "Tax Brackets for 2025/26", "Tax Rebates", "Medical Aid Tax Credits", "Worked Example", "UIF and Other Deductions", "The SA Tax Year"],
    content: PAYE_CONTENT,
  },
  "understanding-tfsa": {
    slug: "understanding-tfsa",
    title: "Understanding Tax-Free Savings Accounts",
    category: "Savings",
    readTime: "4 min read",
    lastUpdated: "March 2026",
    source: { label: "National Treasury TFSA", url: "https://www.treasury.gov.za" },
    relatedCalcs: [
      { href: "/calculators/tfsa", label: "TFSA Tracker" },
      { href: "/calculators/savings", label: "Savings Growth" },
    ],
    headings: ["What is a TFSA?", "Annual & Lifetime Limits", "Eligible Products", "Tax Benefits", "TFSA vs Regular Savings"],
    content: (
      <div className="prose prose-slate max-w-none">
        <h2 id="what-is-a-tfsa">What is a TFSA?</h2>
        <p>
          A Tax-Free Savings Account (TFSA) is a savings vehicle introduced by the South African government in 2015. All investment returns — interest, dividends, and capital gains — earned within a TFSA are completely exempt from tax.
        </p>

        <h2 id="annual-lifetime-limits">Annual &amp; Lifetime Limits</h2>
        <p>From 1 March 2026:</p>
        <ul>
          <li><strong>Annual contribution limit:</strong> R46,000</li>
          <li><strong>Lifetime contribution limit:</strong> R500,000</li>
        </ul>
        <p>
          Exceeding the annual or lifetime limit results in a <strong>40% tax penalty</strong> on the excess contribution. Withdrawals do not restore your contribution room.
        </p>

        <h2 id="eligible-products">Eligible Products</h2>
        <p>TFSA-eligible products include:</p>
        <ul>
          <li>Bank savings accounts and notice deposits</li>
          <li>Unit trusts (retail investor funds)</li>
          <li>Exchange-traded funds (ETFs)</li>
          <li>Endowment policies</li>
          <li>Linked investment service provider (LISP) products</li>
        </ul>

        <h2 id="tax-benefits">Tax Benefits</h2>
        <p>
          In a regular savings account, interest earned is taxable above the annual exemption (R23,800 for under-65s, R34,500 for over-65s). In a TFSA, <em>all</em> growth is tax-free, making it especially powerful for long-term savings.
        </p>

        <h2 id="tfsa-vs-regular">TFSA vs Regular Savings</h2>
        <p>
          For a R46,000 deposit earning 8% p.a. over 20 years, the difference in after-tax returns between a TFSA and a taxable account can be substantial — often 15–25% more after-tax wealth. Use the <Link href="/calculators/savings">Savings Growth Calculator</Link> to model your scenario.
        </p>
      </div>
    ),
  },
  "how-notice-accounts-work": {
    slug: "how-notice-accounts-work",
    title: "How Notice Accounts Work",
    category: "Banking",
    readTime: "3 min read",
    lastUpdated: "February 2026",
    source: { label: "SARB Banking Supervision", url: "https://www.sarb.co.za" },
    relatedCalcs: [
      { href: "/compare/savings", label: "Compare Savings" },
    ],
    headings: ["What is a Notice Deposit?", "Common Notice Periods", "Rate vs Liquidity", "Who Should Use a Notice Account?"],
    content: (
      <div className="prose prose-slate max-w-none">
        <h2 id="what-is-a-notice-deposit">What is a Notice Deposit?</h2>
        <p>
          A notice deposit requires you to give your bank advance notice before making a withdrawal. In exchange for this reduced liquidity, the bank pays a higher interest rate than an instant-access savings account.
        </p>

        <h2 id="common-notice-periods">Common Notice Periods</h2>
        <ul>
          <li><strong>32-day notice:</strong> Most common. One month&apos;s notice before withdrawal.</li>
          <li><strong>60-day notice:</strong> Two months&apos; notice. Higher rate.</li>
          <li><strong>90-day notice:</strong> Three months&apos; notice. Highest notice-account rate.</li>
        </ul>

        <h2 id="rate-vs-liquidity">Rate vs Liquidity Trade-off</h2>
        <p>
          Notice accounts typically pay 1–2% more than instant-access savings accounts. The catch: you cannot access your money immediately in an emergency. Some banks charge a penalty if you withdraw early.
        </p>

        <h2 id="who-should-use">Who Should Use a Notice Account?</h2>
        <p>
          Notice accounts are ideal if you have savings that you won&apos;t need urgently — for example, a car replacement fund or annual travel savings. Compare available products on our <Link href="/compare/savings">Savings Comparison</Link> page.
        </p>
      </div>
    ),
  },
  "comparing-bank-products": {
    slug: "comparing-bank-products",
    title: "How to Compare Bank Products",
    category: "Guide",
    readTime: "6 min read",
    lastUpdated: "February 2026",
    source: { label: "NCR Consumer Education", url: "https://www.ncr.org.za" },
    relatedCalcs: [
      { href: "/compare/savings", label: "Compare Savings" },
      { href: "/compare/loans", label: "Compare Loans" },
    ],
    headings: ["Look Beyond the Headline Rate", "Effective Yield Explained", "Total Cost of Credit", "Fees Matter", "The Right Questions to Ask"],
    content: (
      <div className="prose prose-slate max-w-none">
        <h2 id="headline-rate">Look Beyond the Headline Rate</h2>
        <p>
          Banks advertise their best rates. The rate you receive depends on your balance tier, credit profile, and whether a promotional rate applies. Always check the effective annual rate (EAR) and fee schedule.
        </p>

        <h2 id="effective-yield">Effective Yield Explained</h2>
        <p>
          The effective annual yield accounts for compounding frequency and fees. A 9% nominal rate compounded monthly is equivalent to a ~9.38% effective annual rate. When comparing products, use effective yield — not nominal rate — to make a fair comparison.
        </p>

        <h2 id="total-cost">Total Cost of Credit</h2>
        <p>
          For loans, the Total Cost of Credit (TCC) includes the principal, interest, initiation fee, monthly service fee, and insurance. The National Credit Act (NCA) requires lenders to disclose the TCC before you sign. Always compare TCC rather than just the monthly repayment.
        </p>

        <h2 id="fees-matter">Fees Matter</h2>
        <p>
          A savings account with a R95/month fee earning 9.5% may be less profitable than a fee-free account earning 7.5%, depending on your balance. Use the <Link href="/calculators/savings">Savings Growth Calculator</Link> to model the after-fee return.
        </p>

        <h2 id="right-questions">The Right Questions to Ask</h2>
        <ul>
          <li>Is the rate fixed or variable? If variable, when was it last changed?</li>
          <li>Is this a promotional rate? When does it revert?</li>
          <li>What are all the fees (initiation, monthly, withdrawal)?</li>
          <li>What is the minimum balance to earn the advertised rate?</li>
          <li>Is this product TFSA-eligible?</li>
        </ul>
      </div>
    ),
  },
  "interest-rate-types-explained": {
    slug: "interest-rate-types-explained",
    title: "Interest Rate Types Explained",
    category: "Banking",
    readTime: "5 min read",
    lastUpdated: "January 2026",
    source: { label: "SARB Monetary Policy", url: "https://www.sarb.co.za" },
    relatedCalcs: [
      { href: "/calculators/interest", label: "Interest Calculator" },
      { href: "/calculators/loan", label: "Loan Calculator" },
    ],
    headings: ["Fixed vs Variable", "Nominal vs Effective Rate", "Prime Rate", "Repo Rate", "Compound Frequency"],
    content: (
      <div className="prose prose-slate max-w-none">
        <h2 id="fixed-variable">Fixed vs Variable Rates</h2>
        <p>
          A <strong>fixed rate</strong> stays constant for the agreed term regardless of market changes. A <strong>variable rate</strong> can change, usually tracking the prime lending rate. Fixed rates provide certainty; variable rates can go up or down.
        </p>

        <h2 id="nominal-effective">Nominal vs Effective Rate</h2>
        <p>
          The <strong>nominal rate</strong> is the stated annual rate before accounting for compounding. The <strong>effective annual rate (EAR)</strong> reflects the true annual return after compounding. For monthly compounding: EAR = (1 + nominal/12)^12 − 1.
        </p>

        <h2 id="prime-rate">Prime Rate</h2>
        <p>
          The South African prime lending rate is currently <strong>10.25%</strong>. It is set by commercial banks and is typically 3.5% above the SARB repo rate. Most home loans and many personal loans are priced as prime plus or minus a margin.
        </p>

        <h2 id="repo-rate">Repo Rate</h2>
        <p>
          The repurchase (repo) rate is the interest rate at which the SARB lends money to commercial banks. It is the primary monetary policy tool. When the repo rate rises, prime rises, and borrowing becomes more expensive.
        </p>

        <h2 id="compound-frequency">Compound Frequency</h2>
        <p>
          Interest may compound daily, monthly, quarterly, or annually. More frequent compounding means higher effective yield for savers and higher effective cost for borrowers. Use the <Link href="/calculators/interest">Interest Calculator</Link> to compare compounding frequencies.
        </p>
      </div>
    ),
  },
  "glossary": {
    slug: "glossary",
    title: "Glossary of South African Financial Terms",
    category: "Reference",
    readTime: "8 min read",
    lastUpdated: "March 2026",
    source: { label: "SARB & SARS", url: "https://www.sarb.co.za" },
    relatedCalcs: [
      { href: "/calculators", label: "All Calculators" },
    ],
    headings: ["A–C", "D–N", "P–R", "S–Z"],
    content: (
      <div className="prose prose-slate max-w-none">
        <h2 id="a-c">A–C</h2>
        <dl>
          <dt><strong>Compound Interest</strong></dt>
          <dd>Interest calculated on both the principal and the accumulated interest from previous periods.</dd>
          <dt><strong>Credit Bureau</strong></dt>
          <dd>An organisation (e.g., TransUnion, Experian) that collects and provides credit history information about consumers.</dd>
        </dl>

        <h2 id="d-n">D–N</h2>
        <dl>
          <dt><strong>Effective Annual Rate (EAR)</strong></dt>
          <dd>The actual annual interest rate, accounting for compounding within the year.</dd>
          <dt><strong>Initiation Fee</strong></dt>
          <dd>A once-off fee charged when a loan is granted. Capped by the NCA at R1,207.50 for credit agreements up to R15,000.</dd>
          <dt><strong>National Credit Act (NCA)</strong></dt>
          <dd>South African legislation that regulates credit providers, protects consumers, and sets caps on fees and interest rates.</dd>
          <dt><strong>NCR</strong></dt>
          <dd>National Credit Regulator — the body that enforces the NCA.</dd>
          <dt><strong>Nominal Rate</strong></dt>
          <dd>The stated annual interest rate before compounding is taken into account.</dd>
        </dl>

        <h2 id="p-r">P–R</h2>
        <dl>
          <dt><strong>PAYE</strong></dt>
          <dd>Pay-As-You-Earn. The system by which employers withhold income tax from employees&apos; salaries and remit it to SARS.</dd>
          <dt><strong>Prime Rate</strong></dt>
          <dd>The benchmark lending rate used by South African commercial banks, currently 10.25%. Most loans are priced relative to prime.</dd>
          <dt><strong>Repo Rate</strong></dt>
          <dd>The rate at which the SARB lends money to commercial banks. Currently 6.75%.</dd>
          <dt><strong>SARB</strong></dt>
          <dd>South African Reserve Bank — the central bank of South Africa.</dd>
          <dt><strong>SARS</strong></dt>
          <dd>South African Revenue Service — the tax collection authority.</dd>
        </dl>

        <h2 id="s-z">S–Z</h2>
        <dl>
          <dt><strong>TFSA</strong></dt>
          <dd>Tax-Free Savings Account. A savings account where all returns (interest, dividends, capital gains) are tax-exempt.</dd>
          <dt><strong>Transfer Duty</strong></dt>
          <dd>A government tax on property transfers. Payable by the buyer on properties above R1,100,000 (2025/26).</dd>
          <dt><strong>UIF</strong></dt>
          <dd>Unemployment Insurance Fund. A compulsory 1% salary deduction (matched by employer) providing short-term unemployment benefits.</dd>
        </dl>
      </div>
    ),
  },
};

const CATEGORY_COLORS: Record<string, string> = {
  Tax: "bg-blue-100 text-blue-700",
  Savings: "bg-emerald-100 text-emerald-700",
  Banking: "bg-slate-100 text-slate-700",
  Guide: "bg-purple-100 text-purple-700",
  Reference: "bg-amber-100 text-amber-700",
};

// ─── generateStaticParams ──────────────────────────────────────────────────────

export function generateStaticParams() {
  return Object.keys(ARTICLES).map((slug) => ({ slug }));
}

// ─── generateMetadata ──────────────────────────────────────────────────────────

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = ARTICLES[slug];
  if (!article) return { title: "Article Not Found – EveryRandSA" };
  return {
    title: `${article.title} – EveryRandSA`,
    description: `Learn about ${article.title.toLowerCase()} in plain English. Updated ${article.lastUpdated}.`,
  };
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function LearnArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = ARTICLES[slug];

  if (!article) {
    notFound();
  }

  return (
    <Layout
      breadcrumbs={[
        { label: "Learn", href: "/learn" },
        { label: article.title },
      ]}
    >
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex gap-10">
          {/* Main article */}
          <article className="flex-1 min-w-0">
            {/* Article header */}
            <header className="mb-8">
              <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full mb-4 ${CATEGORY_COLORS[article.category] ?? "bg-slate-100 text-slate-600"}`}>
                <BookOpen size={11} /> {article.category}
              </span>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 leading-tight">
                {article.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                <span className="flex items-center gap-1.5">
                  <Clock size={14} /> {article.readTime}
                </span>
                <span>Updated {article.lastUpdated}</span>
                <a
                  href={article.source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-blue-600 hover:underline"
                >
                  Source: {article.source.label} <ExternalLink size={12} />
                </a>
                <TrustBadge compact />
              </div>
            </header>

            {/* Article body */}
            <div className="text-slate-800 leading-relaxed">
              {article.content}
            </div>

            {/* Share */}
            <div className="mt-10 pt-6 border-t border-slate-200 flex items-center gap-3">
              <span className="text-sm text-slate-500">Share this guide:</span>
              <ShareButton />
            </div>
          </article>

          {/* Sidebar */}
          <aside className="hidden lg:block w-72 shrink-0">
            {/* Table of Contents */}
            <div className="bg-slate-50 rounded-xl p-5 mb-6 sticky top-6">
              <h2 className="font-semibold text-slate-900 text-sm mb-3">On this page</h2>
              <nav aria-label="Table of contents">
                <ul className="space-y-2">
                  {article.headings.map((heading) => (
                    <li key={heading}>
                      <a
                        href={`#${heading.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}`}
                        className="text-sm text-slate-600 hover:text-blue-700 transition-colors"
                      >
                        {heading}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>

            {/* Related calculators */}
            <div className="bg-blue-50 rounded-xl p-5">
              <h2 className="font-semibold text-slate-900 text-sm mb-3">Related Calculators</h2>
              <div className="space-y-2">
                {article.relatedCalcs.map((calc) => (
                  <Link
                    key={calc.href}
                    href={calc.href}
                    className="flex items-center justify-between text-sm text-blue-700 hover:underline font-medium"
                  >
                    {calc.label} <ArrowRight size={14} />
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </Layout>
  );
}

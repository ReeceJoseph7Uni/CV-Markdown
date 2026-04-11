# EveryRandSA 🇿🇦

> **South African Personal Finance Platform** – compare bank products, run SA-specific financial calculators, and track your money smarter.

---

## Overview

EveryRandSA is a TypeScript/Next.js platform that gives South Africans:

- 📊 **Product Comparison Engine** – score and rank savings accounts, TFSAs, fixed deposits, personal loans, and home loans across all major SA banks using weighted profiles (emergency savings, TFSA investor, large balance, fee-sensitive, etc.)
- 🧮 **Financial Calculators** – PAYE tax (2026 brackets), bond/transfer duty, loan amortization, savings growth, TFSA limits, debt snowball vs avalanche, and simple/compound interest
- 🔄 **Automated Data Refresh** – cron jobs sync SARB rates daily, product rates weekly, and comparison scores monthly
- 🗄️ **PostgreSQL + Prisma** – fully typed data layer with migrations

---

## Tech Stack

| Layer        | Technology                         |
|--------------|------------------------------------|
| Framework    | Next.js 14 (App Router)            |
| Language     | TypeScript 5 (strict mode)         |
| Database     | PostgreSQL via Prisma ORM          |
| Caching      | In-memory with TTL                 |
| Scheduling   | node-cron                          |
| HTTP client  | axios                              |
| Testing      | Jest + ts-jest                     |

---

## Project Structure

```
everyrandsa/
├── prisma/schema.prisma        # Prisma schema (Product, Rate, Calculator, Score)
├── migrations/                 # Raw SQL migrations
├── src/
│   ├── types/index.ts          # All shared TypeScript types & interfaces
│   ├── lib/                    # db.ts (Prisma singleton), cache.ts (TTL cache)
│   ├── calculators/            # PAYE, loan, bond, savings, TFSA, interest, debt
│   ├── comparison/             # Product filtering, scoring & ranking
│   ├── middleware/             # Rate limiting, error handling, cache wrapper
│   ├── api/                    # Handler functions for products, calculators, rates
│   └── services/cron.ts        # Scheduled refresh jobs
├── seeds/initialData.ts        # 15 savings + 10 loan products (real SA rates)
├── tests/                      # Jest test suites
└── .env.example                # Environment variable template
```

---

## Setup

### Prerequisites
- Node.js ≥ 18
- PostgreSQL ≥ 14
- pnpm / npm / yarn

### 1. Clone & Install

```bash
git clone <repo-url>
cd everyrandsa
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
# Edit .env and set DATABASE_URL to your PostgreSQL connection string
```

### 3. Run Database Migration

```bash
# Option A: Prisma (recommended)
npm run db:generate
npm run db:migrate

# Option B: Raw SQL
psql $DATABASE_URL -f migrations/001_initial_schema.sql
```

### 4. Seed Initial Data

```bash
npm run db:seed
```

This loads:
- 15 savings/TFSA products (FNB, Standard Bank, Absa, Nedbank, Capitec, TymeBank, Discovery, African Bank, Investec, Old Mutual)
- 10 loan products (personal + home loans from major banks)
- Calculator metadata records
- Data source registry (SARB, SARS, bank websites)

### 5. Start Development Server

```bash
npm run dev
# → http://localhost:3000
```

---

## Calculators

### PAYE (2026 Tax Year)

```typescript
import { calculatePAYE } from './src/calculators';

const result = calculatePAYE({
  grossSalary:            600_000,
  age:                    35,
  medicalAidDependants:   2,         // spouse + 1 child
  retirementContribution: 3_000,     // monthly RA contribution
});

console.log(result.netSalary);        // Annual net salary
console.log(result.monthlyNetSalary); // Monthly take-home
console.log(result.effectiveTaxRate); // e.g. 0.2134
```

**2026 Tax Brackets:**

| Taxable Income            | Rate |
|---------------------------|------|
| R1 – R237,100             | 18%  |
| R237,101 – R370,500       | 26%  |
| R370,501 – R512,800       | 31%  |
| R512,801 – R673,000       | 36%  |
| R673,001 – R857,900       | 39%  |
| R857,901 – R1,817,000     | 41%  |
| R1,817,001+               | 45%  |

### Bond Calculator

```typescript
import { calculateBond } from './src/calculators';

const result = calculateBond({
  propertyPrice: 2_500_000,
  deposit:         500_000,
  termYears:            20,
  annualRate:       0.1025,  // prime rate
  monthlyLevy:       2_000,
  monthlyRates:        800,
});

console.log(result.transferDuty);           // 2026 transfer duty
console.log(result.totalAcquisitionCost);   // price + duty + attorney fees
console.log(result.monthlyTotalCost);       // bond + levy + rates
```

### Debt Snowball vs Avalanche

```typescript
import { calculateDebt } from './src/calculators';

const result = calculateDebt({
  debts: [
    { name: 'Credit Card',   balance: 15_000, annualRate: 0.20, minimumPayment: 450 },
    { name: 'Personal Loan', balance: 30_000, annualRate: 0.15, minimumPayment: 800 },
  ],
  extraPayment: 500,
});

console.log(result.avalanche.monthsToDebtFree);    // e.g. 32 months
console.log(result.interestSavedByAvalanche);       // e.g. R2,340 saved
```

---

## API Endpoints

### Products

| Method | Path                        | Description                          |
|--------|-----------------------------|--------------------------------------|
| GET    | `/api/products`             | List products (filterable)           |
| GET    | `/api/products/[id]`        | Single product with rates & scores   |
| POST   | `/api/products/compare`     | Compare multiple products by profile |
| GET    | `/api/products/top`         | Top products for a given profile     |
| POST   | `/api/admin/products`       | Create product (admin)               |
| PUT    | `/api/admin/products/[id]`  | Update product (admin)               |

**Filter query params for GET /api/products:**
`productType`, `institution`, `accessType`, `maxMonthlyFee`, `tfsaOnly`, `userProfile`

### Calculators

All calculator endpoints accept `POST` with a JSON body:

| Path                          | Required Body Fields                          |
|-------------------------------|-----------------------------------------------|
| `/api/calculators/paye`       | `grossSalary`, `age`                          |
| `/api/calculators/loan`       | `principal`, `termMonths`, `annualRate`       |
| `/api/calculators/bond`       | `propertyPrice`, `deposit`, `termYears`, `annualRate` |
| `/api/calculators/savings`    | `principal`, `annualRate`, `termYears`        |
| `/api/calculators/tfsa`       | `annualContribution`                          |
| `/api/calculators/interest`   | `principal`, `annualRate`, `termYears`        |
| `/api/calculators/debt`       | `debts[]`                                     |

### Rates & Data

| Method | Path                              | Description                    |
|--------|-----------------------------------|--------------------------------|
| GET    | `/api/rates/sarb`                 | Current repo & prime rate      |
| GET    | `/api/rates/tfsa-limits`          | TFSA annual limit & lifetime cap|
| GET    | `/api/rates/history`              | Historical SARB rate changes   |
| GET    | `/api/data-sources`               | Data source list & sync status |
| POST   | `/api/admin/data-sources/refresh` | Trigger manual data refresh    |

---

## Reference Rates

| Rate         | Value  |
|--------------|--------|
| SARB Repo    | 6.75%  |
| Prime        | 10.25% |
| TFSA Annual  | R46,000|
| TFSA Lifetime| R500,000|

---

## Cron Job Schedule

| Job                    | Schedule           | Description                                |
|------------------------|--------------------|--------------------------------------------|
| syncSARBRates          | Daily 06:00 SAST   | Fetch latest repo & prime rates from SARB  |
| syncProductRates       | Sundays 02:00 SAST | Update bank product rates & fees           |
| recalculateScores      | 1st of month 04:00 | Recompute all comparison scores            |

Enable/disable with `CRON_ENABLED=true` in `.env`.

---

## Testing

```bash
npm test                  # Run all tests
npm run test:watch        # Watch mode
```

Test suites:
- `tests/calculators.test.ts` – PAYE, loan, bond, savings, TFSA, debt, interest
- `tests/comparison.test.ts` – filter, scoring weights, net value, ranking

---

## Database Schema

```
Product ─── ProductRate   (1:many)
Product ─── ComparisonScore (1:many, one per UserProfile)
Calculator                (standalone)
DataSource                (standalone)
```

**Enums:**
- `ProductType`: SAVINGS, TFSA, NOTICE_DEPOSIT, FIXED_DEPOSIT, MONEY_MARKET, PERSONAL_LOAN, HOME_LOAN, CREDIT_CARD, TRANSACTION_ACCOUNT, INVESTMENT
- `AccessType`: INSTANT, NOTICE_7_DAYS, NOTICE_32_DAYS, NOTICE_60_DAYS, NOTICE_90_DAYS, FIXED_TERM
- `TaxStatus`: TAXABLE, TAX_FREE, TAX_DEFERRED
- `UserProfile`: EMERGENCY_SAVINGS, TFSA_INVESTOR, LARGE_BALANCE, NO_FEE_PREFERENCE, SHORT_TERM_PARKING, GENERAL

---

## Contributing

1. Fork & create a feature branch
2. Follow existing TypeScript strict-mode patterns
3. Add/update tests for any new calculator logic
4. Run `npm test` and ensure all tests pass
5. Submit a pull request with a clear description

**Code style:**
- No `any` types — use generics or proper interfaces
- Monetary values: `number` with 2 decimal places (`round2` helper)
- Interest rates: decimals (e.g. `0.0925` for 9.25%)
- Comments only where logic needs clarification

---

## Licence

MIT © EveryRandSA Contributors

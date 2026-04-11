/**
 * Initial seed data for EveryRandSA.
 * Run with: ts-node seeds/initialData.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  console.log('🌱 Seeding EveryRandSA database…');

  // ----------------------------------------------------------------
  // Data Sources
  // ----------------------------------------------------------------
  await prisma.dataSource.createMany({
    skipDuplicates: true,
    data: [
      {
        name:            'SARB',
        description:     'South African Reserve Bank – reference and repo rates',
        apiEndpoint:     'https://www.resbank.co.za/en/home/what-we-do/statistics/releases/monetary-statistics',
        refreshSchedule: '0 4 * * *',
        isActive:        true,
      },
      {
        name:            'SARS',
        description:     'South African Revenue Service – tax tables and TFSA limits',
        apiEndpoint:     'https://www.sars.gov.za/tax-rates/income-tax/rates-of-tax-for-individuals/',
        refreshSchedule: '0 4 1 3 *',
        isActive:        true,
      },
      {
        name:            'FNB',
        description:     'First National Bank – savings and loan product rates',
        apiEndpoint:     'https://www.fnb.co.za/savings-and-investments.html',
        refreshSchedule: '0 2 * * 0',
        isActive:        true,
      },
      {
        name:            'Standard Bank',
        description:     'Standard Bank – savings and loan product rates',
        apiEndpoint:     'https://www.standardbank.co.za/southafrica/personal/products-and-services/saving-and-investing',
        refreshSchedule: '0 2 * * 0',
        isActive:        true,
      },
      {
        name:            'Absa',
        description:     'Absa Bank – savings and loan product rates',
        apiEndpoint:     'https://www.absa.co.za/personal/save-and-invest/',
        refreshSchedule: '0 2 * * 0',
        isActive:        true,
      },
      {
        name:            'Nedbank',
        description:     'Nedbank – savings and loan product rates',
        apiEndpoint:     'https://www.nedbank.co.za/content/nedbank/desktop/gt/en/personal/save-and-invest.html',
        refreshSchedule: '0 2 * * 0',
        isActive:        true,
      },
      {
        name:            'Capitec',
        description:     'Capitec Bank – savings and loan product rates',
        apiEndpoint:     'https://www.capitecbank.co.za/personal/save/',
        refreshSchedule: '0 2 * * 0',
        isActive:        true,
      },
    ],
  });

  // ----------------------------------------------------------------
  // Savings Account Products  (15 products)
  // ----------------------------------------------------------------
  const savingsProducts = await Promise.all([
    // 1. FNB Easy Savings
    prisma.product.create({
      data: {
        institution:     'FNB',
        productName:     'FNB Easy Savings Account',
        productType:     'SAVINGS',
        category:        'Savings',
        minDeposit:      0,
        accessType:      'INSTANT',
        monthlyFee:      0,
        taxStatus:       'TAXABLE',
        sourceUrl:       'https://www.fnb.co.za/savings-and-investments/easy-save.html',
        lastCheckedDate: new Date('2025-01-15'),
        rates: {
          create: [
            { minBalance: 0,         maxBalance: 9_999,    interestRate: 0.0450 },
            { minBalance: 10_000,    maxBalance: 49_999,   interestRate: 0.0600 },
            { minBalance: 50_000,    maxBalance: 99_999,   interestRate: 0.0700 },
            { minBalance: 100_000,   maxBalance: null,     interestRate: 0.0800 },
          ],
        },
      },
    }),

    // 2. FNB Tax-Free Cash Deposit
    prisma.product.create({
      data: {
        institution:     'FNB',
        productName:     'FNB Tax-Free Cash Deposit',
        productType:     'TFSA',
        category:        'Tax-Free Savings',
        minDeposit:      250,
        accessType:      'INSTANT',
        monthlyFee:      0,
        taxStatus:       'TAX_FREE',
        sourceUrl:       'https://www.fnb.co.za/savings-and-investments/tax-free-cash-deposit.html',
        lastCheckedDate: new Date('2025-01-15'),
        rates: {
          create: [
            { minBalance: 0, interestRate: 0.0875 },
          ],
        },
      },
    }),

    // 3. Standard Bank PureSave
    prisma.product.create({
      data: {
        institution:     'Standard Bank',
        productName:     'PureSave Account',
        productType:     'SAVINGS',
        category:        'Savings',
        minDeposit:      0,
        accessType:      'INSTANT',
        monthlyFee:      0,
        taxStatus:       'TAXABLE',
        sourceUrl:       'https://www.standardbank.co.za/southafrica/personal/products-and-services/saving-and-investing/puresave',
        lastCheckedDate: new Date('2025-01-15'),
        rates: {
          create: [
            { minBalance: 0,       maxBalance: 9_999,  interestRate: 0.0425 },
            { minBalance: 10_000,  maxBalance: 99_999, interestRate: 0.0575 },
            { minBalance: 100_000, maxBalance: null,   interestRate: 0.0750 },
          ],
        },
      },
    }),

    // 4. Standard Bank Tax-Free Call Account
    prisma.product.create({
      data: {
        institution:     'Standard Bank',
        productName:     'Tax-Free Call Account',
        productType:     'TFSA',
        category:        'Tax-Free Savings',
        minDeposit:      0,
        accessType:      'INSTANT',
        monthlyFee:      0,
        taxStatus:       'TAX_FREE',
        sourceUrl:       'https://www.standardbank.co.za/southafrica/personal/products-and-services/saving-and-investing/tax-free-call-account',
        lastCheckedDate: new Date('2025-01-15'),
        rates: {
          create: [{ minBalance: 0, interestRate: 0.0850 }],
        },
      },
    }),

    // 5. Absa Flexi Save
    prisma.product.create({
      data: {
        institution:     'Absa',
        productName:     'Flexi Save Account',
        productType:     'SAVINGS',
        category:        'Savings',
        minDeposit:      0,
        accessType:      'INSTANT',
        monthlyFee:      0,
        taxStatus:       'TAXABLE',
        sourceUrl:       'https://www.absa.co.za/personal/save-and-invest/flexi-save/',
        lastCheckedDate: new Date('2025-01-15'),
        rates: {
          create: [
            { minBalance: 0,       maxBalance: 9_999,  interestRate: 0.0400 },
            { minBalance: 10_000,  maxBalance: 99_999, interestRate: 0.0550 },
            { minBalance: 100_000, maxBalance: null,   interestRate: 0.0725 },
          ],
        },
      },
    }),

    // 6. Absa Tax-Free Savings Account
    prisma.product.create({
      data: {
        institution:     'Absa',
        productName:     'Tax-Free Savings Account',
        productType:     'TFSA',
        category:        'Tax-Free Savings',
        minDeposit:      0,
        accessType:      'INSTANT',
        monthlyFee:      0,
        taxStatus:       'TAX_FREE',
        sourceUrl:       'https://www.absa.co.za/personal/save-and-invest/tax-free-savings-account/',
        lastCheckedDate: new Date('2025-01-15'),
        rates: {
          create: [{ minBalance: 0, interestRate: 0.0825 }],
        },
      },
    }),

    // 7. Nedbank JustSave Account
    prisma.product.create({
      data: {
        institution:     'Nedbank',
        productName:     'JustSave Account',
        productType:     'SAVINGS',
        category:        'Savings',
        minDeposit:      0,
        accessType:      'INSTANT',
        monthlyFee:      0,
        taxStatus:       'TAXABLE',
        sourceUrl:       'https://www.nedbank.co.za/content/nedbank/desktop/gt/en/personal/save-and-invest/justsave.html',
        lastCheckedDate: new Date('2025-01-15'),
        rates: {
          create: [
            { minBalance: 0,       maxBalance: 9_999,  interestRate: 0.0425 },
            { minBalance: 10_000,  maxBalance: 49_999, interestRate: 0.0575 },
            { minBalance: 50_000,  maxBalance: null,   interestRate: 0.0725 },
          ],
        },
      },
    }),

    // 8. Capitec Global One Savings
    prisma.product.create({
      data: {
        institution:     'Capitec',
        productName:     'Global One Savings Plan',
        productType:     'SAVINGS',
        category:        'Savings',
        minDeposit:      0,
        accessType:      'INSTANT',
        monthlyFee:      7,
        taxStatus:       'TAXABLE',
        sourceUrl:       'https://www.capitecbank.co.za/personal/save/global-one-savings/',
        lastCheckedDate: new Date('2025-01-15'),
        rates: {
          create: [
            { minBalance: 0,       maxBalance: 9_999,  interestRate: 0.0500 },
            { minBalance: 10_000,  maxBalance: 99_999, interestRate: 0.0700 },
            { minBalance: 100_000, maxBalance: null,   interestRate: 0.0825 },
          ],
        },
      },
    }),

    // 9. TymeBank GoalSave
    prisma.product.create({
      data: {
        institution:     'TymeBank',
        productName:     'GoalSave Account',
        productType:     'SAVINGS',
        category:        'Savings',
        minDeposit:      0,
        accessType:      'INSTANT',
        monthlyFee:      0,
        taxStatus:       'TAXABLE',
        notes:           'Higher rate if no withdrawals for 3 months',
        sourceUrl:       'https://www.tymebank.co.za/save/goalsave/',
        lastCheckedDate: new Date('2025-01-15'),
        rates: {
          create: [
            { minBalance: 0, maxBalance: null, interestRate: 0.1000 },
          ],
        },
      },
    }),

    // 10. Discovery Bank Savings Account
    prisma.product.create({
      data: {
        institution:     'Discovery Bank',
        productName:     'Discovery Bank Savings Account',
        productType:     'SAVINGS',
        category:        'Savings',
        minDeposit:      0,
        accessType:      'INSTANT',
        monthlyFee:      0,
        taxStatus:       'TAXABLE',
        notes:           'Dynamic interest rates based on Vitality Money status',
        sourceUrl:       'https://www.discovery.co.za/bank/savings-account',
        lastCheckedDate: new Date('2025-01-15'),
        rates: {
          create: [
            { minBalance: 0,       maxBalance: 9_999,  interestRate: 0.0600 },
            { minBalance: 10_000,  maxBalance: 99_999, interestRate: 0.0750 },
            { minBalance: 100_000, maxBalance: null,   interestRate: 0.0900 },
          ],
        },
      },
    }),

    // 11. African Bank Tax-Free Fixed Deposit
    prisma.product.create({
      data: {
        institution:     'African Bank',
        productName:     'Tax-Free Fixed Deposit',
        productType:     'TFSA',
        category:        'Tax-Free Fixed Deposit',
        minDeposit:      500,
        accessType:      'FIXED_TERM',
        monthlyFee:      0,
        taxStatus:       'TAX_FREE',
        sourceUrl:       'https://www.africanbank.co.za/en/home/explore/save/tax-free-fixed-deposit/',
        lastCheckedDate: new Date('2025-01-15'),
        rates: {
          create: [{ minBalance: 500, interestRate: 0.1100 }],
        },
      },
    }),

    // 12. Investec Private Bank Account
    prisma.product.create({
      data: {
        institution:     'Investec',
        productName:     'Private Bank Account',
        productType:     'SAVINGS',
        category:        'High Net Worth Savings',
        minDeposit:      100_000,
        accessType:      'INSTANT',
        monthlyFee:      695,
        taxStatus:       'TAXABLE',
        sourceUrl:       'https://www.investec.com/en_za/banking/private-banking/private-bank-account.html',
        lastCheckedDate: new Date('2025-01-15'),
        rates: {
          create: [
            { minBalance: 100_000,    maxBalance: 999_999,  interestRate: 0.0825 },
            { minBalance: 1_000_000,  maxBalance: null,     interestRate: 0.0900 },
          ],
        },
      },
    }),

    // 13. Old Mutual Money Market Account
    prisma.product.create({
      data: {
        institution:     'Old Mutual',
        productName:     'Money Market Account',
        productType:     'MONEY_MARKET',
        category:        'Money Market',
        minDeposit:      25_000,
        accessType:      'NOTICE_32_DAYS',
        noticePeriodDays: 32,
        monthlyFee:      0,
        taxStatus:       'TAXABLE',
        sourceUrl:       'https://www.oldmutual.co.za/personal/savings-and-investments/money-market/',
        lastCheckedDate: new Date('2025-01-15'),
        rates: {
          create: [{ minBalance: 25_000, interestRate: 0.0875 }],
        },
      },
    }),

    // 14. Nedbank Tax-Free Savings Account
    prisma.product.create({
      data: {
        institution:     'Nedbank',
        productName:     'Tax-Free Savings Account',
        productType:     'TFSA',
        category:        'Tax-Free Savings',
        minDeposit:      500,
        accessType:      'INSTANT',
        monthlyFee:      0,
        taxStatus:       'TAX_FREE',
        sourceUrl:       'https://www.nedbank.co.za/content/nedbank/desktop/gt/en/personal/save-and-invest/tax-free-savings.html',
        lastCheckedDate: new Date('2025-01-15'),
        rates: {
          create: [{ minBalance: 500, interestRate: 0.0850 }],
        },
      },
    }),

    // 15. Capitec Tax-Free Savings
    prisma.product.create({
      data: {
        institution:     'Capitec',
        productName:     'Tax-Free Savings Account',
        productType:     'TFSA',
        category:        'Tax-Free Savings',
        minDeposit:      0,
        accessType:      'INSTANT',
        monthlyFee:      0,
        taxStatus:       'TAX_FREE',
        sourceUrl:       'https://www.capitecbank.co.za/personal/save/tax-free-savings/',
        lastCheckedDate: new Date('2025-01-15'),
        rates: {
          create: [{ minBalance: 0, interestRate: 0.0875 }],
        },
      },
    }),
  ]);

  console.log(`✅ Created ${savingsProducts.length} savings products`);

  // ----------------------------------------------------------------
  // Loan Products (10 products)
  // ----------------------------------------------------------------
  const loanProducts = await Promise.all([
    prisma.product.create({
      data: {
        institution:     'FNB',
        productName:     'Personal Loan',
        productType:     'PERSONAL_LOAN',
        category:        'Personal Loans',
        minDeposit:      null,
        minIncome:       5_000,
        accessType:      'INSTANT',
        monthlyFee:      69,
        initiationFee:   1_207.50,
        taxStatus:       'TAXABLE',
        sourceUrl:       'https://www.fnb.co.za/loans/personal-loan.html',
        lastCheckedDate: new Date('2025-01-15'),
        rates: {
          create: [{ minBalance: 0, interestRate: 0.1625 }],
        },
      },
    }),

    prisma.product.create({
      data: {
        institution:     'Standard Bank',
        productName:     'Personal Loan',
        productType:     'PERSONAL_LOAN',
        category:        'Personal Loans',
        minIncome:       5_000,
        accessType:      'INSTANT',
        monthlyFee:      69,
        initiationFee:   1_207.50,
        taxStatus:       'TAXABLE',
        sourceUrl:       'https://www.standardbank.co.za/southafrica/personal/products-and-services/borrow-for-your-needs/personal-loan',
        lastCheckedDate: new Date('2025-01-15'),
        rates: {
          create: [{ minBalance: 0, interestRate: 0.1600 }],
        },
      },
    }),

    prisma.product.create({
      data: {
        institution:     'Absa',
        productName:     'Personal Loan',
        productType:     'PERSONAL_LOAN',
        category:        'Personal Loans',
        minIncome:       5_000,
        accessType:      'INSTANT',
        monthlyFee:      69,
        initiationFee:   1_207.50,
        taxStatus:       'TAXABLE',
        sourceUrl:       'https://www.absa.co.za/personal/loans/personal-loans/personal-loan/',
        lastCheckedDate: new Date('2025-01-15'),
        rates: {
          create: [{ minBalance: 0, interestRate: 0.1700 }],
        },
      },
    }),

    prisma.product.create({
      data: {
        institution:     'Nedbank',
        productName:     'Personal Loan',
        productType:     'PERSONAL_LOAN',
        category:        'Personal Loans',
        minIncome:       5_000,
        accessType:      'INSTANT',
        monthlyFee:      69,
        initiationFee:   1_207.50,
        taxStatus:       'TAXABLE',
        sourceUrl:       'https://www.nedbank.co.za/content/nedbank/desktop/gt/en/personal/loans/personal-loan.html',
        lastCheckedDate: new Date('2025-01-15'),
        rates: {
          create: [{ minBalance: 0, interestRate: 0.1650 }],
        },
      },
    }),

    prisma.product.create({
      data: {
        institution:     'Capitec',
        productName:     'Personal Loan',
        productType:     'PERSONAL_LOAN',
        category:        'Personal Loans',
        minIncome:       5_000,
        accessType:      'INSTANT',
        monthlyFee:      69,
        initiationFee:   1_207.50,
        taxStatus:       'TAXABLE',
        sourceUrl:       'https://www.capitecbank.co.za/personal/credit/personal-loan/',
        lastCheckedDate: new Date('2025-01-15'),
        rates: {
          create: [{ minBalance: 0, interestRate: 0.1550 }],
        },
      },
    }),

    prisma.product.create({
      data: {
        institution:     'African Bank',
        productName:     'Personal Loan',
        productType:     'PERSONAL_LOAN',
        category:        'Personal Loans',
        minIncome:       3_000,
        accessType:      'INSTANT',
        monthlyFee:      69,
        initiationFee:   1_207.50,
        taxStatus:       'TAXABLE',
        sourceUrl:       'https://www.africanbank.co.za/en/home/explore/borrow/personal-loan/',
        lastCheckedDate: new Date('2025-01-15'),
        rates: {
          create: [{ minBalance: 0, interestRate: 0.2000 }],
        },
      },
    }),

    prisma.product.create({
      data: {
        institution:     'FNB',
        productName:     'Home Loan',
        productType:     'HOME_LOAN',
        category:        'Home Loans',
        minIncome:       15_000,
        accessType:      'FIXED_TERM',
        monthlyFee:      69,
        initiationFee:   6_000,
        taxStatus:       'TAXABLE',
        sourceUrl:       'https://www.fnb.co.za/loans/home-loans.html',
        lastCheckedDate: new Date('2025-01-15'),
        rates: {
          create: [{ minBalance: 0, interestRate: 0.1025 }],
        },
      },
    }),

    prisma.product.create({
      data: {
        institution:     'Standard Bank',
        productName:     'Home Loan',
        productType:     'HOME_LOAN',
        category:        'Home Loans',
        minIncome:       15_000,
        accessType:      'FIXED_TERM',
        monthlyFee:      69,
        initiationFee:   6_000,
        taxStatus:       'TAXABLE',
        sourceUrl:       'https://www.standardbank.co.za/southafrica/personal/products-and-services/borrow-for-your-needs/home-loans',
        lastCheckedDate: new Date('2025-01-15'),
        rates: {
          create: [{ minBalance: 0, interestRate: 0.1025 }],
        },
      },
    }),

    prisma.product.create({
      data: {
        institution:     'Absa',
        productName:     'Home Loan',
        productType:     'HOME_LOAN',
        category:        'Home Loans',
        minIncome:       15_000,
        accessType:      'FIXED_TERM',
        monthlyFee:      69,
        initiationFee:   6_000,
        taxStatus:       'TAXABLE',
        sourceUrl:       'https://www.absa.co.za/personal/home-loans/home-loan/',
        lastCheckedDate: new Date('2025-01-15'),
        rates: {
          create: [{ minBalance: 0, interestRate: 0.1025 }],
        },
      },
    }),

    prisma.product.create({
      data: {
        institution:     'Nedbank',
        productName:     'Home Loan',
        productType:     'HOME_LOAN',
        category:        'Home Loans',
        minIncome:       15_000,
        accessType:      'FIXED_TERM',
        monthlyFee:      69,
        initiationFee:   6_000,
        taxStatus:       'TAXABLE',
        sourceUrl:       'https://www.nedbank.co.za/content/nedbank/desktop/gt/en/personal/home-loans.html',
        lastCheckedDate: new Date('2025-01-15'),
        rates: {
          create: [{ minBalance: 0, interestRate: 0.1025 }],
        },
      },
    }),
  ]);

  console.log(`✅ Created ${loanProducts.length} loan products`);

  // ----------------------------------------------------------------
  // Calculators metadata
  // ----------------------------------------------------------------
  await prisma.calculator.createMany({
    skipDuplicates: true,
    data: [
      {
        name:         'PAYE',
        description:  'Calculate South African PAYE income tax, UIF and net take-home pay',
        category:     'Tax',
        inputs:       JSON.stringify({ grossSalary: 'number', age: 'number', medicalAidDependants: 'number', retirementContribution: 'number' }),
        formula:      'South African 2026 tax brackets with rebates',
        outputFields: JSON.stringify({ netTax: 'number', netSalary: 'number', effectiveTaxRate: 'number' }),
        taxYear:      '2026',
        isActive:     true,
      },
      {
        name:         'LOAN',
        description:  'Amortization loan repayment and effective APR calculator',
        category:     'Loans',
        inputs:       JSON.stringify({ principal: 'number', termMonths: 'number', annualRate: 'number' }),
        formula:      'M = P * [r(1+r)^n] / [(1+r)^n - 1]',
        outputFields: JSON.stringify({ monthlyRepayment: 'number', totalInterest: 'number', effectiveAPR: 'number' }),
        isActive:     true,
      },
      {
        name:         'BOND',
        description:  'Home loan bond repayment and transfer duty calculator',
        category:     'Property',
        inputs:       JSON.stringify({ propertyPrice: 'number', deposit: 'number', termYears: 'number', annualRate: 'number' }),
        formula:      'Amortization + SA 2026 transfer duty',
        outputFields: JSON.stringify({ monthlyBondRepayment: 'number', transferDuty: 'number', totalAcquisitionCost: 'number' }),
        taxYear:      '2026',
        isActive:     true,
      },
      {
        name:         'SAVINGS',
        description:  'Savings growth with compound interest and regular contributions',
        category:     'Savings',
        inputs:       JSON.stringify({ principal: 'number', monthlyDeposit: 'number', annualRate: 'number', termYears: 'number' }),
        formula:      'A = P(1 + r/n)^(nt) + PMT * [((1+r/n)^(nt)-1)/(r/n)]',
        outputFields: JSON.stringify({ futureValue: 'number', totalInterestEarned: 'number' }),
        isActive:     true,
      },
      {
        name:         'TFSA',
        description:  'Tax-Free Savings Account contribution and limit tracker',
        category:     'Tax-Free Savings',
        inputs:       JSON.stringify({ annualContribution: 'number', previousContributions: 'number' }),
        formula:      'TFSA annual R46,000 and lifetime R500,000 limit checks',
        outputFields: JSON.stringify({ remainingAnnualAllowance: 'number', remainingLifetimeAllowance: 'number', isOverContributed: 'boolean' }),
        taxYear:      '2026',
        isActive:     true,
      },
      {
        name:         'DEBT',
        description:  'Debt snowball vs avalanche payoff strategy comparison',
        category:     'Debt Management',
        inputs:       JSON.stringify({ debts: 'IDebt[]', extraPayment: 'number', strategy: 'SNOWBALL|AVALANCHE' }),
        formula:      'Iterative monthly amortization with waterfall payments',
        outputFields: JSON.stringify({ monthsToDebtFree: 'number', totalInterestPaid: 'number', interestSavedByAvalanche: 'number' }),
        isActive:     true,
      },
    ],
  });

  console.log('✅ Calculators metadata seeded');
  console.log('🎉 Seed complete!');
}

main()
  .catch(e => {
    console.error('❌ Seed failed', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

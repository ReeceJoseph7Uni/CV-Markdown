import type {
  IDebtInput,
  IDebtResult,
  IDebtStrategyResult,
  IDebtScheduleEntry,
  IDebt,
} from '../types';

const MAX_MONTHS = 600; // 50 year safety cap

export function calculateDebt(input: IDebtInput): IDebtResult {
  const { debts, extraPayment = 0, strategy } = input;

  if (!debts || debts.length === 0) throw new Error('At least one debt is required');
  if (extraPayment < 0)             throw new Error('Extra payment cannot be negative');

  const snowball = runStrategy(debts, extraPayment, 'SNOWBALL');
  const avalanche = runStrategy(debts, extraPayment, 'AVALANCHE');

  const interestSavedByAvalanche = round2(snowball.totalInterestPaid - avalanche.totalInterestPaid);
  const monthsSavedByAvalanche   = snowball.monthsToDebtFree - avalanche.monthsToDebtFree;

  // If strategy is explicitly given, we still return both for comparison
  void strategy;

  return {
    snowball,
    avalanche,
    interestSavedByAvalanche,
    monthsSavedByAvalanche,
  };
}

function runStrategy(
  debts: IDebt[],
  extraPayment: number,
  strategy: 'SNOWBALL' | 'AVALANCHE',
): IDebtStrategyResult {
  // Deep-copy debts so we don't mutate input
  let balances = debts.map(d => ({ ...d }));
  let totalInterestPaid = 0;
  let month = 0;
  const schedule: IDebtScheduleEntry[] = [];

  while (balances.some(d => d.balance > 0) && month < MAX_MONTHS) {
    month++;

    // Determine which debt gets the extra payment this month
    const activeDebts = balances.filter(d => d.balance > 0);
    let focusDebt: IDebt;

    if (strategy === 'SNOWBALL') {
      focusDebt = activeDebts.reduce((a, b) => (a.balance <= b.balance ? a : b));
    } else {
      focusDebt = activeDebts.reduce((a, b) => (a.annualRate >= b.annualRate ? a : b));
    }

    const entry: IDebtScheduleEntry = { month, debts: [], totalPayment: 0 };

    for (const debt of balances) {
      if (debt.balance <= 0) {
        entry.debts.push({ name: debt.name, balance: 0, payment: 0, interestCharged: 0 });
        continue;
      }

      const monthlyRate     = debt.annualRate / 12;
      const interestCharged = debt.balance * monthlyRate;
      totalInterestPaid    += interestCharged;
      debt.balance         += interestCharged;

      let payment = debt.minimumPayment;

      // Add extra to the focus debt
      if (debt.name === focusDebt.name) {
        payment += extraPayment;
      }

      // Don't overpay
      payment = Math.min(payment, debt.balance);
      debt.balance -= payment;
      if (debt.balance < 0.01) debt.balance = 0;

      entry.debts.push({
        name:            debt.name,
        balance:         round2(debt.balance),
        payment:         round2(payment),
        interestCharged: round2(interestCharged),
      });
      entry.totalPayment += payment;
    }

    entry.totalPayment = round2(entry.totalPayment);
    schedule.push(entry);
  }

  const totalPaid = debts.reduce((s, d) => s + d.balance, 0) +
    schedule.reduce((s, e) => s + e.totalPayment, 0);

  return {
    strategy,
    monthsToDebtFree: month,
    totalInterestPaid: round2(totalInterestPaid),
    totalPaid:         round2(totalPaid),
    schedule,
  };
}

function round2(n: number): number { return Math.round(n * 100) / 100; }

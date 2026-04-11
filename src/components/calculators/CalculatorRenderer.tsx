'use client';

import dynamic from 'next/dynamic';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

const PAYECalculator = dynamic(() => import('./PAYECalculator'), { ssr: false, loading: () => <LoadingSpinner /> });
const LoanCalculator = dynamic(() => import('./LoanCalculator'), { ssr: false, loading: () => <LoadingSpinner /> });
const BondCalculator = dynamic(() => import('./BondCalculator'), { ssr: false, loading: () => <LoadingSpinner /> });
const SavingsCalculator = dynamic(() => import('./SavingsCalculator'), { ssr: false, loading: () => <LoadingSpinner /> });
const TFSACalculator = dynamic(() => import('./TFSACalculator'), { ssr: false, loading: () => <LoadingSpinner /> });
const InterestCalculator = dynamic(() => import('./InterestCalculator'), { ssr: false, loading: () => <LoadingSpinner /> });
const DebtCalculator = dynamic(() => import('./DebtCalculator'), { ssr: false, loading: () => <LoadingSpinner /> });
const NetToGrossCalculator = dynamic(() => import('./NetToGrossCalculator'), { ssr: false, loading: () => <LoadingSpinner /> });

const CALCULATOR_COMPONENTS: Record<string, React.ComponentType> = {
  paye: PAYECalculator,
  loan: LoanCalculator,
  bond: BondCalculator,
  savings: SavingsCalculator,
  tfsa: TFSACalculator,
  interest: InterestCalculator,
  debt: DebtCalculator,
  'net-to-gross': NetToGrossCalculator,
};

interface CalculatorRendererProps {
  type: string;
}

export default function CalculatorRenderer({ type }: CalculatorRendererProps) {
  const Component = CALCULATOR_COMPONENTS[type];
  if (!Component) return null;
  return <Component />;
}

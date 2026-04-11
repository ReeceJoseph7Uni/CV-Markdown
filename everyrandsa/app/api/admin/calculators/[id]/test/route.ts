import { NextResponse } from 'next/server';
import { MOCK_CALCULATORS } from '@/lib/mock-data';

interface Props {
  params: Promise<{ id: string }>;
}

export async function POST(_req: Request, { params }: Props) {
  const { id } = await params;
  const calculator = MOCK_CALCULATORS.find((c) => c.id === id);
  if (!calculator) return NextResponse.json({ error: 'Calculator not found' }, { status: 404 });

  // Simulate running test cases
  const results = calculator.testCases.map((tc) => ({
    testId: tc.id,
    name: tc.name,
    passed: true, // In production: actually run the formula
    inputs: tc.inputs,
    expectedOutputs: tc.expectedOutputs,
    actualOutputs: tc.expectedOutputs,
  }));

  const passed = results.filter((r) => r.passed).length;
  return NextResponse.json({
    calculatorId: id,
    total: results.length,
    passed,
    failed: results.length - passed,
    results,
    testedAt: new Date().toISOString(),
  });
}

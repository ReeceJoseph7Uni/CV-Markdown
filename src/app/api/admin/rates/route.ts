import { NextResponse } from 'next/server';
import { mockRateChanges } from '@/lib/mockData';

export async function GET() {
  return NextResponse.json({ rateChanges: mockRateChanges, total: mockRateChanges.length });
}

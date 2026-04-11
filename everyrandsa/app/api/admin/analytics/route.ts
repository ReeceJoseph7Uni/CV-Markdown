import { NextResponse } from 'next/server';
import { MOCK_DASHBOARD } from '@/lib/mock-data';

export async function GET() {
  return NextResponse.json({
    metrics: MOCK_DASHBOARD,
    generatedAt: new Date().toISOString(),
  });
}

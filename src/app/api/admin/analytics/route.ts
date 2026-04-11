import { NextResponse } from 'next/server';
import { mockAnalytics, mockDashboardMetrics } from '@/lib/mockData';

export async function GET() {
  return NextResponse.json({ analytics: mockAnalytics, metrics: mockDashboardMetrics });
}

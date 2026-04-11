import { NextResponse } from 'next/server';
import { MOCK_RATE_HISTORY } from '@/lib/mock-data';

export async function POST(request: Request) {
  const body = await request.json();
  const { productId, newRate, effectiveDate, reason, notes } = body;

  if (!productId || !newRate || !effectiveDate) {
    return NextResponse.json({ error: 'productId, newRate, and effectiveDate are required' }, { status: 400 });
  }

  const entry = {
    id: `rh${Date.now()}`,
    productId,
    productName: `Product ${productId}`,
    institution: 'Unknown',
    oldRate: 0,
    newRate: Number(newRate),
    effectiveDate,
    changedBy: 'admin',
    reason: reason ?? 'manual',
    notes: notes ?? '',
    createdAt: new Date().toISOString(),
  };

  // In production: update DB + create audit log
  return NextResponse.json({ entry }, { status: 201 });
}

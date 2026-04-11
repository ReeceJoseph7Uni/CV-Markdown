import { NextResponse } from 'next/server';
import { MOCK_RATE_HISTORY } from '@/lib/mock-data';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const productId = searchParams.get('productId');
  const history = productId
    ? MOCK_RATE_HISTORY.filter((r) => r.productId === productId)
    : MOCK_RATE_HISTORY;
  return NextResponse.json({ history, total: history.length });
}

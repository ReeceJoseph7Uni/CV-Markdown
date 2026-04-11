import { NextResponse } from 'next/server';
import { MOCK_SETTINGS } from '@/lib/mock-data';

export async function GET() {
  return NextResponse.json({ settings: MOCK_SETTINGS });
}

export async function PATCH(request: Request) {
  const body = await request.json();
  const updated = { ...MOCK_SETTINGS, ...body };
  // In production: persist to database
  return NextResponse.json({ settings: updated });
}

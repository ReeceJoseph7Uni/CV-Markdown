import { NextResponse } from 'next/server';
import { mockProducts } from '@/lib/mockData';

export async function GET() {
  return NextResponse.json({ products: mockProducts, total: mockProducts.length });
}

export async function POST(request: Request) {
  const body = await request.json() as Record<string, unknown>;
  return NextResponse.json(
    { success: true, product: { id: Date.now().toString(), ...body } },
    { status: 201 }
  );
}

import { NextResponse } from 'next/server';
import { MOCK_PRODUCTS } from '@/lib/mock-data';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');
  const status = searchParams.get('status');
  const category = searchParams.get('category');

  let products = [...MOCK_PRODUCTS];
  if (type) products = products.filter((p) => p.type === type);
  if (status) products = products.filter((p) => p.status === status);
  if (category) products = products.filter((p) => p.category === category);

  return NextResponse.json({ products, total: products.length });
}

export async function POST(request: Request) {
  const body = await request.json();
  const newProduct = {
    id: `p${Date.now()}`,
    ...body,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  // In production: save to database
  return NextResponse.json({ product: newProduct }, { status: 201 });
}

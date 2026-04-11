import { NextResponse } from 'next/server';
import { mockAdminUsers } from '@/lib/mockData';

export async function GET() {
  return NextResponse.json({ users: mockAdminUsers });
}

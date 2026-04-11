import { NextResponse } from 'next/server';
import { MOCK_DATA_SOURCES } from '@/lib/mock-data';

interface Props {
  params: Promise<{ id: string }>;
}

export async function POST(_req: Request, { params }: Props) {
  const { id } = await params;
  const source = MOCK_DATA_SOURCES.find((s) => s.id === id);
  if (!source) return NextResponse.json({ error: 'Source not found' }, { status: 404 });

  // In production: trigger async sync job
  const syncId = `sync_${Date.now()}`;
  return NextResponse.json({
    syncId,
    sourceId: id,
    status: 'started',
    message: `Sync triggered for ${source.name}`,
    startedAt: new Date().toISOString(),
  });
}

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Edit, Play, Eye } from 'lucide-react';
import { DataTable, Column } from '@/components/admin/DataTable';
import { Badge } from '@/components/admin/Badge';
import { MOCK_CALCULATORS } from '@/lib/mock-data';
import { Calculator, CalculatorStatus } from '@/lib/types';
import { formatDateTime } from '@/lib/utils';

const statusVariant: Record<CalculatorStatus, 'success' | 'warning' | 'neutral'> = {
  active: 'success',
  beta: 'warning',
  archived: 'neutral',
};

export default function CalculatorsPage() {
  const router = useRouter();

  const columns: Column<Calculator>[] = [
    {
      key: 'name',
      header: 'Calculator',
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-3">
          {row.featured && (
            <span className="text-yellow-500 text-xs font-bold">★</span>
          )}
          <div>
            <p className="font-medium text-gray-900">{row.name}</p>
            <p className="text-xs text-gray-500">{row.category} · /{row.slug}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (row) => <Badge variant={statusVariant[row.status]}>{row.status}</Badge>,
    },
    {
      key: 'usageToday',
      header: 'Today',
      sortable: true,
      render: (row) => <span className="text-gray-800">{row.usageToday}</span>,
    },
    {
      key: 'usageWeek',
      header: 'This Week',
      sortable: true,
      render: (row) => <span className="text-gray-800">{row.usageWeek.toLocaleString()}</span>,
    },
    {
      key: 'usageMonth',
      header: 'This Month',
      sortable: true,
      render: (row) => <span className="font-semibold text-gray-900">{row.usageMonth.toLocaleString()}</span>,
    },
    {
      key: 'taxYear',
      header: 'Tax Year',
      render: (row) => <Badge variant="neutral">{row.taxYear}</Badge>,
    },
    {
      key: 'lastModified',
      header: 'Last Modified',
      sortable: true,
      render: (row) => <span className="text-gray-500 text-sm">{formatDateTime(row.lastModified)}</span>,
    },
    {
      key: 'id',
      header: 'Actions',
      render: (row) => (
        <div className="flex items-center gap-1">
          <Link href={`/admin/calculators/${row.id}`} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded" title="Edit">
            <Edit className="h-4 w-4" />
          </Link>
          <button className="p-1.5 text-green-600 hover:bg-green-50 rounded" title="Run test suite">
            <Play className="h-4 w-4" />
          </button>
          <button className="p-1.5 text-gray-500 hover:bg-gray-100 rounded" title="Preview">
            <Eye className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total', value: MOCK_CALCULATORS.length, color: 'text-gray-900' },
          { label: 'Active', value: MOCK_CALCULATORS.filter((c) => c.status === 'active').length, color: 'text-green-600' },
          { label: 'Beta', value: MOCK_CALCULATORS.filter((c) => c.status === 'beta').length, color: 'text-yellow-600' },
          { label: 'Total Uses (Month)', value: MOCK_CALCULATORS.reduce((s, c) => s + c.usageMonth, 0).toLocaleString(), color: 'text-blue-600' },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-lg border border-gray-200 p-4 text-center shadow-sm">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-sm text-gray-500">{s.label}</p>
          </div>
        ))}
      </div>

      <DataTable<Calculator>
        data={MOCK_CALCULATORS}
        columns={columns}
        searchable
        searchKeys={['name', 'category', 'slug']}
        onRowClick={(row) => router.push(`/admin/calculators/${row.id}`)}
      />
    </div>
  );
}

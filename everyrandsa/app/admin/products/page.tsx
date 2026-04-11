'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Plus, Filter, Download, Edit, Archive, Eye } from 'lucide-react';
import { DataTable, Column } from '@/components/admin/DataTable';
import { Badge } from '@/components/admin/Badge';
import { MOCK_PRODUCTS } from '@/lib/mock-data';
import { Product, ProductStatus, ProductType } from '@/lib/types';
import { formatDate, formatPercent, formatCurrency } from '@/lib/utils';

const statusVariant: Record<ProductStatus, 'success' | 'warning' | 'danger'> = {
  active: 'success',
  archived: 'neutral' as never,
  review_needed: 'warning',
};

const typeLabel: Record<ProductType, string> = {
  savings: 'Savings',
  loan: 'Loan',
  investment: 'Investment',
};

export default function ProductsPage() {
  const router = useRouter();
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filtered = MOCK_PRODUCTS.filter((p) => {
    if (typeFilter !== 'all' && p.type !== typeFilter) return false;
    if (statusFilter !== 'all' && p.status !== statusFilter) return false;
    return true;
  });

  const columns: Column<Product>[] = [
    {
      key: 'name',
      header: 'Product',
      sortable: true,
      render: (row) => (
        <div>
          <p className="font-medium text-gray-900">{row.name}</p>
          <p className="text-xs text-gray-500">{row.institution}</p>
        </div>
      ),
    },
    {
      key: 'type',
      header: 'Type',
      sortable: true,
      render: (row) => (
        <Badge variant={row.type === 'savings' ? 'success' : row.type === 'loan' ? 'danger' : 'info'}>
          {typeLabel[row.type]}
        </Badge>
      ),
    },
    {
      key: 'category',
      header: 'Category',
      render: (row) => <span className="capitalize">{row.category.replace(/_/g, ' ')}</span>,
    },
    {
      key: 'interestRate',
      header: 'Rate',
      sortable: true,
      render: (row) => (
        <span className={row.isPromotional ? 'text-purple-700 font-semibold' : ''}>
          {formatPercent(row.interestRate)}
          {row.isPromotional && <span className="ml-1 text-xs">(promo)</span>}
        </span>
      ),
    },
    {
      key: 'monthlyFee',
      header: 'Monthly Fee',
      sortable: true,
      render: (row) => (row.monthlyFee === 0 ? <span className="text-green-600">Free</span> : formatCurrency(row.monthlyFee)),
    },
    {
      key: 'lastCheckedDate',
      header: 'Last Updated',
      sortable: true,
      render: (row) => <span className="text-gray-600">{formatDate(row.lastCheckedDate)}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (row) => (
        <Badge variant={row.status === 'active' ? 'success' : row.status === 'review_needed' ? 'warning' : 'neutral'}>
          {row.status.replace(/_/g, ' ')}
        </Badge>
      ),
    },
    {
      key: 'id',
      header: 'Actions',
      render: (row) => (
        <div className="flex items-center gap-1">
          <Link href={`/admin/products/${row.id}`} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded" title="Edit">
            <Edit className="h-4 w-4" />
          </Link>
          <button className="p-1.5 text-gray-500 hover:bg-gray-100 rounded" title="View on frontend">
            <Eye className="h-4 w-4" />
          </button>
          <button className="p-1.5 text-orange-500 hover:bg-orange-50 rounded" title="Archive">
            <Archive className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      {/* Filters & Actions bar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="h-4 w-4 text-gray-500" />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Types</option>
            <option value="savings">Savings</option>
            <option value="loan">Loans</option>
            <option value="investment">Investments</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="archived">Archived</option>
            <option value="review_needed">Review Needed</option>
          </select>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-1.5 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
            <Download className="h-4 w-4" />
            Export CSV
          </button>
          <Link
            href="/admin/products/new"
            className="flex items-center gap-2 px-4 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Product
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Products', value: filtered.length, color: 'text-gray-900' },
          { label: 'Active', value: filtered.filter((p) => p.status === 'active').length, color: 'text-green-600' },
          { label: 'Review Needed', value: filtered.filter((p) => p.status === 'review_needed').length, color: 'text-yellow-600' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-lg border border-gray-200 p-4 text-center shadow-sm">
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-sm text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>

      <DataTable<Product>
        data={filtered}
        columns={columns}
        searchable
        searchKeys={['name', 'institution', 'category']}
        onRowClick={(row) => router.push(`/admin/products/${row.id}`)}
        bulkActions={[
          { label: 'Mark Reviewed', action: (rows) => console.log('Reviewed', rows) },
          { label: 'Archive', action: (rows) => console.log('Archive', rows) },
          { label: 'Export Selected', action: (rows) => console.log('Export', rows) },
        ]}
      />
    </div>
  );
}

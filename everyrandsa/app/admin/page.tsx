'use client';

import {
  Package,
  TrendingUp,
  Calculator,
  AlertTriangle,
  CheckCircle,
  Clock,
  RefreshCw,
  Plus,
  Eye,
} from 'lucide-react';
import Link from 'next/link';
import { MetricCard } from '@/components/admin/MetricCard';
import { Badge } from '@/components/admin/Badge';
import { MOCK_DASHBOARD, MOCK_DATA_SOURCES, MOCK_RATE_HISTORY } from '@/lib/mock-data';
import { formatDateTime } from '@/lib/utils';

export default function AdminDashboardPage() {
  const metrics = MOCK_DASHBOARD;

  return (
    <div className="space-y-6">
      {/* System Health Banner */}
      {metrics.systemHealth === 'healthy' ? (
        <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-lg px-4 py-3">
          <CheckCircle className="h-5 w-5 text-green-600 shrink-0" />
          <span className="text-sm text-green-800 font-medium">All systems operational — last checked 2 minutes ago</span>
        </div>
      ) : (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
          <AlertTriangle className="h-5 w-5 text-red-600 shrink-0" />
          <span className="text-sm text-red-800 font-medium">System issues detected — please review alerts below</span>
        </div>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Products"
          value={metrics.totalProducts}
          subtitle={`Savings: ${metrics.productsByType.savings} · Loans: ${metrics.productsByType.loan} · Investments: ${metrics.productsByType.investment}`}
          icon={Package}
          variant="default"
        />
        <MetricCard
          title="Data Freshness"
          value={`${metrics.dataFreshnessPercent}%`}
          subtitle="Products updated in last 7 days"
          icon={RefreshCw}
          variant={metrics.dataFreshnessPercent >= 80 ? 'success' : metrics.dataFreshnessPercent >= 60 ? 'warning' : 'danger'}
        />
        <MetricCard
          title="Sync Failures"
          value={metrics.syncFailures}
          subtitle="Active data source errors"
          icon={AlertTriangle}
          variant={metrics.syncFailures === 0 ? 'success' : 'danger'}
        />
        <MetricCard
          title="This Month"
          value={`+${metrics.productsAddedThisMonth}`}
          subtitle={`Products added · ${metrics.ratesUpdatedThisMonth} rates updated`}
          icon={TrendingUp}
          variant="success"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
        <h2 className="text-base font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/products/new"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Product
          </Link>
          <Link
            href="/admin/rates"
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
          >
            <TrendingUp className="h-4 w-4" />
            Update Rates
          </Link>
          <Link
            href="/admin/sources"
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            Trigger Sync
          </Link>
          <Link
            href="/admin/analytics"
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Eye className="h-4 w-4" />
            View Analytics
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Data Source Status */}
        <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-gray-900">Data Source Status</h2>
            <Link href="/admin/sources" className="text-sm text-blue-600 hover:underline">Manage →</Link>
          </div>
          <div className="space-y-3">
            {MOCK_DATA_SOURCES.map((source) => {
              const syncStatus = source.lastSync?.status;
              return (
                <div key={source.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{source.name}</p>
                    <p className="text-xs text-gray-500 truncate">
                      Last sync: {source.lastSync ? formatDateTime(source.lastSync.timestamp) : 'Never'}
                    </p>
                  </div>
                  <div className="ml-3">
                    {syncStatus === 'success' && <Badge variant="success">✓ OK</Badge>}
                    {syncStatus === 'warning' && <Badge variant="warning">⚠ Warning</Badge>}
                    {syncStatus === 'failed' && <Badge variant="danger">✗ Failed</Badge>}
                    {syncStatus === 'running' && <Badge variant="info">↻ Running</Badge>}
                    {!syncStatus && <Badge variant="neutral">No sync</Badge>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Popular Calculators */}
        <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-gray-900">Popular Calculators (this month)</h2>
            <Link href="/admin/calculators" className="text-sm text-blue-600 hover:underline">Manage →</Link>
          </div>
          <div className="space-y-3">
            {metrics.popularCalculators.map((calc, idx) => {
              const maxUsage = metrics.popularCalculators[0].usage;
              const pct = Math.round((calc.usage / maxUsage) * 100);
              return (
                <div key={calc.name}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-700 flex items-center gap-1.5">
                      <Calculator className="h-3.5 w-3.5 text-gray-400" />
                      {calc.name}
                    </span>
                    <span className="text-sm font-semibold text-gray-900">{calc.usage.toLocaleString()}</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Rate Changes */}
        <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-gray-900">Recent Rate Changes</h2>
            <Link href="/admin/rates" className="text-sm text-blue-600 hover:underline">View all →</Link>
          </div>
          <div className="space-y-2">
            {MOCK_RATE_HISTORY.slice(0, 4).map((change) => (
              <div key={change.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <div>
                  <p className="text-sm font-medium text-gray-800">{change.productName}</p>
                  <p className="text-xs text-gray-500">{change.institution} · {change.effectiveDate}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">
                    <span className="text-red-500">{change.oldRate}%</span>
                    <span className="text-gray-400 mx-1">→</span>
                    <span className="text-green-600">{change.newRate}%</span>
                  </p>
                  <p className="text-xs text-gray-400">{change.changedBy}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Most Compared Products */}
        <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-gray-900">Most Compared Products</h2>
            <Link href="/admin/analytics" className="text-sm text-blue-600 hover:underline">Analytics →</Link>
          </div>
          <div className="space-y-3">
            {metrics.mostComparedProducts.map((prod, idx) => (
              <div key={prod.name} className="flex items-center gap-3 py-2 border-b border-gray-100 last:border-0">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-xs font-bold text-gray-600">
                  {idx + 1}
                </span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">{prod.name}</p>
                  <p className="text-xs text-gray-500">{prod.comparisons} comparisons</p>
                </div>
                <Clock className="h-4 w-4 text-gray-400" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

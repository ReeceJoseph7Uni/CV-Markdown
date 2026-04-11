'use client';

import { useState } from 'react';
import Header from '@/components/admin/Header';
import MetricCard from '@/components/admin/MetricCard';
import LineChart from '@/components/admin/charts/LineChart';
import { mockDashboardMetrics, mockAnalytics } from '@/lib/mockData';
import { formatDateTime, getDataFreshnessColor, cn } from '@/lib/utils';

const activityIcons: Record<string, string> = {
  rate_change: '📈',
  sync: '🔄',
  product_update: '🏦',
  alert: '⚠️',
};

export default function DashboardPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const metrics = mockDashboardMetrics;

  return (
    <div>
      <Header
        title="Dashboard"
        onMenuClick={() => setMenuOpen(!menuOpen)}
        actions={
          <button className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
            + Add Product
          </button>
        }
      />
      <div className="p-6 space-y-6">
        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Total Products"
            value={metrics.totalProducts}
            subtitle="Across all institutions"
            icon="🏦"
            colorClass="bg-blue-50 text-blue-600"
          />
          <MetricCard
            title="Last Sync"
            value="11 Apr 2026"
            subtitle={`Status: ${metrics.dataFreshness}`}
            icon="🔄"
            colorClass="bg-green-50 text-green-600"
          />
          <MetricCard
            title="Stale Products"
            value={metrics.staleProducts}
            subtitle="Need refresh"
            icon="⚠️"
            colorClass="bg-yellow-50 text-yellow-600"
          />
          <MetricCard
            title="Active Users"
            value={metrics.activeUsers}
            subtitle="Admin team members"
            icon="👥"
            colorClass="bg-purple-50 text-purple-600"
          />
        </div>

        {/* Traffic Chart */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Traffic — Last 30 Days</h2>
          <LineChart
            data={mockAnalytics.trafficOverTime}
            xKey="date"
            lines={[
              { key: 'visitors', color: '#3b82f6', name: 'Unique Visitors' },
              { key: 'pageViews', color: '#10b981', name: 'Page Views' },
            ]}
            height={280}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
            <ul className="space-y-3">
              {metrics.recentActivity.map((item) => (
                <li key={item.id} className="flex items-start gap-3">
                  <span className="text-xl mt-0.5">{activityIcons[item.type]}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-800">{item.description}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {item.user && `${item.user} · `}
                      {formatDateTime(item.timestamp)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Data Quality & Quick Actions */}
          <div className="space-y-4">
            {/* Data Freshness */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Data Freshness</h2>
              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    'px-3 py-1 rounded-full text-sm font-semibold capitalize',
                    getDataFreshnessColor(metrics.dataFreshness)
                  )}
                >
                  {metrics.dataFreshness}
                </span>
                <span className="text-sm text-gray-500">
                  Last sync: {formatDateTime(metrics.lastSyncAt)}
                </span>
              </div>
            </div>

            {/* Data Quality Issues */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Data Quality Issues</h2>
              <ul className="space-y-2">
                {metrics.dataQualityIssues.map((issue, i) => (
                  <li key={i} className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">{issue.description}</span>
                    <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-600">
                      {issue.count}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Quick Actions</h2>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: '🔄 Sync All', color: 'bg-blue-50 hover:bg-blue-100 text-blue-700' },
                  { label: '+ Add Product', color: 'bg-green-50 hover:bg-green-100 text-green-700' },
                  { label: '📊 Export CSV', color: 'bg-gray-50 hover:bg-gray-100 text-gray-700' },
                  { label: '🔍 Audit Log', color: 'bg-purple-50 hover:bg-purple-100 text-purple-700' },
                ].map((action) => (
                  <button
                    key={action.label}
                    className={cn(
                      'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                      action.color
                    )}
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Products by Type */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Products by Type</h2>
          <div className="flex flex-wrap gap-3">
            {metrics.productsByType.map((item) => (
              <div
                key={item.type}
                className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg border border-gray-200"
              >
                <span className="text-sm font-medium text-gray-700">{item.type}</span>
                <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">
                  {item.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

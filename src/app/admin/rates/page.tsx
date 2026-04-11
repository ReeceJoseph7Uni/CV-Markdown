'use client';

import { useState } from 'react';
import Header from '@/components/admin/Header';
import LineChart from '@/components/admin/charts/LineChart';
import { mockRateChanges, mockProducts } from '@/lib/mockData';
import { formatDateTime, formatPercentage } from '@/lib/utils';

// Generate 90-day mock rate trend data for a few products
const trendData = Array.from({ length: 90 }, (_, i) => ({
  date: new Date(Date.UTC(2026, 0, 11) + i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  FNB: 4.0 + (i >= 80 ? 0.25 : 0),
  Capitec: 7.0 + (i >= 84 ? 0.25 : 0),
  'Standard Bank': 8.75 + (i >= 80 ? 0.35 : 0),
}));

export default function RatesPage() {
  const [newRate, setNewRate] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [alertThreshold, setAlertThreshold] = useState('0.5');

  return (
    <div>
      <Header title="Rates & Pricing" onMenuClick={() => {}} />
      <div className="p-6 space-y-6">
        {/* Rate Trend Chart */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Rate Trends — Last 90 Days</h2>
          <LineChart
            data={trendData}
            xKey="date"
            lines={[
              { key: 'FNB', color: '#3b82f6', name: 'FNB Easy Account' },
              { key: 'Capitec', color: '#10b981', name: 'Capitec Global One' },
              { key: 'Standard Bank', color: '#f59e0b', name: 'Standard Bank Notice' },
            ]}
            height={280}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Quick Rate Update */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Rate Update</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product</label>
                <select
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a product...</option>
                  {mockProducts.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} — {formatPercentage(p.interestRate)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Rate (%)</label>
                <input
                  type="number"
                  step="0.01"
                  value={newRate}
                  onChange={(e) => setNewRate(e.target.value)}
                  placeholder="e.g. 7.50"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                <input
                  type="text"
                  placeholder="e.g. SARB repo rate change"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button className="w-full px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors font-medium">
                Update Rate
              </button>
            </div>
          </div>

          {/* Alert Configuration */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Alert Configuration</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Alert Threshold (% change)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={alertThreshold}
                  onChange={(e) => setAlertThreshold(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Send alert when rate changes by more than {alertThreshold}%
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Alert Email
                </label>
                <input
                  type="email"
                  defaultValue="admin@everyrands.co.za"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="slackAlert" defaultChecked className="w-4 h-4 rounded" />
                <label htmlFor="slackAlert" className="text-sm text-gray-700">
                  Send Slack notification
                </label>
              </div>
              <button className="w-full px-4 py-2 bg-gray-800 text-white text-sm rounded-lg hover:bg-gray-900 transition-colors font-medium">
                Save Alert Settings
              </button>
            </div>
          </div>
        </div>

        {/* Rate Change History */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Rate Change History</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {['Product', 'Institution', 'Old Rate', 'New Rate', 'Change', 'Changed By', 'Date', 'Reason'].map(
                    (h) => (
                      <th
                        key={h}
                        className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                      >
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {mockRateChanges.map((rc) => {
                  const delta = rc.newRate - rc.oldRate;
                  return (
                    <tr key={rc.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{rc.productName}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{rc.institution}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{formatPercentage(rc.oldRate)}</td>
                      <td className="px-4 py-3 text-sm font-semibold text-gray-900">{formatPercentage(rc.newRate)}</td>
                      <td className="px-4 py-3 text-sm font-semibold">
                        <span className={delta > 0 ? 'text-green-600' : 'text-red-600'}>
                          {delta > 0 ? '+' : ''}{formatPercentage(delta)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">{rc.changedBy}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">{formatDateTime(rc.changedAt)}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">{rc.reason ?? '—'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

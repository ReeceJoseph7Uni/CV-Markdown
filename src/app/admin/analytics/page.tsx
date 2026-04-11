'use client';

import Header from '@/components/admin/Header';
import BarChart from '@/components/admin/charts/BarChart';
import LineChart from '@/components/admin/charts/LineChart';
import PieChart from '@/components/admin/charts/PieChart';
import { mockAnalytics } from '@/lib/mockData';

export default function AnalyticsPage() {
  const { calculatorUsage, productViews, trafficOverTime, deviceBreakdown, profileUsage } =
    mockAnalytics;

  const pieData = deviceBreakdown.map((d) => ({ name: d.device, value: d.percentage }));

  // Sample every 5th day for readability
  const trafficSampled = trafficOverTime.filter((_, i) => i % 3 === 0);

  return (
    <div>
      <Header title="Analytics" onMenuClick={() => {}} />
      <div className="p-6 space-y-6">
        {/* Traffic Chart */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Traffic — Last 30 Days</h2>
          <LineChart
            data={trafficSampled}
            xKey="date"
            lines={[
              { key: 'visitors', color: '#3b82f6', name: 'Unique Visitors' },
              { key: 'pageViews', color: '#10b981', name: 'Page Views' },
            ]}
            height={280}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Calculator Usage */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Calculator Usage</h2>
            <BarChart
              data={calculatorUsage}
              xKey="name"
              bars={[{ key: 'uses', color: '#3b82f6', name: 'Uses' }]}
              layout="vertical"
              height={320}
            />
          </div>

          {/* Device Breakdown */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Device Breakdown</h2>
            <PieChart data={pieData} height={280} />
          </div>
        </div>

        {/* Profile Usage */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Comparison Profile Usage</h2>
          <BarChart
            data={profileUsage}
            xKey="name"
            bars={[{ key: 'uses', color: '#8b5cf6', name: 'Uses' }]}
            height={250}
          />
        </div>

        {/* Most Viewed Products */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Most Viewed Products</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {['Rank', 'Product', 'Institution', 'Views'].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {productViews.map((pv, idx) => (
                  <tr key={pv.name} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-bold text-gray-500">#{idx + 1}</td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{pv.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{pv.institution}</td>
                    <td className="px-4 py-3 text-sm text-gray-700 font-semibold">
                      {pv.views.toLocaleString('en-ZA')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

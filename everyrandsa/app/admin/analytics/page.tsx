'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { AlertTriangle, TrendingUp, Users, Activity } from 'lucide-react';
import { MetricCard } from '@/components/admin/MetricCard';
import { Badge } from '@/components/admin/Badge';
import { MOCK_DASHBOARD, MOCK_CALCULATORS } from '@/lib/mock-data';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#6366f1', '#14b8a6'];

// Synthetic trend data
const weeklyUsage = [
  { day: 'Mon', sessions: 1240, comparisons: 320 },
  { day: 'Tue', sessions: 1480, comparisons: 410 },
  { day: 'Wed', sessions: 1620, comparisons: 380 },
  { day: 'Thu', sessions: 1190, comparisons: 290 },
  { day: 'Fri', sessions: 1850, comparisons: 470 },
  { day: 'Sat', sessions: 920, comparisons: 210 },
  { day: 'Sun', sessions: 780, comparisons: 175 },
];

const dataQuality = [
  { name: 'Verified', value: 5 },
  { name: 'Unverified', value: 2 },
];

export default function AnalyticsPage() {
  const calcUsage = MOCK_CALCULATORS.map((c) => ({
    name: c.name.replace('/ ', '/\n'),
    month: c.usageMonth,
    week: c.usageWeek,
    today: c.usageToday,
  }));

  const alerts = [
    { level: 'warning', message: 'Absa Rate Feed API key has expired — sync is failing.' },
    { level: 'info', message: 'FNB product feed had a timeout on page 4 during last sync.' },
    { level: 'info', message: 'Capitec Global One last verified 27 days ago — review due.' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Products"
          value={MOCK_DASHBOARD.totalProducts}
          subtitle="In database"
          icon={TrendingUp}
          trend={{ value: 2, label: 'this month' }}
        />
        <MetricCard
          title="Data Freshness"
          value={`${MOCK_DASHBOARD.dataFreshnessPercent}%`}
          subtitle="Updated in 7 days"
          icon={Activity}
          variant={MOCK_DASHBOARD.dataFreshnessPercent >= 80 ? 'success' : 'warning'}
        />
        <MetricCard
          title="Monthly Calc Uses"
          value={MOCK_CALCULATORS.reduce((s, c) => s + c.usageMonth, 0).toLocaleString()}
          subtitle="Across all calculators"
          icon={Users}
          trend={{ value: 8, label: 'vs last month' }}
          variant="success"
        />
        <MetricCard
          title="Sync Failures"
          value={MOCK_DASHBOARD.syncFailures}
          subtitle="Active source errors"
          icon={AlertTriangle}
          variant={MOCK_DASHBOARD.syncFailures > 0 ? 'danger' : 'success'}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calculator Usage Bar Chart */}
        <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Calculator Usage (this month)</h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={calcUsage} margin={{ top: 5, right: 10, left: 0, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} angle={-35} textAnchor="end" interval={0} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="month" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Monthly Uses" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Weekly Session Trend */}
        <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Weekly Traffic (last 7 days)</h2>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={weeklyUsage} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="sessions" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} name="Sessions" />
              <Line type="monotone" dataKey="comparisons" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} name="Comparisons" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Data Quality Pie */}
        <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Data Verification Status</h2>
          <div className="flex items-center gap-4">
            <ResponsiveContainer width="50%" height={200}>
              <PieChart>
                <Pie data={dataQuality} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                  {dataQuality.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2">
              {dataQuality.map((item, idx) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full" style={{ backgroundColor: COLORS[idx] }} />
                  <span className="text-sm text-gray-700">{item.name}</span>
                  <span className="text-sm font-semibold text-gray-900">{item.value}</span>
                </div>
              ))}
              <div className="pt-2 text-sm text-gray-500">
                {Math.round((5 / 7) * 100)}% of products verified
              </div>
            </div>
          </div>
        </div>

        {/* Alerts Panel */}
        <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Active Alerts</h2>
          <div className="space-y-3">
            {alerts.map((alert, idx) => (
              <div
                key={idx}
                className={`flex items-start gap-3 p-3 rounded-lg border ${alert.level === 'warning' ? 'bg-red-50 border-red-200' : 'bg-yellow-50 border-yellow-200'}`}
              >
                <AlertTriangle className={`h-4 w-4 mt-0.5 shrink-0 ${alert.level === 'warning' ? 'text-red-600' : 'text-yellow-600'}`} />
                <p className={`text-sm ${alert.level === 'warning' ? 'text-red-800' : 'text-yellow-800'}`}>{alert.message}</p>
                <Badge variant={alert.level === 'warning' ? 'danger' : 'warning'} className="ml-auto shrink-0">
                  {alert.level}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Most Compared Products */}
      <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
        <h2 className="text-base font-semibold text-gray-900 mb-4">Most Compared Products</h2>
        <div className="space-y-2">
          {MOCK_DASHBOARD.mostComparedProducts.map((prod, idx) => (
            <div key={prod.name} className="flex items-center gap-4">
              <span className="text-sm font-bold text-gray-400 w-5">{idx + 1}</span>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-800">{prod.name}</span>
                  <span className="text-sm text-gray-600">{prod.comparisons} comparisons</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-purple-500 rounded-full"
                    style={{ width: `${(prod.comparisons / MOCK_DASHBOARD.mostComparedProducts[0].comparisons) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

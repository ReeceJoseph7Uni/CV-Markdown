'use client';

import { useState } from 'react';
import { TrendingUp, Upload, History, Save, AlertTriangle } from 'lucide-react';
import { DataTable, Column } from '@/components/admin/DataTable';
import { Badge } from '@/components/admin/Badge';
import { MOCK_PRODUCTS, MOCK_RATE_HISTORY } from '@/lib/mock-data';
import { RateHistory } from '@/lib/types';
import { formatDate, formatDateTime, daysSince } from '@/lib/utils';

export default function RatesPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'update' | 'import' | 'history'>('overview');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [newRate, setNewRate] = useState('');
  const [effectiveDate, setEffectiveDate] = useState(new Date().toISOString().split('T')[0]);
  const [reason, setReason] = useState('');
  const [notes, setNotes] = useState('');
  const [saved, setSaved] = useState(false);

  const outdated = MOCK_PRODUCTS.filter((p) => daysSince(p.lastCheckedDate) > 30);

  const handleSingleUpdate = () => {
    if (!selectedProduct || !newRate) return;
    console.log('Rate update:', { selectedProduct, newRate, effectiveDate, reason, notes });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const historyColumns: Column<RateHistory>[] = [
    {
      key: 'productName',
      header: 'Product',
      sortable: true,
      render: (row) => (
        <div>
          <p className="font-medium text-gray-900">{row.productName}</p>
          <p className="text-xs text-gray-500">{row.institution}</p>
        </div>
      ),
    },
    {
      key: 'effectiveDate',
      header: 'Effective Date',
      sortable: true,
      render: (row) => formatDate(row.effectiveDate),
    },
    {
      key: 'oldRate',
      header: 'Previous Rate',
      sortable: true,
      render: (row) => <span className="text-red-600">{row.oldRate}%</span>,
    },
    {
      key: 'newRate',
      header: 'New Rate',
      sortable: true,
      render: (row) => <span className="text-green-600 font-semibold">{row.newRate}%</span>,
    },
    {
      key: 'changedBy',
      header: 'Changed By',
      render: (row) => row.changedBy,
    },
    {
      key: 'reason',
      header: 'Reason',
      render: (row) => <Badge variant="neutral">{row.reason}</Badge>,
    },
    {
      key: 'notes',
      header: 'Notes',
      render: (row) => <span className="text-gray-500 text-sm">{row.notes}</span>,
    },
    {
      key: 'createdAt',
      header: 'Logged At',
      render: (row) => formatDateTime(row.createdAt),
    },
  ];

  const tabs = [
    { id: 'overview', label: 'Rate Overview', icon: TrendingUp },
    { id: 'update', label: 'Update Rate', icon: Save },
    { id: 'import', label: 'Bulk Import', icon: Upload },
    { id: 'history', label: 'History & Audit', icon: History },
  ] as const;

  const fieldClass = 'w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500';
  const labelClass = 'block text-sm font-medium text-gray-700 mb-1';

  return (
    <div className="space-y-5">
      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-lg p-1 w-fit flex-wrap">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-3 py-1.5 text-sm rounded-md font-medium transition-colors ${activeTab === id ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Outdated alert */}
      {outdated.length > 0 && activeTab === 'overview' && (
        <div className="flex items-center gap-3 bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-3">
          <AlertTriangle className="h-5 w-5 text-yellow-600 shrink-0" />
          <span className="text-sm text-yellow-800">
            <strong>{outdated.length} product(s)</strong> have rates older than 30 days and may need updating.
          </span>
        </div>
      )}

      {/* Rate Overview */}
      {activeTab === 'overview' && (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">Current Rates</h3>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                {['Product', 'Institution', 'Rate', 'Type', 'Last Updated', 'Age', 'Status'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left font-semibold text-gray-600">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {MOCK_PRODUCTS.map((p) => {
                const age = daysSince(p.lastCheckedDate);
                return (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{p.name}</td>
                    <td className="px-4 py-3 text-gray-600">{p.institution}</td>
                    <td className="px-4 py-3 font-semibold">
                      {p.interestRate}%
                      {p.isPromotional && <Badge variant="info" className="ml-2">promo</Badge>}
                    </td>
                    <td className="px-4 py-3 capitalize text-gray-600">{p.rateType}</td>
                    <td className="px-4 py-3 text-gray-600">{formatDate(p.lastCheckedDate)}</td>
                    <td className="px-4 py-3">
                      <span className={age > 30 ? 'text-red-600 font-semibold' : age > 14 ? 'text-yellow-600' : 'text-green-600'}>
                        {age}d
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={age > 30 ? 'danger' : age > 14 ? 'warning' : 'success'}>
                        {age > 30 ? 'Outdated' : age > 14 ? 'Ageing' : 'Current'}
                      </Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Single Rate Update */}
      {activeTab === 'update' && (
        <div className="max-w-lg bg-white rounded-lg border border-gray-200 p-6 shadow-sm space-y-4">
          <h3 className="font-semibold text-gray-900">Update Single Rate</h3>
          <div>
            <label className={labelClass}>Product *</label>
            <select value={selectedProduct} onChange={(e) => setSelectedProduct(e.target.value)} className={fieldClass}>
              <option value="">Select product…</option>
              {MOCK_PRODUCTS.map((p) => (
                <option key={p.id} value={p.id}>{p.name} – {p.institution} ({p.interestRate}%)</option>
              ))}
            </select>
          </div>
          {selectedProduct && (
            <div className="bg-blue-50 rounded-lg p-3 text-sm text-blue-800">
              Current rate: <strong>{MOCK_PRODUCTS.find((p) => p.id === selectedProduct)?.interestRate}%</strong>
            </div>
          )}
          <div>
            <label className={labelClass}>New Rate (%) *</label>
            <input type="number" step="0.01" min="0" max="100" value={newRate} onChange={(e) => setNewRate(e.target.value)} className={fieldClass} placeholder="e.g. 5.25" />
          </div>
          <div>
            <label className={labelClass}>Effective Date *</label>
            <input type="date" value={effectiveDate} onChange={(e) => setEffectiveDate(e.target.value)} className={fieldClass} />
          </div>
          <div>
            <label className={labelClass}>Reason</label>
            <select value={reason} onChange={(e) => setReason(e.target.value)} className={fieldClass}>
              <option value="">Select reason…</option>
              <option value="market_change">Market / SARB rate change</option>
              <option value="promo">Promotional rate</option>
              <option value="correction">Data correction</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Notes</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} className={`${fieldClass} resize-none`} rows={2} />
          </div>
          <button
            onClick={handleSingleUpdate}
            disabled={!selectedProduct || !newRate}
            className="flex items-center gap-2 px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Save className="h-4 w-4" />
            Save & Log Rate Change
          </button>
          {saved && <p className="text-sm text-green-600 font-medium">✓ Rate updated and logged</p>}
        </div>
      )}

      {/* Bulk Import */}
      {activeTab === 'import' && (
        <div className="max-w-2xl space-y-5">
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm space-y-4">
            <h3 className="font-semibold text-gray-900">Bulk Rate Import</h3>
            <p className="text-sm text-gray-600">Upload a CSV file to update multiple rates at once. Download the template to get started.</p>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                Download CSV Template
              </button>
            </div>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Upload className="h-8 w-8 text-gray-400 mx-auto mb-3" />
              <p className="text-sm font-medium text-gray-700">Drop CSV file here or click to browse</p>
              <p className="text-xs text-gray-400 mt-1">Required columns: Product ID, New Rate, Effective Date, Reason</p>
              <input type="file" accept=".csv" className="hidden" />
              <button className="mt-3 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Choose File
              </button>
            </div>
          </div>
          <div className="bg-blue-50 rounded-lg border border-blue-200 p-4">
            <h4 className="text-sm font-semibold text-blue-900 mb-2">CSV Format</h4>
            <code className="text-xs text-blue-800 block font-mono whitespace-pre">
              {`product_id,new_rate,effective_date,reason\np1,4.75,2026-04-15,market_change\np3,7.00,2026-04-15,market_change`}
            </code>
          </div>
        </div>
      )}

      {/* History */}
      {activeTab === 'history' && (
        <DataTable<RateHistory>
          data={MOCK_RATE_HISTORY}
          columns={historyColumns}
          searchable
          searchKeys={['productName', 'institution', 'changedBy']}
        />
      )}
    </div>
  );
}

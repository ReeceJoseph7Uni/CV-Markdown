'use client';

import { useState } from 'react';
import Header from '@/components/admin/Header';
import { mockDataSources, mockSyncLogs } from '@/lib/mockData';
import { formatDateTime, getSyncStatusColor, cn } from '@/lib/utils';
import type { DataSourceConfig } from '@/types/admin';

export default function DataSourcesPage() {
  const [sources, setSources] = useState<DataSourceConfig[]>(mockDataSources);
  const [syncing, setSyncing] = useState<string | null>(null);

  const handleSync = (id: string) => {
    setSyncing(id);
    setTimeout(() => setSyncing(null), 2000);
  };

  const toggleActive = (id: string) => {
    setSources((prev) =>
      prev.map((s) => (s.id === id ? { ...s, isActive: !s.isActive } : s))
    );
  };

  return (
    <div>
      <Header
        title="Data Sources"
        onMenuClick={() => {}}
        actions={
          <button className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
            + Add Source
          </button>
        }
      />
      <div className="p-6 space-y-6">
        {/* Data Source Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {sources.map((source) => (
            <div
              key={source.id}
              className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm flex flex-col gap-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">{source.name}</h3>
                  <span className="text-xs text-gray-500">{source.type.replace('_', ' ')}</span>
                </div>
                <button
                  onClick={() => toggleActive(source.id)}
                  className={cn(
                    'shrink-0 px-2 py-0.5 rounded-full text-xs font-semibold transition-colors',
                    source.isActive
                      ? 'bg-green-100 text-green-700 hover:bg-green-200'
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  )}
                >
                  {source.isActive ? 'Active' : 'Inactive'}
                </button>
              </div>

              {source.endpoint && (
                <p className="text-xs text-gray-500 truncate" title={source.endpoint}>
                  🔗 {source.endpoint}
                </p>
              )}

              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">Last sync:</span>
                {source.lastSyncAt ? (
                  <span
                    className={cn(
                      'px-2 py-0.5 rounded-full text-xs font-semibold',
                      getSyncStatusColor(source.lastSyncStatus)
                    )}
                  >
                    {source.lastSyncStatus}
                  </span>
                ) : (
                  <span className="text-xs text-gray-400">Never</span>
                )}
              </div>

              {source.lastSyncAt && (
                <p className="text-xs text-gray-400">
                  {formatDateTime(source.lastSyncAt)}
                </p>
              )}

              <p className="text-xs text-gray-500">
                Schedule: <span className="font-mono">{source.refreshSchedule}</span>
              </p>

              {source.nextScheduledSync && (
                <p className="text-xs text-gray-500">
                  Next: {formatDateTime(source.nextScheduledSync)}
                </p>
              )}

              <div className="flex gap-2 mt-auto pt-3 border-t border-gray-100">
                <button
                  onClick={() => handleSync(source.id)}
                  disabled={syncing === source.id}
                  className="flex-1 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium hover:bg-blue-100 transition-colors disabled:opacity-50"
                >
                  {syncing === source.id ? '⏳ Syncing...' : '🔄 Sync Now'}
                </button>
                <button className="flex-1 px-3 py-1.5 bg-gray-50 text-gray-600 rounded-lg text-xs font-medium hover:bg-gray-100 transition-colors">
                  ⚙️ Configure
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Sync History */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Sync History</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {['Source', 'Started', 'Duration', 'Status', 'Processed', 'Updated', 'Errors'].map(
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
                {mockSyncLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{log.sourceName}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{formatDateTime(log.startedAt)}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {log.duration != null ? `${log.duration}s` : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          'px-2 py-0.5 rounded-full text-xs font-semibold capitalize',
                          getSyncStatusColor(log.status)
                        )}
                      >
                        {log.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">{log.recordsProcessed}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{log.recordsUpdated}</td>
                    <td className="px-4 py-3">
                      {log.errors.length > 0 ? (
                        <div className="space-y-1">
                          {log.errors.map((e, i) => (
                            <p key={i} className="text-xs text-red-600 max-w-xs truncate" title={e}>
                              {e}
                            </p>
                          ))}
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">None</span>
                      )}
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

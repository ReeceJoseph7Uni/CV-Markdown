'use client';

import { useState } from 'react';
import { RefreshCw, AlertTriangle, CheckCircle, XCircle, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import { Badge } from '@/components/admin/Badge';
import { MOCK_DATA_SOURCES } from '@/lib/mock-data';
import { DataSource, SyncStatus } from '@/lib/types';
import { formatDateTime } from '@/lib/utils';

const statusIcon: Record<SyncStatus, React.ReactNode> = {
  success: <CheckCircle className="h-4 w-4 text-green-600" />,
  warning: <AlertTriangle className="h-4 w-4 text-yellow-600" />,
  failed: <XCircle className="h-4 w-4 text-red-600" />,
  running: <RefreshCw className="h-4 w-4 text-blue-600 animate-spin" />,
};

const statusBadge: Record<SyncStatus, 'success' | 'warning' | 'danger' | 'info'> = {
  success: 'success',
  warning: 'warning',
  failed: 'danger',
  running: 'info',
};

export default function SourcesPage() {
  const [sources, setSources] = useState(MOCK_DATA_SOURCES);
  const [syncing, setSyncing] = useState<Set<string>>(new Set());
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const triggerSync = (sourceId: string) => {
    setSyncing((prev) => new Set([...prev, sourceId]));
    setTimeout(() => {
      setSyncing((prev) => { const n = new Set(prev); n.delete(sourceId); return n; });
    }, 3000);
  };

  const toggleExpand = (id: string) => {
    setExpanded((prev) => {
      const n = new Set(prev);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });
  };

  const fieldClass = 'w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500';
  const labelClass = 'block text-sm font-medium text-gray-700 mb-1';

  return (
    <div className="space-y-5">
      {/* Alert for failures */}
      {sources.some((s) => s.lastSync?.status === 'failed') && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
          <AlertTriangle className="h-5 w-5 text-red-600 shrink-0" />
          <span className="text-sm text-red-800">
            One or more data sources have sync failures. Please investigate.
          </span>
        </div>
      )}

      {/* Summary bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Sources', value: sources.length, color: 'text-gray-900' },
          { label: 'Active', value: sources.filter((s) => s.isActive).length, color: 'text-green-600' },
          { label: 'Failures', value: sources.filter((s) => s.lastSync?.status === 'failed').length, color: 'text-red-600' },
          { label: 'Warnings', value: sources.filter((s) => s.lastSync?.status === 'warning').length, color: 'text-yellow-600' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-lg border border-gray-200 p-4 text-center shadow-sm">
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-sm text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Source Cards */}
      <div className="space-y-4">
        {sources.map((source) => {
          const isRunning = syncing.has(source.id);
          const syncStatus = isRunning ? 'running' : source.lastSync?.status;
          const isExpanded = expanded.has(source.id);

          return (
            <div key={source.id} className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4">
                <div className="flex items-center gap-3">
                  {syncStatus && statusIcon[syncStatus]}
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-gray-900">{source.name}</p>
                      <Badge variant="neutral">{source.type}</Badge>
                      {!source.isActive && <Badge variant="danger">Inactive</Badge>}
                    </div>
                    <p className="text-xs text-gray-500 truncate max-w-xs">{source.endpoint}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {syncStatus && (
                    <Badge variant={statusBadge[syncStatus]}>
                      {isRunning ? 'Running…' : syncStatus}
                    </Badge>
                  )}
                  <button
                    onClick={() => triggerSync(source.id)}
                    disabled={isRunning}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                  >
                    <RefreshCw className={`h-4 w-4 ${isRunning ? 'animate-spin' : ''}`} />
                    {isRunning ? 'Syncing…' : 'Sync Now'}
                  </button>
                  <button
                    onClick={() => toggleExpand(source.id)}
                    className="p-1.5 rounded hover:bg-gray-100 transition-colors"
                  >
                    {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Last sync stats */}
              {source.lastSync && (
                <div className="px-5 pb-3 flex flex-wrap gap-6 text-sm text-gray-600 border-t border-gray-100">
                  <div className="flex items-center gap-1.5 mt-3">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span>Last: {formatDateTime(source.lastSync.timestamp)}</span>
                  </div>
                  <div className="mt-3">
                    <span className="text-green-600 font-medium">+{source.lastSync.recordsAdded} added</span>
                    <span className="mx-2 text-gray-300">|</span>
                    <span className="text-blue-600 font-medium">{source.lastSync.recordsUpdated} updated</span>
                    <span className="mx-2 text-gray-300">|</span>
                    <span>{source.lastSync.recordsProcessed} total</span>
                  </div>
                  {source.lastSync.errors.length > 0 && (
                    <div className="mt-3 w-full">
                      {source.lastSync.errors.map((err, i) => (
                        <p key={i} className="text-xs text-red-600 bg-red-50 rounded px-2 py-1 mb-1">{err}</p>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Expanded config */}
              {isExpanded && (
                <div className="border-t border-gray-200 px-5 py-4 bg-gray-50 space-y-4">
                  <h4 className="font-semibold text-gray-800">Source Configuration</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Source Name</label>
                      <input className={fieldClass} defaultValue={source.name} />
                    </div>
                    <div>
                      <label className={labelClass}>Source Type</label>
                      <select className={fieldClass} defaultValue={source.type}>
                        <option value="api">API</option>
                        <option value="manual">Manual</option>
                        <option value="scraping">Scraping</option>
                      </select>
                    </div>
                    <div className="sm:col-span-2">
                      <label className={labelClass}>Endpoint / URL</label>
                      <input className={fieldClass} defaultValue={source.endpoint} />
                    </div>
                    <div>
                      <label className={labelClass}>API Key (masked)</label>
                      <input type="password" className={fieldClass} placeholder="••••••••••••" />
                    </div>
                    <div>
                      <label className={labelClass}>Refresh Frequency</label>
                      <select className={fieldClass} defaultValue={source.refreshFrequency}>
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                        <option value="manual">Manual Only</option>
                      </select>
                    </div>
                    {source.nextScheduledSync && (
                      <div>
                        <label className={labelClass}>Next Scheduled Sync</label>
                        <p className="text-sm text-gray-700 py-2">{formatDateTime(source.nextScheduledSync)}</p>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <button className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      Save Changes
                    </button>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" id={`active-${source.id}`} defaultChecked={source.isActive} className="rounded border-gray-300" />
                      <label htmlFor={`active-${source.id}`} className="text-sm font-medium text-gray-700">Active</label>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

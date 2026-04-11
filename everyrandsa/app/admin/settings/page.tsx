'use client';

import { useState } from 'react';
import { Save, Plus, X } from 'lucide-react';
import { MOCK_SETTINGS } from '@/lib/mock-data';
import { SystemSettings } from '@/lib/types';

export default function SettingsPage() {
  const [settings, setSettings] = useState<SystemSettings>(MOCK_SETTINGS);
  const [saved, setSaved] = useState(false);
  const [newRecipient, setNewRecipient] = useState('');

  const handleSave = () => {
    console.log('Settings saved:', settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const addRecipient = () => {
    if (!newRecipient || settings.alertRecipients.includes(newRecipient)) return;
    setSettings((s) => ({ ...s, alertRecipients: [...s.alertRecipients, newRecipient] }));
    setNewRecipient('');
  };

  const removeRecipient = (email: string) => {
    setSettings((s) => ({ ...s, alertRecipients: s.alertRecipients.filter((r) => r !== email) }));
  };

  const fieldClass = 'w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500';
  const labelClass = 'block text-sm font-medium text-gray-700 mb-1';

  return (
    <div className="max-w-2xl space-y-6">
      {/* System Settings */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm space-y-4">
        <h3 className="font-semibold text-gray-900">System Settings</h3>
        <div>
          <label className={labelClass}>Site Title</label>
          <input
            className={fieldClass}
            value={settings.siteTitle}
            onChange={(e) => setSettings((s) => ({ ...s, siteTitle: e.target.value }))}
          />
        </div>
        <div>
          <label className={labelClass}>Site Description</label>
          <textarea
            className={`${fieldClass} resize-none`}
            rows={2}
            value={settings.siteDescription}
            onChange={(e) => setSettings((s) => ({ ...s, siteDescription: e.target.value }))}
          />
        </div>
        <div>
          <label className={labelClass}>Contact Email</label>
          <input
            type="email"
            className={fieldClass}
            value={settings.contactEmail}
            onChange={(e) => setSettings((s) => ({ ...s, contactEmail: e.target.value }))}
          />
        </div>
        {/* Alert recipients */}
        <div>
          <label className={labelClass}>Alert Email Recipients</label>
          <div className="space-y-2 mb-2">
            {settings.alertRecipients.map((email) => (
              <div key={email} className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
                <span className="flex-1 text-sm text-gray-800">{email}</span>
                <button onClick={() => removeRecipient(email)} className="text-gray-400 hover:text-red-600">
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="email"
              className={fieldClass}
              placeholder="Add email address…"
              value={newRecipient}
              onChange={(e) => setNewRecipient(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addRecipient()}
            />
            <button onClick={addRecipient} className="flex items-center gap-1 px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
              <Plus className="h-4 w-4" /> Add
            </button>
          </div>
        </div>
      </div>

      {/* Data Settings */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm space-y-4">
        <h3 className="font-semibold text-gray-900">Data Settings</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Default Refresh Frequency</label>
            <select
              className={fieldClass}
              value={settings.defaultRefreshFrequency}
              onChange={(e) => setSettings((s) => ({ ...s, defaultRefreshFrequency: e.target.value as SystemSettings['defaultRefreshFrequency'] }))}
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="manual">Manual</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Data Retention (days)</label>
            <input
              type="number"
              min={30}
              className={fieldClass}
              value={settings.dataRetentionDays}
              onChange={(e) => setSettings((s) => ({ ...s, dataRetentionDays: Number(e.target.value) }))}
            />
          </div>
          <div>
            <label className={labelClass}>Rate Change Alert Threshold (%)</label>
            <input
              type="number"
              min={1}
              max={100}
              className={fieldClass}
              value={settings.rateChangeSensitivity}
              onChange={(e) => setSettings((s) => ({ ...s, rateChangeSensitivity: Number(e.target.value) }))}
            />
            <p className="text-xs text-gray-500 mt-1">Alert when rate changes by more than this %</p>
          </div>
          <div>
            <label className={labelClass}>Auto-archive threshold (days)</label>
            <input
              type="number"
              min={30}
              className={fieldClass}
              value={settings.autoArchiveThresholdDays}
              onChange={(e) => setSettings((s) => ({ ...s, autoArchiveThresholdDays: Number(e.target.value) }))}
            />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="autoArchive"
            checked={settings.autoArchiveOutdated}
            onChange={(e) => setSettings((s) => ({ ...s, autoArchiveOutdated: e.target.checked }))}
            className="rounded border-gray-300"
          />
          <label htmlFor="autoArchive" className="text-sm font-medium text-gray-700">
            Auto-archive outdated products
          </label>
        </div>
      </div>

      {/* Email Templates placeholder */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm space-y-4">
        <h3 className="font-semibold text-gray-900">Email Templates</h3>
        <div>
          <label className={labelClass}>Alert Email Template</label>
          <textarea
            className={`${fieldClass} resize-none font-mono text-xs`}
            rows={6}
            defaultValue={`Subject: [EveryRandSA Alert] {{alert_type}}

Hello,

An alert has been triggered on EveryRandSA:

{{alert_message}}

Timestamp: {{timestamp}}
Action required: {{action}}

— EveryRandSA System`}
          />
        </div>
        <button className="px-4 py-2 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
          Send Test Email
        </button>
      </div>

      {/* Save */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-5 py-2.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Save className="h-4 w-4" />
          Save Settings
        </button>
        {saved && <span className="text-sm text-green-600 font-medium">✓ Settings saved</span>}
      </div>
    </div>
  );
}

'use client';

import { use, useState } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Play, CheckCircle, XCircle, Save } from 'lucide-react';
import { Badge } from '@/components/admin/Badge';
import { MOCK_CALCULATORS } from '@/lib/mock-data';
import { formatDateTime } from '@/lib/utils';

interface Props {
  params: Promise<{ id: string }>;
}

export default function CalculatorDetailPage({ params }: Props) {
  const { id } = use(params);
  const calculator = MOCK_CALCULATORS.find((c) => c.id === id);
  if (!calculator) notFound();

  const [activeTab, setActiveTab] = useState<'config' | 'formula' | 'tests' | 'docs'>('config');
  const [testResults, setTestResults] = useState<Record<string, boolean> | null>(null);
  const [saved, setSaved] = useState(false);

  const runTests = () => {
    const results: Record<string, boolean> = {};
    calculator.testCases.forEach((tc) => {
      results[tc.id] = Math.random() > 0.1;
    });
    setTestResults(results);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const tabs = [
    { id: 'config', label: 'Configuration' },
    { id: 'formula', label: 'Formula & Logic' },
    { id: 'tests', label: 'Test Cases' },
    { id: 'docs', label: 'Documentation' },
  ] as const;

  const fieldClass = 'w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500';
  const labelClass = 'block text-sm font-medium text-gray-700 mb-1';

  return (
    <div className="max-w-4xl space-y-6">
      {/* Back + header */}
      <div className="flex items-start justify-between">
        <div>
          <Link href="/admin/calculators" className="flex items-center gap-1 text-sm text-blue-600 hover:underline mb-2">
            <ArrowLeft className="h-4 w-4" /> Back to Calculators
          </Link>
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-semibold text-gray-900">{calculator.name}</h2>
            <Badge variant={calculator.status === 'active' ? 'success' : calculator.status === 'beta' ? 'warning' : 'neutral'}>
              {calculator.status}
            </Badge>
            {calculator.featured && <Badge variant="info">⭐ Featured</Badge>}
          </div>
          <p className="text-sm text-gray-500 mt-1">{calculator.description}</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={runTests} className="flex items-center gap-2 px-3 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            <Play className="h-4 w-4" /> Run Tests
          </button>
          <button onClick={handleSave} className="flex items-center gap-2 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Save className="h-4 w-4" /> Save
          </button>
        </div>
      </div>

      {saved && <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-2 text-sm text-green-800">✓ Changes saved</div>}

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-lg p-1 w-fit flex-wrap">
        {tabs.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`px-3 py-1.5 text-sm rounded-md font-medium transition-colors ${activeTab === id ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Configuration */}
      {activeTab === 'config' && (
        <div className="space-y-5">
          <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm space-y-4">
            <h3 className="font-semibold text-gray-900">Basic Info</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Calculator Name</label>
                <input className={fieldClass} defaultValue={calculator.name} />
              </div>
              <div>
                <label className={labelClass}>URL Slug</label>
                <input className={fieldClass} defaultValue={calculator.slug} />
              </div>
              <div>
                <label className={labelClass}>Category</label>
                <input className={fieldClass} defaultValue={calculator.category} />
              </div>
              <div>
                <label className={labelClass}>Status</label>
                <select className={fieldClass} defaultValue={calculator.status}>
                  <option value="active">Active</option>
                  <option value="beta">Beta</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Tax Year</label>
                <input type="number" className={fieldClass} defaultValue={calculator.taxYear} />
              </div>
              <div className="flex items-center gap-3 pt-6">
                <input type="checkbox" id="featured" defaultChecked={calculator.featured} className="rounded border-gray-300" />
                <label htmlFor="featured" className={labelClass.replace('mb-1', '')}>Featured</label>
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass}>Description</label>
                <textarea className={`${fieldClass} resize-none`} rows={2} defaultValue={calculator.description} />
              </div>
            </div>
          </div>

          {/* Inputs */}
          <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4">Input Configuration</h3>
            <div className="space-y-3">
              {calculator.inputs.map((input) => (
                <div key={input.id} className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 bg-gray-50 rounded-lg">
                  <div>
                    <label className="text-xs font-medium text-gray-500">Variable</label>
                    <input className={fieldClass} defaultValue={input.name} />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500">Label</label>
                    <input className={fieldClass} defaultValue={input.label} />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500">Type</label>
                    <select className={fieldClass} defaultValue={input.type}>
                      {['text', 'number', 'currency', 'percentage', 'date', 'select', 'slider'].map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500">Required</label>
                    <select className={fieldClass} defaultValue={input.required ? 'yes' : 'no'}>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Outputs */}
          <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4">Output Configuration</h3>
            <div className="space-y-3">
              {calculator.outputs.map((output) => (
                <div key={output.id} className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3 bg-gray-50 rounded-lg">
                  <div>
                    <label className="text-xs font-medium text-gray-500">Name</label>
                    <input className={fieldClass} defaultValue={output.name} />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500">Label</label>
                    <input className={fieldClass} defaultValue={output.label} />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500">Format</label>
                    <select className={fieldClass} defaultValue={output.format}>
                      <option value="currency">Currency</option>
                      <option value="percentage">Percentage</option>
                      <option value="number">Number</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Formula */}
      {activeTab === 'formula' && (
        <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm space-y-4">
          <h3 className="font-semibold text-gray-900">Calculation Formula</h3>
          <div>
            <label className={labelClass}>Formula / Logic</label>
            <textarea
              className="w-full px-3 py-2 text-sm font-mono border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none bg-gray-900 text-green-400"
              rows={12}
              defaultValue={calculator.formula}
            />
          </div>
          <div>
            <label className={labelClass}>Data Sources</label>
            <div className="flex flex-wrap gap-2">
              {calculator.dataSources.map((ds) => (
                <Badge key={ds} variant="info">{ds}</Badge>
              ))}
              {calculator.dataSources.length === 0 && <span className="text-sm text-gray-400">No external data sources</span>}
            </div>
          </div>
          <div className="text-sm text-gray-500">
            Last updated: {formatDateTime(calculator.lastModified)}
          </div>
        </div>
      )}

      {/* Test Cases */}
      {activeTab === 'tests' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Test Cases ({calculator.testCases.length})</h3>
            <button onClick={runTests} className="flex items-center gap-2 px-3 py-1.5 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              <Play className="h-4 w-4" /> Run All Tests
            </button>
          </div>
          {calculator.testCases.length === 0 ? (
            <div className="bg-white rounded-lg border border-gray-200 p-8 text-center text-gray-400 shadow-sm">
              No test cases defined yet.
            </div>
          ) : (
            calculator.testCases.map((tc) => (
              <div key={tc.id} className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <p className="font-medium text-gray-900">{tc.name}</p>
                  {testResults && (
                    testResults[tc.id]
                      ? <CheckCircle className="h-5 w-5 text-green-600" />
                      : <XCircle className="h-5 w-5 text-red-600" />
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium text-gray-600 mb-1">Inputs</p>
                    <pre className="bg-gray-50 rounded p-2 text-xs overflow-auto">{JSON.stringify(tc.inputs, null, 2)}</pre>
                  </div>
                  <div>
                    <p className="font-medium text-gray-600 mb-1">Expected Outputs</p>
                    <pre className="bg-gray-50 rounded p-2 text-xs overflow-auto">{JSON.stringify(tc.expectedOutputs, null, 2)}</pre>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Documentation */}
      {activeTab === 'docs' && (
        <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm space-y-4">
          <h3 className="font-semibold text-gray-900">Documentation</h3>
          {[
            { label: 'How It Works', placeholder: 'Explain how this calculator works for users...' },
            { label: 'Assumptions Made', placeholder: 'List any assumptions built into the formula...' },
            { label: 'Limitations', placeholder: 'Describe any known limitations...' },
            { label: 'Source References', placeholder: 'Link to SARS, SARB, or other sources...' },
          ].map(({ label, placeholder }) => (
            <div key={label}>
              <label className={labelClass}>{label}</label>
              <textarea className={`${fieldClass} resize-none`} rows={3} placeholder={placeholder} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

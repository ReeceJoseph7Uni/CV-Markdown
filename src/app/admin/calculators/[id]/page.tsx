'use client';

import { useState } from 'react';
import Header from '@/components/admin/Header';
import { mockCalculators } from '@/lib/mockData';
import { notFound } from 'next/navigation';

export default function CalculatorDetailPage({ params }: { params: { id: string } }) {
  const calculator = mockCalculators.find((c) => c.id === params.id);
  if (!calculator) notFound();

  const [formula, setFormula] = useState(calculator.formula);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div>
      <Header
        title={`Edit Calculator: ${calculator.name}`}
        onMenuClick={() => {}}
        actions={
          <div className="flex gap-2 items-center">
            {saved && <span className="text-green-600 text-sm font-medium">✓ Saved</span>}
            <button
              onClick={handleSave}
              className="px-4 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
            >
              Save
            </button>
          </div>
        }
      />
      <div className="p-6 space-y-6">
        {/* Description */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                defaultValue={calculator.name}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                defaultValue={calculator.status}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="enabled">Enabled</option>
                <option value="disabled">Disabled</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                defaultValue={calculator.description}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Inputs */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Inputs ({calculator.inputs.length})</h2>
            <button className="px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-sm hover:bg-green-100 transition-colors">
              + Add Input
            </button>
          </div>
          <div className="space-y-3">
            {calculator.inputs.map((input) => (
              <div key={input.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                  <div>
                    <span className="text-xs text-gray-500 block">Label</span>
                    <span className="font-medium text-gray-800">{input.label}</span>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 block">Name</span>
                    <span className="font-mono text-gray-700 text-xs">{input.name}</span>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 block">Type</span>
                    <span className="px-1.5 py-0.5 bg-blue-50 text-blue-700 rounded text-xs">{input.type}</span>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 block">Required</span>
                    <span className={input.required ? 'text-green-600 text-xs font-semibold' : 'text-gray-400 text-xs'}>
                      {input.required ? 'Yes' : 'No'}
                    </span>
                  </div>
                </div>
                <button className="text-red-400 hover:text-red-600 text-sm">✕</button>
              </div>
            ))}
          </div>
        </div>

        {/* Outputs */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Outputs ({calculator.outputs.length})</h2>
            <button className="px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-sm hover:bg-green-100 transition-colors">
              + Add Output
            </button>
          </div>
          <div className="space-y-3">
            {calculator.outputs.map((output) => (
              <div key={output.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                  <div>
                    <span className="text-xs text-gray-500 block">Label</span>
                    <span className="font-medium text-gray-800">{output.label}</span>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 block">Format</span>
                    <span className="px-1.5 py-0.5 bg-purple-50 text-purple-700 rounded text-xs">{output.format}</span>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 block">Show Breakdown</span>
                    <span className={output.showBreakdown ? 'text-green-600 text-xs font-semibold' : 'text-gray-400 text-xs'}>
                      {output.showBreakdown ? 'Yes' : 'No'}
                    </span>
                  </div>
                </div>
                <button className="text-red-400 hover:text-red-600 text-sm">✕</button>
              </div>
            ))}
          </div>
        </div>

        {/* Formula Editor */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Formula / Logic</h2>
          <textarea
            value={formula}
            onChange={(e) => setFormula(e.target.value)}
            rows={8}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
            placeholder="// Enter formula or pseudocode..."
          />
        </div>

        {/* Test Cases */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Test Cases ({calculator.testCaseCount})
            </h2>
            <button className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm hover:bg-blue-100 transition-colors">
              Run All Tests
            </button>
          </div>
          <p className="text-sm text-gray-500">
            {calculator.testCaseCount} test cases configured. Click &ldquo;Run All Tests&rdquo; to validate the formula.
          </p>
        </div>
      </div>
    </div>
  );
}

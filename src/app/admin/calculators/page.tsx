'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/admin/Header';
import { mockCalculators } from '@/lib/mockData';
import { formatDate, cn } from '@/lib/utils';
import type { Calculator } from '@/types/admin';

export default function CalculatorsPage() {
  const [calculators, setCalculators] = useState<Calculator[]>(mockCalculators);

  const toggleStatus = (id: string) => {
    setCalculators((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, status: c.status === 'enabled' ? 'disabled' : 'enabled' }
          : c
      )
    );
  };

  return (
    <div>
      <Header title="Calculators" onMenuClick={() => {}} />
      <div className="p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {calculators.map((calc) => (
            <div
              key={calc.id}
              className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm flex flex-col gap-3"
            >
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-sm font-semibold text-gray-900 leading-tight">{calc.name}</h3>
                <button
                  onClick={() => toggleStatus(calc.id)}
                  className={cn(
                    'shrink-0 px-2 py-1 rounded-full text-xs font-semibold transition-colors',
                    calc.status === 'enabled'
                      ? 'bg-green-100 text-green-700 hover:bg-green-200'
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  )}
                >
                  {calc.status === 'enabled' ? 'Enabled' : 'Disabled'}
                </button>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">{calc.description}</p>
              <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded">
                  {calc.inputs.length} inputs
                </span>
                <span className="px-2 py-0.5 bg-purple-50 text-purple-700 rounded">
                  {calc.outputs.length} outputs
                </span>
                <span className="px-2 py-0.5 bg-green-50 text-green-700 rounded">
                  {calc.testCaseCount} test cases
                </span>
              </div>
              <p className="text-xs text-gray-400">Last updated: {formatDate(calc.lastUpdated)}</p>
              <div className="flex gap-2 mt-auto pt-2 border-t border-gray-100">
                <Link
                  href={`/admin/calculators/${calc.id}`}
                  className="flex-1 text-center px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium hover:bg-blue-100 transition-colors"
                >
                  Edit
                </Link>
                <button className="flex-1 px-3 py-1.5 bg-gray-50 text-gray-600 rounded-lg text-xs font-medium hover:bg-gray-100 transition-colors">
                  Test
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

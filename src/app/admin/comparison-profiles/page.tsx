'use client';

import { useState } from 'react';
import Header from '@/components/admin/Header';
import { mockComparisonProfiles, mockProducts } from '@/lib/mockData';
import type { ComparisonProfile } from '@/types/admin';
import { cn } from '@/lib/utils';

type WeightKey = keyof ComparisonProfile['weights'];

const WEIGHT_LABELS: Record<string, string> = {
  interestRate: 'Interest Rate',
  fees: 'Fees',
  accessibility: 'Accessibility',
  minBalance: 'Min Balance',
  tfsaEligibility: 'TFSA Eligibility',
  tierMatching: 'Tier Matching',
  noticePeriod: 'Notice Period',
};

function totalWeights(weights: ComparisonProfile['weights']): number {
  return Object.values(weights).reduce((s, v) => s + (v ?? 0), 0);
}

export default function ComparisonProfilesPage() {
  const [profiles, setProfiles] = useState<ComparisonProfile[]>(mockComparisonProfiles);
  const [saved, setSaved] = useState<string | null>(null);

  const updateWeight = (profileId: string, key: WeightKey, value: number) => {
    setProfiles((prev) =>
      prev.map((p) =>
        p.id === profileId ? { ...p, weights: { ...p.weights, [key]: value } } : p
      )
    );
  };

  const handleSave = (profileId: string) => {
    setSaved(profileId);
    setTimeout(() => setSaved(null), 2000);
  };

  // Preview: rank products for a profile
  const rankProducts = (profile: ComparisonProfile) => {
    return mockProducts
      .map((p) => {
        const { weights } = profile;
        let score = 0;
        // Higher rate = better for savings
        score += (p.interestRate / 25) * (weights.interestRate ?? 0);
        // Lower fees = better
        score += (1 - Math.min(p.monthlyFee / 200, 1)) * (weights.fees ?? 0);
        // No notice period = more accessible
        score += (p.noticePeriodDays === 0 ? 1 : 0.3) * (weights.accessibility ?? 0);
        // Lower minBalance = better
        score += (p.minBalance === 0 ? 1 : 0.5) * (weights.minBalance ?? 0);
        if (weights.tfsaEligibility) score += (p.isTfsaEligible ? 1 : 0) * weights.tfsaEligibility;
        return { product: p, score };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
  };

  return (
    <div>
      <Header title="Comparison Profiles" onMenuClick={() => {}} />
      <div className="p-6 space-y-6">
        {profiles.map((profile) => {
          const total = totalWeights(profile.weights);
          const ranked = rankProducts(profile);
          return (
            <div key={profile.id} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-start justify-between mb-1">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">{profile.name}</h2>
                  <p className="text-sm text-gray-500 mt-0.5">{profile.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  {profile.mustBeTfsa && (
                    <span className="px-2 py-0.5 bg-green-50 text-green-700 rounded text-xs font-semibold">
                      TFSA Only
                    </span>
                  )}
                  <button
                    onClick={() => handleSave(profile.id)}
                    className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 transition-colors"
                  >
                    {saved === profile.id ? '✓ Saved' : 'Save'}
                  </button>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Weight Sliders */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Weights</span>
                    <span
                      className={cn(
                        'text-xs font-semibold px-2 py-0.5 rounded',
                        total === 100 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                      )}
                    >
                      Total: {total}/100
                    </span>
                  </div>
                  {(Object.entries(profile.weights) as [WeightKey, number | undefined][]).map(
                    ([key, value]) => (
                      <div key={key}>
                        <div className="flex justify-between text-xs text-gray-600 mb-0.5">
                          <span>{WEIGHT_LABELS[key] ?? key}</span>
                          <span className="font-semibold">{value ?? 0}</span>
                        </div>
                        <input
                          type="range"
                          min={0}
                          max={100}
                          value={value ?? 0}
                          onChange={(e) =>
                            updateWeight(profile.id, key, parseInt(e.target.value, 10))
                          }
                          className="w-full h-1.5 accent-blue-600"
                        />
                      </div>
                    )
                  )}
                </div>

                {/* Preview Ranking */}
                <div>
                  <span className="text-sm font-medium text-gray-700 block mb-3">
                    Top 3 Products (Preview)
                  </span>
                  <div className="space-y-2">
                    {ranked.map((item, idx) => (
                      <div
                        key={item.product.id}
                        className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg border border-gray-200"
                      >
                        <span
                          className={cn(
                            'w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0',
                            idx === 0 ? 'bg-yellow-400 text-white' :
                            idx === 1 ? 'bg-gray-300 text-gray-700' :
                            'bg-orange-300 text-white'
                          )}
                        >
                          {idx + 1}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{item.product.name}</p>
                          <p className="text-xs text-gray-500">{item.product.institution}</p>
                        </div>
                        <span className="text-xs font-semibold text-blue-600">
                          {item.product.interestRate}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

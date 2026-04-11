'use client';

import { useState } from 'react';
import { Save, Edit, CheckCircle } from 'lucide-react';
import { MOCK_PROFILES } from '@/lib/mock-data';
import { ComparisonProfile, ProfileWeight } from '@/lib/types';
import { Badge } from '@/components/admin/Badge';

type WeightKey = keyof ProfileWeight;
const weightFields: { key: WeightKey; label: string }[] = [
  { key: 'interestRate', label: 'Interest Rate' },
  { key: 'fees', label: 'Fees' },
  { key: 'accessFlexibility', label: 'Access Flexibility' },
  { key: 'minBalanceRequirement', label: 'Minimum Balance Requirement' },
  { key: 'tfsaEligibility', label: 'TFSA Eligibility' },
  { key: 'digitalEaseOfUse', label: 'Digital Ease of Use' },
  { key: 'userProfileMatch', label: 'User Profile Match' },
];

function ProfileCard({ profile }: { profile: ComparisonProfile }) {
  const [weights, setWeights] = useState<ProfileWeight>(profile.weights);
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);

  const total = Object.values(weights).reduce((a, b) => a + b, 0);

  const updateWeight = (key: WeightKey, value: number) => {
    setWeights((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    if (total !== 100) return;
    setSaved(true);
    setEditing(false);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      {/* Card header */}
      <div className="flex items-start justify-between px-5 py-4 border-b border-gray-100">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-gray-900">{profile.name}</h3>
            <Badge variant={profile.isActive ? 'success' : 'neutral'}>
              {profile.isActive ? 'Active' : 'Inactive'}
            </Badge>
            {saved && <Badge variant="success">✓ Saved</Badge>}
          </div>
          <p className="text-sm text-gray-500">{profile.description}</p>
        </div>
        <button
          onClick={() => setEditing((e) => !e)}
          className={`flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg transition-colors ${editing ? 'bg-gray-200 text-gray-700' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}
        >
          <Edit className="h-4 w-4" />
          {editing ? 'Cancel' : 'Edit'}
        </button>
      </div>

      {/* Weights */}
      <div className="px-5 py-4 space-y-3">
        {weightFields.map(({ key, label }) => {
          const val = weights[key];
          const pct = total > 0 ? (val / total) * 100 : 0;
          return (
            <div key={key}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-700">{label}</span>
                {editing ? (
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={val}
                    onChange={(e) => updateWeight(key, Number(e.target.value))}
                    className="w-16 px-2 py-1 text-sm text-right border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <span className="text-sm font-semibold text-gray-900">{val}%</span>
                )}
              </div>
              {editing && (
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={val}
                  onChange={(e) => updateWeight(key, Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-blue-600"
                />
              )}
              {!editing && (
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${val}%` }} />
                </div>
              )}
            </div>
          );
        })}

        {/* Total */}
        <div className={`flex items-center justify-between py-2 border-t border-gray-200 text-sm font-semibold ${total !== 100 ? 'text-red-600' : 'text-green-600'}`}>
          <span>Total</span>
          <span>
            {total === 100
              ? <span className="flex items-center gap-1"><CheckCircle className="h-4 w-4" /> 100%</span>
              : <span>{total}% — must equal 100%</span>}
          </span>
        </div>

        {editing && (
          <button
            onClick={handleSave}
            disabled={total !== 100}
            className="flex items-center gap-2 px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors w-full justify-center"
          >
            <Save className="h-4 w-4" />
            Save Profile Weights
          </button>
        )}
      </div>

      {/* Associated types */}
      <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex flex-wrap gap-1">
        {profile.categories.map((cat) => (
          <Badge key={cat} variant="neutral">{cat.replace(/_/g, ' ')}</Badge>
        ))}
      </div>
    </div>
  );
}

export default function ProfilesPage() {
  return (
    <div className="space-y-5">
      <p className="text-sm text-gray-600">
        Comparison profiles control how products are ranked for different user needs. Weights must total 100%.
      </p>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {MOCK_PROFILES.map((profile) => (
          <ProfileCard key={profile.id} profile={profile} />
        ))}
      </div>
    </div>
  );
}

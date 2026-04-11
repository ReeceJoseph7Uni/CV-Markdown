'use client';

import { useState, useCallback } from 'react';
import { ChevronDown, X } from 'lucide-react';

interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

interface FilterGroup {
  id: string;
  label: string;
  type: 'checkbox' | 'radio' | 'range' | 'toggle';
  options?: FilterOption[];
  min?: number;
  max?: number;
}

type FilterValue = string | string[] | boolean | [number, number];
type ActiveFilters = Record<string, FilterValue>;

interface FilterSidebarProps {
  filterGroups: FilterGroup[];
  activeFilters: ActiveFilters;
  onFilterChange: (groupId: string, value: FilterValue) => void;
  onClearAll: () => void;
}

function activeFilterCount(activeFilters: ActiveFilters): number {
  return Object.values(activeFilters).filter((v) => {
    if (Array.isArray(v)) return v.length > 0;
    if (typeof v === 'boolean') return v;
    return v !== '' && v !== undefined;
  }).length;
}

function getActiveChips(activeFilters: ActiveFilters, filterGroups: FilterGroup[]): Array<{ id: string; label: string; groupId: string }> {
  const chips: Array<{ id: string; label: string; groupId: string }> = [];

  for (const group of filterGroups) {
    const val = activeFilters[group.id];
    if (!val) continue;

    if (group.type === 'toggle' && val === true) {
      chips.push({ id: group.id, label: group.label, groupId: group.id });
    } else if (group.type === 'checkbox' && Array.isArray(val)) {
      for (const v of val) {
        const opt = group.options?.find((o) => o.value === v);
        chips.push({ id: `${group.id}-${v}`, label: opt?.label ?? String(v), groupId: group.id });
      }
    } else if (group.type === 'radio' && typeof val === 'string' && val !== '') {
      const opt = group.options?.find((o) => o.value === val);
      chips.push({ id: `${group.id}-${val}`, label: opt?.label ?? val, groupId: group.id });
    }
  }

  return chips;
}

export default function FilterSidebar({ filterGroups, activeFilters, onFilterChange, onClearAll }: FilterSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const count = activeFilterCount(activeFilters);
  const chips = getActiveChips(activeFilters, filterGroups);

  const toggleCollapse = useCallback((id: string) => {
    setCollapsed((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const handleCheckboxChange = useCallback(
    (groupId: string, value: string, checked: boolean) => {
      const current = (activeFilters[groupId] as string[] | undefined) ?? [];
      const next = checked ? [...current, value] : current.filter((v) => v !== value);
      onFilterChange(groupId, next);
    },
    [activeFilters, onFilterChange],
  );

  const removeChip = useCallback(
    (chip: { id: string; groupId: string; label: string }) => {
      const group = filterGroups.find((g) => g.id === chip.groupId);
      if (!group) return;
      if (group.type === 'toggle') {
        onFilterChange(chip.groupId, false);
      } else if (group.type === 'checkbox') {
        const current = (activeFilters[chip.groupId] as string[] | undefined) ?? [];
        const valueToRemove = chip.id.replace(`${chip.groupId}-`, '');
        onFilterChange(chip.groupId, current.filter((v) => v !== valueToRemove));
      } else {
        onFilterChange(chip.groupId, '');
      }
    },
    [filterGroups, activeFilters, onFilterChange],
  );

  const sidebar = (
    <div className="space-y-1">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-gray-900">Filters</h3>
          {count > 0 && (
            <span className="bg-blue-700 text-white text-xs font-bold px-2 py-0.5 rounded-full">
              {count}
            </span>
          )}
        </div>
        {count > 0 && (
          <button
            onClick={onClearAll}
            className="text-xs text-blue-700 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-700 rounded"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Filter groups */}
      {filterGroups.map((group) => (
        <div key={group.id} className="border border-gray-100 rounded-xl overflow-hidden mb-2">
          <button
            onClick={() => toggleCollapse(group.id)}
            className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-700"
            aria-expanded={!collapsed[group.id]}
          >
            <span className="text-sm font-medium text-gray-800">{group.label}</span>
            <ChevronDown
              className={`w-4 h-4 text-gray-400 transition-transform ${collapsed[group.id] ? '' : 'rotate-180'}`}
            />
          </button>

          {!collapsed[group.id] && (
            <div className="px-4 py-3 space-y-2">
              {/* Checkbox group */}
              {group.type === 'checkbox' && group.options?.map((opt) => {
                const checked = ((activeFilters[group.id] as string[] | undefined) ?? []).includes(opt.value);
                return (
                  <label key={opt.value} className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={(e) => handleCheckboxChange(group.id, opt.value, e.target.checked)}
                      className="w-4 h-4 rounded accent-blue-700 focus:ring-2 focus:ring-blue-700"
                    />
                    <span className="text-sm text-gray-700 group-hover:text-gray-900 flex-1">{opt.label}</span>
                    {opt.count != null && (
                      <span className="text-xs text-gray-400">{opt.count}</span>
                    )}
                  </label>
                );
              })}

              {/* Radio group */}
              {group.type === 'radio' && group.options?.map((opt) => {
                const checked = activeFilters[group.id] === opt.value;
                return (
                  <label key={opt.value} className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="radio"
                      name={group.id}
                      checked={checked}
                      onChange={() => onFilterChange(group.id, opt.value)}
                      className="w-4 h-4 accent-blue-700 focus:ring-2 focus:ring-blue-700"
                    />
                    <span className="text-sm text-gray-700 group-hover:text-gray-900">{opt.label}</span>
                  </label>
                );
              })}

              {/* Range */}
              {group.type === 'range' && group.min != null && group.max != null && (
                <div className="space-y-2">
                  <input
                    type="range"
                    min={group.min}
                    max={group.max}
                    value={((activeFilters[group.id] as [number, number] | undefined)?.[1]) ?? group.max}
                    onChange={(e) =>
                      onFilterChange(group.id, [group.min!, parseInt(e.target.value)] as [number, number])
                    }
                    className="w-full accent-blue-700"
                    aria-label={`${group.label} maximum`}
                  />
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>R {group.min.toLocaleString('en-ZA')}</span>
                    <span>R {group.max.toLocaleString('en-ZA')}</span>
                  </div>
                </div>
              )}

              {/* Toggle */}
              {group.type === 'toggle' && (
                <label className="flex items-center gap-3 cursor-pointer">
                  <span className="text-sm text-gray-700 flex-1">{group.label} only</span>
                  <button
                    role="switch"
                    aria-checked={!!activeFilters[group.id]}
                    onClick={() => onFilterChange(group.id, !activeFilters[group.id])}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-700 focus:ring-offset-1 ${
                      activeFilters[group.id] ? 'bg-blue-700' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                        activeFilters[group.id] ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </label>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <>
      {/* Active filter chips (shown above results on all screens) */}
      {chips.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {chips.map((chip) => (
            <span
              key={chip.id}
              className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 text-xs font-medium px-3 py-1 rounded-full"
            >
              {chip.label}
              <button
                onClick={() => removeChip(chip)}
                className="hover:text-blue-900 focus:outline-none focus:ring-1 focus:ring-blue-700 rounded-full"
                aria-label={`Remove ${chip.label} filter`}
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
          <button
            onClick={onClearAll}
            className="text-xs text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400 rounded"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Mobile toggle */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setIsOpen((v) => !v)}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-700"
          aria-expanded={isOpen}
        >
          Filters
          {count > 0 && (
            <span className="bg-blue-700 text-white text-xs font-bold px-2 py-0.5 rounded-full">{count}</span>
          )}
          <ChevronDown className={`w-4 h-4 ml-auto transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        {isOpen && (
          <div className="mt-2 p-4 border border-gray-200 rounded-xl bg-white shadow-md">
            {sidebar}
          </div>
        )}
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:block">
        {sidebar}
      </div>
    </>
  );
}

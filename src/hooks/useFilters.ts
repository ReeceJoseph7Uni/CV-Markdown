'use client';

import { useState, useCallback, useMemo } from 'react';
import type { ActiveFilters } from '@/types/comparison';

export function useFilters(initialFilters: ActiveFilters = {}) {
  const [filters, setFilters] = useState<ActiveFilters>(initialFilters);

  const setFilter = useCallback((key: string, value: unknown) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value as ActiveFilters[string],
    }));
  }, []);

  const removeFilter = useCallback((key: string) => {
    setFilters((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({});
  }, []);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    for (const value of Object.values(filters)) {
      if (value === undefined || value === null) continue;
      if (typeof value === 'boolean' && value) {
        count++;
      } else if (typeof value === 'string' && value !== '') {
        count++;
      } else if (Array.isArray(value) && value.length > 0) {
        count++;
      }
    }
    return count;
  }, [filters]);

  const isFiltered = activeFilterCount > 0;

  return {
    filters,
    setFilter,
    removeFilter,
    clearFilters,
    activeFilterCount,
    isFiltered,
  };
}

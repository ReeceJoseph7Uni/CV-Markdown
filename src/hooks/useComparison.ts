'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';

const STORAGE_KEY = 'everyrandsa_comparison_cart';

function readFromStorage(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? (parsed as string[]) : [];
  } catch {
    return [];
  }
}

function writeToStorage(items: string[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // localStorage may be unavailable (private browsing quota exceeded)
  }
}

export function useComparison(maxItems = 4) {
  const [items, setItems] = useState<string[]>(() => readFromStorage());

  // Keep localStorage in sync whenever items change
  useEffect(() => {
    writeToStorage(items);
  }, [items]);

  const addItem = useCallback(
    (id: string) => {
      setItems((prev) => {
        if (prev.includes(id) || prev.length >= maxItems) return prev;
        return [...prev, id];
      });
    },
    [maxItems],
  );

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item !== id));
  }, []);

  const clearAll = useCallback(() => {
    setItems([]);
  }, []);

  const isInCart = useCallback(
    (id: string) => items.includes(id),
    [items],
  );

  const isFull = useMemo(() => items.length >= maxItems, [items, maxItems]);
  const count = items.length;

  return {
    items,
    addItem,
    removeItem,
    clearAll,
    isInCart,
    isFull,
    count,
  };
}

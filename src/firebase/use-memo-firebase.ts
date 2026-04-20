'use client';

import { useMemo, useRef } from 'react';

export function useMemoFirebase<T>(factory: () => T, deps: any[]): T {
  const ref = useRef<T | null>(null);
  const prevDeps = useRef<any[]>([]);

  const changed = !prevDeps.current || deps.length !== prevDeps.current.length || deps.some((dep, i) => dep !== prevDeps.current[i]);

  if (changed) {
    ref.current = factory();
    prevDeps.current = deps;
  }

  return ref.current as T;
}

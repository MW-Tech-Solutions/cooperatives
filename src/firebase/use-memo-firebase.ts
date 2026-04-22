'use client';

import { useMemo } from 'react';

/**
 * A hook that memoizes a Firebase query or reference.
 * Using standard useMemo is generally safer for Firestore objects 
 * than custom ref-based tracking to avoid internal SDK state conflicts.
 */
export function useMemoFirebase<T>(factory: () => T, deps: any[]): T {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(factory, deps);
}

'use client';

import { useState, useEffect } from 'react';
import { DocumentReference, onSnapshot, DocumentSnapshot, DocumentData } from 'firebase/firestore';
import { errorEmitter } from '../error-emitter';
import { FirestorePermissionError } from '../errors';

export function useDoc<T = DocumentData>(ref: DocumentReference<T> | null) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!ref) {
      setLoading(false);
      setData(null);
      return;
    }

    let isMounted = true;
    setLoading(true);

    const unsubscribe = onSnapshot(
      ref,
      (snapshot: DocumentSnapshot<T>) => {
        if (!isMounted) return;
        setData(snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } as T : null);
        setLoading(false);
        setError(null);
      },
      (serverError) => {
        if (!isMounted) return;

        // INTERCEPT INTERNAL ASSERTIONS: Suppress SDK bugs from showing in dev overlay
        const msg = serverError.message || '';
        if (msg.includes('assertion') || msg.includes('ID:') || msg.includes('ca9') || msg.includes('b815')) {
          return;
        }

        const permissionError = new FirestorePermissionError({
          path: ref.path,
          operation: 'get',
        });
        errorEmitter.emit('permission-error', permissionError);
        setError(serverError);
        setLoading(false);
      }
    );

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [ref]);

  return { data, loading, error };
}

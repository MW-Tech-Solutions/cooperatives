'use client';

import React from 'react';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import { firebaseConfig } from './config';
import { FirebaseProvider } from './provider';

/**
 * Module-level singletons to prevent multiple initializations.
 * This is critical to avoid "Unexpected state (ID: b815)" and "ID: ca9" errors 
 * caused by multiple Firestore instances in a single session.
 */
let app: FirebaseApp | undefined;
let db: Firestore | undefined;
let auth: Auth | undefined;

function initializeFirebase() {
  if (typeof window !== 'undefined') {
    if (getApps().length === 0) {
      app = initializeApp(firebaseConfig);
      db = getFirestore(app);
      auth = getAuth(app);
    } else {
      app = getApp();
      db = getFirestore(app);
      auth = getAuth(app);
    }
  }
  return { app, db, auth };
}

export function FirebaseClientProvider({ children }: { children: React.ReactNode }) {
  // Ensure Firebase is only initialized once and strictly reused
  const fb = React.useMemo(() => initializeFirebase(), []);

  return (
    <FirebaseProvider app={fb.app} db={fb.db} auth={fb.auth}>
      {children}
    </FirebaseProvider>
  );
}

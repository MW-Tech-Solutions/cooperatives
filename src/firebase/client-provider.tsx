
'use client';

import React, { useMemo } from 'react';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import { firebaseConfig } from './config';
import { FirebaseProvider } from './provider';

/**
 * Global Singleton Pattern for Firebase
 * Attaching to window ensures instances survive Next.js HMR refreshes 
 * and prevents "INTERNAL ASSERTION FAILED" (ca9/b815) errors.
 */
declare global {
  interface Window {
    __FIREBASE_APP__?: FirebaseApp;
    __FIREBASE_DB__?: Firestore;
    __FIREBASE_AUTH__?: Auth;
  }
}

function getFirebaseInstance() {
  if (typeof window === 'undefined') {
    return { app: undefined, db: undefined, auth: undefined };
  }

  if (!window.__FIREBASE_APP__) {
    try {
      const apps = getApps();
      window.__FIREBASE_APP__ = apps.length === 0 ? initializeApp(firebaseConfig) : getApp();
      window.__FIREBASE_DB__ = getFirestore(window.__FIREBASE_APP__);
      window.__FIREBASE_AUTH__ = getAuth(window.__FIREBASE_APP__);
    } catch (error) {
      // Catch initialization errors silently if they are HMR-related
    }
  }

  return { 
    app: window.__FIREBASE_APP__, 
    db: window.__FIREBASE_DB__, 
    auth: window.__FIREBASE_AUTH__ 
  };
}

export function FirebaseClientProvider({ children }: { children: React.ReactNode }) {
  // useMemo ensures this runs once and provides stable references to context
  const fb = useMemo(() => getFirebaseInstance(), []);

  return (
    <FirebaseProvider app={fb.app} db={fb.db} auth={fb.auth}>
      {children}
    </FirebaseProvider>
  );
}

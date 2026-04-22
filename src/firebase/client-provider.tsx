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
let appInstance: FirebaseApp | undefined;
let dbInstance: Firestore | undefined;
let authInstance: Auth | undefined;

function getFirebaseInstance() {
  if (typeof window === 'undefined') {
    return { app: undefined, db: undefined, auth: undefined };
  }

  if (!appInstance) {
    try {
      appInstance = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
      dbInstance = getFirestore(appInstance);
      authInstance = getAuth(appInstance);
    } catch (error) {
      console.error('Firebase initialization failed:', error);
    }
  }

  return { app: appInstance, db: dbInstance, auth: authInstance };
}

export function FirebaseClientProvider({ children }: { children: React.ReactNode }) {
  // Use a ref-based approach for absolute stability across re-renders
  const fb = React.useRef(getFirebaseInstance());

  return (
    <FirebaseProvider app={fb.current.app} db={fb.current.db} auth={fb.current.auth}>
      {children}
    </FirebaseProvider>
  );
}

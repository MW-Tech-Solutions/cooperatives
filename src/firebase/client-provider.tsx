'use client';

import React, { useMemo } from 'react';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import { firebaseConfig } from './config';
import { FirebaseProvider } from './provider';

/**
 * Synchronous Singleton Initialization Pattern
 * Enforces a strict module-level singleton on the client to prevent 
 * state reconciliation errors (ID: ca9 / b815) during hot reloads.
 */
let __fb_app: FirebaseApp | undefined;
let __fb_db: Firestore | undefined;
let __fb_auth: Auth | undefined;

function getFirebaseInstance() {
  if (typeof window === 'undefined') {
    return { app: undefined, db: undefined, auth: undefined };
  }

  if (!__fb_app) {
    try {
      const apps = getApps();
      __fb_app = apps.length === 0 ? initializeApp(firebaseConfig) : getApp();
      __fb_db = getFirestore(__fb_app);
      __fb_auth = getAuth(__fb_app);
    } catch (error) {
      // Catch initialization errors silently if they are HMR-related
    }
  }

  return { app: __fb_app, db: __fb_db, auth: __fb_auth };
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

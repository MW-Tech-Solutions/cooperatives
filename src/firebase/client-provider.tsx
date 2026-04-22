'use client';

import React, { useMemo } from 'react';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import { firebaseConfig } from './config';
import { FirebaseProvider } from './provider';

/**
 * Synchronous Initialization Pattern
 * Ensures Firebase instances are created immediately on the client
 * to avoid "undefined" context during the initial render.
 */
function getFirebaseInstance() {
  if (typeof window === 'undefined') {
    return { app: undefined, db: undefined, auth: undefined };
  }

  const win = window as any;

  if (!win.__firebase_app_instance) {
    try {
      const apps = getApps();
      const app = apps.length === 0 ? initializeApp(firebaseConfig) : getApp();
      
      win.__firebase_app_instance = app;
      win.__firebase_db_instance = getFirestore(app);
      win.__firebase_auth_instance = getAuth(app);
    } catch (error) {
      console.warn('Firebase singleton initialization skipped (likely already initialized).');
    }
  }

  return { 
    app: win.__firebase_app_instance as FirebaseApp, 
    db: win.__firebase_db_instance as Firestore, 
    auth: win.__firebase_auth_instance as Auth 
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

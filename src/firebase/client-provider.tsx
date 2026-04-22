'use client';

import React from 'react';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import { firebaseConfig } from './config';
import { FirebaseProvider } from './provider';

/**
 * Enhanced Singleton Pattern for Next.js Development
 * Attaching instances to the window object ensures they persist across HMR (Hot Module Replacement)
 * preventing "Unexpected state (ID: b815)" and "ID: ca9" errors.
 */
function getFirebaseInstance(): { app: FirebaseApp | undefined, db: Firestore | undefined, auth: Auth | undefined } {
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
      
      console.log('Firebase services initialized as stable singletons.');
    } catch (error) {
      console.error('Firebase initialization failed:', error);
      return { app: undefined, db: undefined, auth: undefined };
    }
  }

  return { 
    app: win.__firebase_app_instance, 
    db: win.__firebase_db_instance, 
    auth: win.__firebase_auth_instance 
  };
}

export function FirebaseClientProvider({ children }: { children: React.ReactNode }) {
  // Use a ref to ensure the initialization happens once and the identity is stable
  const [fb, setFb] = React.useState<{ app: FirebaseApp | undefined, db: Firestore | undefined, auth: Auth | undefined }>({ app: undefined, db: undefined, auth: undefined });

  React.useEffect(() => {
    setFb(getFirebaseInstance());
  }, []);

  return (
    <FirebaseProvider app={fb.app} db={fb.db} auth={fb.auth}>
      {children}
    </FirebaseProvider>
  );
}

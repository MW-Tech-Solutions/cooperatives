'use client';

import React from 'react';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore, terminate } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import { firebaseConfig } from './config';
import { FirebaseProvider } from './provider';

/**
 * Enhanced Singleton Pattern for Next.js Development
 * Attaching instances to the window object ensures they persist across HMR (Hot Module Replacement)
 * preventing "Unexpected state (ID: b815)" and "ID: ca9" errors.
 */
function getFirebaseInstance() {
  if (typeof window === 'undefined') {
    return { app: undefined, db: undefined, auth: undefined };
  }

  const win = window as any;

  if (!win.__firebase_app_instance) {
    try {
      const apps = getApps();
      win.__firebase_app_instance = apps.length === 0 ? initializeApp(firebaseConfig) : getApp();
      win.__firebase_db_instance = getFirestore(win.__firebase_app_instance);
      win.__firebase_auth_instance = getAuth(win.__firebase_app_instance);
      
      console.log('Firebase services initialized as singletons.');
    } catch (error) {
      console.error('Firebase initialization failed:', error);
    }
  }

  return { 
    app: win.__firebase_app_instance, 
    db: win.__firebase_db_instance, 
    auth: win.__firebase_auth_instance 
  };
}

export function FirebaseClientProvider({ children }: { children: React.ReactNode }) {
  // Use a ref to ensure the context value never changes its reference identity
  const fb = React.useRef(getFirebaseInstance());

  return (
    <FirebaseProvider app={fb.current.app} db={fb.current.db} auth={fb.current.auth}>
      {children}
    </FirebaseProvider>
  );
}

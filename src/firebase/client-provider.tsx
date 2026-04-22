'use client';

import React from 'react';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import { firebaseConfig } from './config';
import { FirebaseProvider } from './provider';

// Module-level singletons to prevent multiple initializations during hot reloading
let app: FirebaseApp | undefined;
let db: Firestore | undefined;
let auth: Auth | undefined;

if (typeof window !== 'undefined') {
  app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  db = getFirestore(app);
  auth = getAuth(app);
}

export function FirebaseClientProvider({ children }: { children: React.ReactNode }) {
  // Always wrap in FirebaseProvider, even on the server.
  // app, db, auth will be undefined on the server, which the hooks handle safely.
  return (
    <FirebaseProvider app={app} db={db} auth={auth}>
      {children}
    </FirebaseProvider>
  );
}

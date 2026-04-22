'use client';

import React, { createContext, useContext } from 'react';
import { FirebaseApp } from 'firebase/app';
import { Firestore } from 'firebase/firestore';
import { Auth } from 'firebase/auth';

interface FirebaseContextType {
  app: FirebaseApp | undefined;
  db: Firestore | undefined;
  auth: Auth | undefined;
}

const FirebaseContext = createContext<FirebaseContextType | null>(null);

export function FirebaseProvider({
  children,
  app,
  db,
  auth,
}: {
  children: React.ReactNode;
  app: FirebaseApp | undefined;
  db: Firestore | undefined;
  auth: Auth | undefined;
}) {
  return (
    <FirebaseContext.Provider value={{ app, db, auth }}>
      {children}
    </FirebaseContext.Provider>
  );
}

export function useFirebase() {
  const context = useContext(FirebaseContext);
  return context;
}

export function useFirebaseApp() {
  return useFirebase()?.app;
}

export function useFirestore() {
  return useFirebase()?.db;
}

export function useAuth() {
  return useFirebase()?.auth;
}

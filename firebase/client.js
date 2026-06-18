import { getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { assertFirebaseConfig, FIRESTORE_DATABASE_ID } from "./config.js";

let appInstance = null;
let dbInstance = null;
let authInstance = null;
let storageInstance = null;

/** Browser-only Firebase App (Next.js client components / event handlers). */
export function getFirebaseApp() {
  if (typeof window === "undefined") {
    throw new Error("Firebase client is only available in the browser.");
  }
  if (appInstance) return appInstance;
  const config = assertFirebaseConfig();
  appInstance =
    getApps().length > 0 ? getApps()[0] : initializeApp(config);
  return appInstance;
}

/** Firestore instance for the configured database (see `FIRESTORE_DATABASE_ID`). */
export function getFirebaseDb() {
  if (typeof window === "undefined") {
    throw new Error("Firestore client is only available in the browser.");
  }
  if (dbInstance) return dbInstance;
  dbInstance = getFirestore(getFirebaseApp(), FIRESTORE_DATABASE_ID);
  return dbInstance;
}

/** Firebase Auth (browser only). Enable Email/Password in Firebase Console → Authentication. */
export function getFirebaseAuth() {
  if (typeof window === "undefined") {
    throw new Error("Firebase Auth is only available in the browser.");
  }
  if (authInstance) return authInstance;
  authInstance = getAuth(getFirebaseApp());
  return authInstance;
}

/** Firebase Storage (browser only). Bucket comes from `storageBucket` in web app config. */
export function getFirebaseStorage() {
  if (typeof window === "undefined") {
    throw new Error("Firebase Storage is only available in the browser.");
  }
  if (storageInstance) return storageInstance;
  storageInstance = getStorage(getFirebaseApp());
  return storageInstance;
}

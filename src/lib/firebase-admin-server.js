import fs from "node:fs";
import path from "node:path";

import { initializeApp, getApps, cert, applicationDefault } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";
import { FIRESTORE_DATABASE_ID } from "@firebase/config";

let dbInstance = null;
let storageBucketInstance = null;

/** Strip wrapping quotes from env paths (common when pasting into .env). */
function stripEnvQuotes(value) {
  const s = String(value ?? "").trim();
  if (!s) return "";
  if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) {
    return s.slice(1, -1).trim();
  }
  return s;
}

/**
 * Resolve a path from env: absolute paths unchanged; relative paths are from `process.cwd()`.
 * @param {string} raw
 */
function resolveCredentialFilePath(raw) {
  const p = stripEnvQuotes(raw);
  if (!p) return null;
  const normalized = p.replace(/^\.\//, "");
  return path.isAbsolute(p) ? p : path.join(process.cwd(), normalized);
}

/**
 * Build an Admin credential from env. Order:
 * 1. `FIREBASE_SERVICE_ACCOUNT_JSON` — full JSON string (Vercel / CI)
 * 2. `FIREBASE_SERVICE_ACCOUNT_PATH` — path to JSON file (e.g. key at repo root)
 * 3. `GOOGLE_APPLICATION_CREDENTIALS` — standard GCP path to JSON file
 * 4. `applicationDefault()` — Cloud metadata / gcloud ADC
 *
 * @returns {import("firebase-admin/app").Credential}
 */
function getAdminCredential() {
  const jsonStr = process.env.FIREBASE_SERVICE_ACCOUNT_JSON?.trim();
  if (jsonStr) {
    try {
      return cert(JSON.parse(jsonStr));
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      throw new Error(`FIREBASE_SERVICE_ACCOUNT_JSON is set but invalid JSON: ${msg}`);
    }
  }

  const pathFromEnv =
    stripEnvQuotes(process.env.FIREBASE_SERVICE_ACCOUNT_PATH) ||
    stripEnvQuotes(process.env.GOOGLE_APPLICATION_CREDENTIALS);
  if (pathFromEnv) {
    const resolved = resolveCredentialFilePath(pathFromEnv);
    if (!resolved || !fs.existsSync(resolved)) {
      throw new Error(
        `Firebase service account file not found: ${resolved ?? "(empty path)"}. ` +
          `Check FIREBASE_SERVICE_ACCOUNT_PATH or GOOGLE_APPLICATION_CREDENTIALS.`,
      );
    }
    try {
      const rawFile = fs.readFileSync(resolved, "utf8");
      return cert(JSON.parse(rawFile));
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      throw new Error(`Failed to read or parse service account JSON at ${resolved}: ${msg}`);
    }
  }

  return applicationDefault();
}

/**
 * Server-only Firebase Admin. Uses Firestore / Auth / Storage with the
 * service account from env (see `getAdminCredential` order above).
 */
export function getFirebaseAdminApp() {
  if (getApps().length > 0) return getApps()[0];
  return initializeApp({ credential: getAdminCredential() });
}

export function getFirebaseAdminDb() {
  if (dbInstance) return dbInstance;
  const app = getFirebaseAdminApp();
  dbInstance = getFirestore(app, FIRESTORE_DATABASE_ID);
  return dbInstance;
}

/** GCS bucket for Firebase Storage (same as client `storageBucket`). Admin uploads bypass Storage rules. */
export function getFirebaseAdminBucket() {
  if (storageBucketInstance) return storageBucketInstance;
  const app = getFirebaseAdminApp();
  const name = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET?.trim();
  storageBucketInstance = name ? getStorage(app).bucket(name) : getStorage(app).bucket();
  return storageBucketInstance;
}

export async function verifyFirebaseIdToken(idToken) {
  const auth = getAuth(getFirebaseAdminApp());
  return auth.verifyIdToken(idToken);
}

/**
 * Set `admin: true` on `useraccounts/{uid}` (Firestore database `main`) via Firebase Admin.
 *
 * One-command setup (add to `.env.local`):
 *   SHOP_ADMIN_EMAIL=your-login@email.com
 *   GOOGLE_APPLICATION_CREDENTIALS=/path/to/serviceAccount.json
 *
 *   pnpm shop:admin
 *
 * Overrides:
 *   pnpm shop:admin -- other@email.com
 *   pnpm shop:admin -- --uid FirebaseAuthUidHere
 *
 * If `useraccounts/{uid}` is missing, creates it from the Auth user (same shape as backfill).
 */
import { cert, getApp, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { FieldValue, getFirestore } from "firebase-admin/firestore";

const DB =
  process.env.FIRESTORE_DATABASE_ID?.trim() ||
  process.env.NEXT_PUBLIC_FIRESTORE_DATABASE_ID?.trim() ||
  "main";

function stripQuotes(value) {
  const s = String(value || "").trim();
  if (
    (s.startsWith('"') && s.endsWith('"')) ||
    (s.startsWith("'") && s.endsWith("'"))
  ) {
    return s.slice(1, -1);
  }
  return s;
}

function initAdmin() {
  if (getApps().length) return;
  const json = process.env.FIREBASE_SERVICE_ACCOUNT_JSON?.trim();
  if (json) {
    initializeApp({ credential: cert(JSON.parse(json)) });
    return;
  }
  const credPath = stripQuotes(process.env.GOOGLE_APPLICATION_CREDENTIALS);
  if (credPath) {
    process.env.GOOGLE_APPLICATION_CREDENTIALS = credPath;
    initializeApp();
    return;
  }
  throw new Error(
    "Set FIREBASE_SERVICE_ACCOUNT_JSON or GOOGLE_APPLICATION_CREDENTIALS in .env.local (see .env.example).",
  );
}

function splitDisplayName(displayName) {
  const s = String(displayName || "").trim();
  if (!s) return { firstName: "", lastName: "" };
  const parts = s.split(/\s+/);
  return {
    firstName: parts[0] || "",
    lastName: parts.length > 1 ? parts.slice(1).join(" ") : "",
  };
}

function parseArgs() {
  const argv = process.argv.slice(2);
  let uid;
  let email;
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === "--uid" && argv[i + 1]) {
      uid = argv[i + 1];
      i += 1;
    } else if (argv[i]?.startsWith("--")) {
      continue;
    } else if (argv[i] && !email && !uid) {
      email = argv[i];
    }
  }
  return { uid, email };
}

async function main() {
  initAdmin();

  const fromEnv =
    process.env.SHOP_ADMIN_EMAIL?.trim() || process.env.SHOP_ADMIN_UID?.trim();
  const { uid: uidArg, email: emailArg } = parseArgs();

  let uid = uidArg || (fromEnv?.includes("@") ? null : fromEnv) || null;
  let email = emailArg || (fromEnv?.includes("@") ? fromEnv : null) || null;

  if (!uid && !email) {
    console.error("Set SHOP_ADMIN_EMAIL in .env.local (or pass: pnpm shop:admin -- you@email.com)");
    process.exit(1);
  }

  const auth = getAuth();
  if (!uid && email) {
    const user = await auth.getUserByEmail(email.trim().toLowerCase());
    uid = user.uid;
  }

  const userRecord = await auth.getUser(uid);
  const db = getFirestore(getApp(), DB);
  const ref = db.collection("useraccounts").doc(uid);
  const snap = await ref.get();

  if (!snap.exists) {
    const { firstName, lastName } = splitDisplayName(userRecord.displayName);
    await ref.set({
      uid,
      email: userRecord.email || email || "",
      firstName,
      lastName,
      admin: true,
      guest: false,
      orderHistory: [],
      orderDetails: {},
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });
    console.log(
      `OK — created useraccounts/${uid} with admin: true (database "${DB}").`,
    );
    return;
  }

  await ref.set(
    {
      admin: true,
      updatedAt: FieldValue.serverTimestamp(),
    },
    { merge: true },
  );

  console.log(`OK — useraccounts/${uid} admin set to true (database "${DB}").`);
}

main().catch((e) => {
  console.error(e.message || e);
  process.exit(1);
});

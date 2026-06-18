import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import {
  getFirebaseAdminBucket,
  getFirebaseAdminDb,
  verifyFirebaseIdToken,
} from "@/lib/firebase-admin-server";
import { USER_ACCOUNTS_COLLECTION } from "@/lib/user-accounts";

export const maxDuration = 60;

const MAX_BYTES = 8 * 1024 * 1024;

function safeFileName(name) {
  const base = String(name || "image").split(/[/\\]/).pop() || "image";
  return base.replace(/[^a-zA-Z0-9._-]+/g, "_").slice(0, 120);
}

function isSafeCatalogSlug(slug) {
  if (!slug || typeof slug !== "string") return false;
  if (slug.length > 200) return false;
  return /^[a-zA-Z0-9_-]+$/.test(slug);
}

function buildFirebaseDownloadUrl(bucketName, objectPath, token) {
  const enc = encodeURIComponent(objectPath);
  return `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/${enc}?alt=media&token=${token}`;
}

export async function POST(request) {
  const authHeader = request.headers.get("authorization") || "";
  const idToken = authHeader.startsWith("Bearer ") ? authHeader.slice(7).trim() : "";
  if (!idToken) {
    return NextResponse.json({ ok: false, error: "Unauthorized." }, { status: 401 });
  }

  let uid;
  try {
    const decoded = await verifyFirebaseIdToken(idToken);
    uid = decoded.uid;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid token." }, { status: 401 });
  }

  let formData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid form data." }, { status: 400 });
  }

  const slugRaw = formData.get("slug");
  const slug = typeof slugRaw === "string" ? slugRaw.trim() : "";
  if (!isSafeCatalogSlug(slug)) {
    return NextResponse.json({ ok: false, error: "Invalid product slug." }, { status: 400 });
  }

  const file = formData.get("file");
  if (!file || typeof file !== "object" || !("arrayBuffer" in file)) {
    return NextResponse.json({ ok: false, error: "Missing file." }, { status: 400 });
  }

  const type = "type" in file && typeof file.type === "string" ? file.type : "";
  if (!type.startsWith("image/")) {
    return NextResponse.json({ ok: false, error: "File must be an image." }, { status: 400 });
  }

  const size = "size" in file && typeof file.size === "number" ? file.size : 0;
  if (size <= 0 || size > MAX_BYTES) {
    return NextResponse.json(
      { ok: false, error: size > MAX_BYTES ? "Max file size is 8 MB." : "Empty file." },
      { status: 400 },
    );
  }

  try {
    const db = getFirebaseAdminDb();
    const acc = await db.collection(USER_ACCOUNTS_COLLECTION).doc(uid).get();
    if (!acc.exists || !acc.data()?.admin) {
      return NextResponse.json({ ok: false, error: "Forbidden." }, { status: 403 });
    }

    const bucket = getFirebaseAdminBucket();
    const objectPath = `catalog-products/${slug}/${Date.now()}-${safeFileName("name" in file ? file.name : "")}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    const downloadToken = randomUUID();
    const gcsFile = bucket.file(objectPath);

    await gcsFile.save(buffer, {
      metadata: {
        contentType: type,
        metadata: {
          firebaseStorageDownloadTokens: downloadToken,
        },
      },
    });

    const url = buildFirebaseDownloadUrl(bucket.name, objectPath, downloadToken);
    return NextResponse.json({ ok: true, url });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Upload failed.",
      },
      { status: 500 },
    );
  }
}

import { NextResponse } from "next/server";
import {
  getFirebaseAdminDb,
  verifyFirebaseIdToken,
} from "@/lib/firebase-admin-server";
import { USER_ACCOUNTS_COLLECTION } from "@/lib/user-accounts";
import { getFirestoreGalleryProducts } from "@/lib/gallery-firestore";

export async function GET(request) {
  const authHeader = request.headers.get("authorization") || "";
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7).trim()
    : "";
  if (!token) {
    return NextResponse.json({ ok: false, error: "Unauthorized." }, { status: 401 });
  }

  let uid;
  try {
    const decoded = await verifyFirebaseIdToken(token);
    uid = decoded.uid;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid token." }, { status: 401 });
  }

  try {
    const db = getFirebaseAdminDb();
    const acc = await db.collection(USER_ACCOUNTS_COLLECTION).doc(uid).get();
    if (!acc.exists || !acc.data()?.admin) {
      return NextResponse.json({ ok: false, error: "Forbidden." }, { status: 403 });
    }

    const products = await getFirestoreGalleryProducts();
    return NextResponse.json({ ok: true, count: products.length, products });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Failed to load catalog.",
      },
      { status: 500 },
    );
  }
}

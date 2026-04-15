/**
 * Server-side Firestore data access layer.
 * Uses Firebase Admin SDK; falls back to mock data if Admin is not configured.
 * Only import this file from Server Components or API routes.
 */

import type { Product, Shop, FirestoreUser } from "@/types";
import type { Firestore } from "firebase-admin/firestore";

async function tryGetAdminDb(): Promise<Firestore | null> {
  try {
    const { adminDb } = await import("@/lib/firebase-admin");
    return adminDb as Firestore;
  } catch {
    if (process.env.NODE_ENV === "development") {
      console.warn("[Mi Tierra] Admin SDK not ready — falling back to mock data.");
    }
    return null;
  }
}

// ── Products ───────────────────────────────────────────────────────────────

export async function fetchProducts(filters: {
  category?: string;
  province?: string;
}): Promise<{ products: Product[]; isMock: boolean }> {
  const db = await tryGetAdminDb();

  if (!db) {
    const { MOCK_PRODUCTS } = await import("@/data/mock");
    let results = [...MOCK_PRODUCTS];
    if (filters.category) results = results.filter((p) => p.category === filters.category);
    if (filters.province) results = results.filter((p) => p.provinceOrigin === filters.province);
    return { products: results, isMock: true };
  }

  // Primary filter in Firestore (uses indexed fields); secondary filter in-memory.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let q: any = db.collection("products");
  if (filters.category) {
    q = q.where("category", "==", filters.category).orderBy("createdAt", "desc");
  } else if (filters.province) {
    q = q.where("provinceOrigin", "==", filters.province).orderBy("createdAt", "desc");
  } else {
    q = q.orderBy("createdAt", "desc").limit(40);
  }

  const snap = await q.get();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let products: Product[] = snap.docs.map((doc: any) => {
    const d = doc.data();
    return {
      id: doc.id,
      shopId: d.shopId,
      shopName: d.shopName ?? "",
      title: d.title,
      price: d.price,
      category: d.category,
      images: d.images ?? [],
      stock: d.stock ?? 0,
      provinceOrigin: d.provinceOrigin,
      createdAt: d.createdAt?.toDate?.() ?? new Date(),
    } as Product;
  });

  // Second filter in-memory to avoid a 3-field composite index
  if (filters.category && filters.province) {
    products = products.filter((p) => p.provinceOrigin === filters.province);
  }

  return { products, isMock: false };
}

export async function fetchProduct(id: string): Promise<Product | null> {
  const db = await tryGetAdminDb();

  if (!db) {
    const { MOCK_PRODUCTS } = await import("@/data/mock");
    return MOCK_PRODUCTS.find((p) => p.id === id) ?? null;
  }

  const snap = await db.collection("products").doc(id).get();
  if (!snap.exists) return null;
  const d = snap.data()!;
  return {
    id: snap.id,
    shopId: d.shopId,
    shopName: d.shopName ?? "",
    title: d.title,
    price: d.price,
    category: d.category,
    images: d.images ?? [],
    stock: d.stock ?? 0,
    provinceOrigin: d.provinceOrigin,
    createdAt: d.createdAt?.toDate?.() ?? new Date(),
  };
}

// ── Shops ──────────────────────────────────────────────────────────────────

export async function fetchShop(shopId: string): Promise<Shop | null> {
  const db = await tryGetAdminDb();

  if (!db) {
    const { MOCK_ARTISANS } = await import("@/data/mock");
    const a = MOCK_ARTISANS.find((x) => x.shopId === shopId);
    if (!a) return null;
    return {
      id: a.shopId,
      ownerId: a.shopId,
      shopName: a.shopName,
      bio: `Artesano de ${a.province} con ${a.totalProducts} productos únicos.`,
      rating: a.rating,
      createdAt: new Date(),
    };
  }

  const snap = await db.collection("shops").doc(shopId).get();
  if (!snap.exists) return null;
  const d = snap.data()!;
  return {
    id: snap.id,
    ownerId: d.ownerId,
    shopName: d.shopName,
    bio: d.bio ?? "",
    rating: d.rating ?? 0,
    createdAt: d.createdAt?.toDate?.() ?? new Date(),
    bankName: d.bankName,
    accountType: d.accountType,
    accountNumber: d.accountNumber,
    accountHolderName: d.accountHolderName,
    cedula: d.cedula,
    shippingFee: d.shippingFee,
  };
}

export async function fetchShopProvince(ownerId: string): Promise<string> {
  const db = await tryGetAdminDb();
  if (!db) {
    const { MOCK_ARTISANS } = await import("@/data/mock");
    return MOCK_ARTISANS.find((a) => a.shopId === ownerId)?.province ?? "";
  }
  const snap = await db.collection("users").doc(ownerId).get();
  return (snap.data() as Partial<FirestoreUser>)?.province ?? "";
}

export async function fetchShopProducts(shopId: string): Promise<Product[]> {
  const db = await tryGetAdminDb();

  if (!db) {
    const { MOCK_PRODUCTS } = await import("@/data/mock");
    return MOCK_PRODUCTS.filter((p) => p.shopId === shopId);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const snap = await (db.collection("products") as any)
    .where("shopId", "==", shopId)
    .orderBy("createdAt", "desc")
    .get();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return snap.docs.map((doc: any) => {
    const d = doc.data();
    return {
      id: doc.id,
      shopId: d.shopId,
      shopName: d.shopName ?? "",
      title: d.title,
      price: d.price,
      category: d.category,
      images: d.images ?? [],
      stock: d.stock ?? 0,
      provinceOrigin: d.provinceOrigin,
      createdAt: d.createdAt?.toDate?.() ?? new Date(),
    } as Product;
  });
}

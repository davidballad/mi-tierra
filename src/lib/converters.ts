/**
 * Typed Firestore data converters for all Mi Tierra collections.
 * Ensures every document read/write is fully typed — no `any` escape hatches.
 */

import {
  type FirestoreDataConverter,
  type QueryDocumentSnapshot,
  type SnapshotOptions,
  Timestamp,
} from "firebase/firestore";
import type { FirestoreUser, Shop, Product, Order } from "@/types";

function toDate(value: unknown): Date {
  if (value instanceof Timestamp) return value.toDate();
  if (value instanceof Date) return value;
  return new Date();
}

export const userConverter: FirestoreDataConverter<FirestoreUser> = {
  toFirestore(user: FirestoreUser) {
    return { ...user };
  },
  fromFirestore(snap: QueryDocumentSnapshot, opts?: SnapshotOptions): FirestoreUser {
    const d = snap.data(opts);
    return {
      uid: snap.id,
      email: d.email as string,
      role: d.role as FirestoreUser["role"],
      province: d.province as string,
      createdAt: toDate(d.createdAt),
    };
  },
};

export const shopConverter: FirestoreDataConverter<Shop> = {
  toFirestore(shop: Shop) {
    return { ...shop };
  },
  fromFirestore(snap: QueryDocumentSnapshot, opts?: SnapshotOptions): Shop {
    const d = snap.data(opts);
    return {
      id: snap.id,
      ownerId: d.ownerId as string,
      shopName: d.shopName as string,
      bio: d.bio as string,
      rating: d.rating as number,
      createdAt: toDate(d.createdAt),
    };
  },
};

export const productConverter: FirestoreDataConverter<Product> = {
  toFirestore(product: Product) {
    return { ...product };
  },
  fromFirestore(snap: QueryDocumentSnapshot, opts?: SnapshotOptions): Product {
    const d = snap.data(opts);
    return {
      id: snap.id,
      shopId: d.shopId as string,
      shopName: d.shopName as string,
      title: d.title as string,
      price: d.price as number,
      category: d.category as Product["category"],
      images: (d.images as string[]) ?? [],
      stock: d.stock as number,
      provinceOrigin: d.provinceOrigin as string,
      createdAt: toDate(d.createdAt),
    };
  },
};

export const orderConverter: FirestoreDataConverter<Order> = {
  toFirestore(order: Order) {
    return { ...order };
  },
  fromFirestore(snap: QueryDocumentSnapshot, opts?: SnapshotOptions): Order {
    const d = snap.data(opts);
    return {
      id: snap.id,
      buyerId: d.buyerId as string,
      shopId: d.shopId as string,
      items: (d.items as Order["items"]) ?? [],
      totalPrice: d.totalPrice as number,
      platformFee: d.platformFee as number,
      status: d.status as Order["status"],
      paymentMethod: d.paymentMethod as Order["paymentMethod"],
      buyerWhatsApp: (d.buyerWhatsApp as string) ?? "",
      paymentProofUrl: d.paymentProofUrl as string | undefined,
      createdAt: toDate(d.createdAt),
    };
  },
};

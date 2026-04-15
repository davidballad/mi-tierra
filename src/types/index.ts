/**
 * Shared TypeScript types for Mi Tierra — mirrors the Firestore schema exactly.
 */

export type UserRole = "buyer" | "seller";

/** The eight built-in categories — used for filter UI and the categories browse page. */
export type PredefinedCategory =
  | "Textiles de Otavalo"
  | "Sombreros de Paja Toquilla"
  | "Cerámica de Cuenca"
  | "Tagua y Bisutería"
  | "Pintura Naif"
  | "Artesanías en Madera"
  | "Joyería en Plata"
  | "Tejidos Andinos";

/**
 * Product category stored in Firestore.
 * Accepts any string so artisans can define custom categories beyond the eight presets.
 */
export type ProductCategory = string;

export type OrderStatus =
  | "pending"
  | "paid"
  | "shipped"
  | "delivered"
  | "cancelled";

export type PaymentMethod = "transferencia" | "contra_entrega";

/** /users/{uid} */
export interface FirestoreUser {
  uid: string;
  email: string;
  role: UserRole;
  province: string;
  createdAt: Date;
}

/** /shops/{shopId} */
export interface Shop {
  id: string;
  ownerId: string;
  shopName: string;
  bio: string;
  rating: number;
  createdAt: Date;
  /** Bank details — filled in by the seller via their dashboard */
  bankName?: string;
  accountType?: "ahorros" | "corriente";
  accountNumber?: string;
  accountHolderName?: string;
  cedula?: string;
  /** Flat shipping fee in USD for one order, regardless of item count. 0 = free. */
  shippingFee?: number;
}

/** /products/{id} */
export interface Product {
  id: string;
  shopId: string;
  /** Denormalized for display — avoids extra reads on the listing page. */
  shopName: string;
  title: string;
  price: number;
  category: ProductCategory;
  images: string[];
  stock: number;
  provinceOrigin: string;
  createdAt: Date;
}

/** A single line item inside an order. */
export interface OrderItem {
  productId: string;
  title: string;   // denormalized so it survives product edits
  price: number;
  quantity: number;
}

/** /orders/{id} */
export interface Order {
  id: string;
  buyerId: string;
  shopId: string;
  items: OrderItem[];
  totalPrice: number;
  platformFee: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  buyerWhatsApp: string;
  /** Firebase Storage download URL — only set for transferencia orders. */
  paymentProofUrl?: string;
  /** Shipping fee charged at the time of order (snapshot from shop, in USD). */
  shippingFee: number;
  createdAt: Date;
}

/**
 * Serializable product snapshot stored in the cart.
 * Omits `createdAt` (Date) so it can be passed as a server-component prop
 * and safely round-tripped through localStorage.
 */
export type CartProduct = Omit<Product, "createdAt">;

/** A single line item in the shopping cart. */
export interface CartItem {
  product: CartProduct;
  quantity: number;
}

/** UI model for the artisan showcase cards. */
export interface ArtisanCard {
  shopId: string;
  shopName: string;
  ownerName: string;
  province: string;
  rating: number;
  avatar: string;
  totalProducts: number;
}

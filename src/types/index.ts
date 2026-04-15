/**
 * Shared TypeScript types for Mi Tierra — mirrors the Firestore schema exactly.
 */

export type UserRole = "buyer" | "seller";

export type ProductCategory =
  | "Textiles de Otavalo"
  | "Sombreros de Paja Toquilla"
  | "Cerámica de Cuenca"
  | "Tagua y Bisutería"
  | "Pintura Naif"
  | "Artesanías en Madera"
  | "Joyería en Plata"
  | "Tejidos Andinos";

export type OrderStatus =
  | "pending"
  | "paid"
  | "shipped"
  | "delivered"
  | "cancelled";

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

/** /orders/{id} */
export interface Order {
  id: string;
  buyerId: string;
  shopId: string;
  productId: string;
  quantity: number;
  totalPrice: number;
  platformFee: number;
  status: OrderStatus;
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

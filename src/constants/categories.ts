/**
 * Ecuadorian artisan product taxonomy — single source of truth for all category references.
 */

export const PRODUCT_CATEGORIES = [
  { value: "Textiles de Otavalo", label: "Textiles de Otavalo", icon: "🧵" },
  { value: "Sombreros de Paja Toquilla", label: "Sombreros de Paja Toquilla", icon: "👒" },
  { value: "Cerámica de Cuenca", label: "Cerámica de Cuenca", icon: "🏺" },
  { value: "Tagua y Bisutería", label: "Tagua y Bisutería", icon: "📿" },
  { value: "Pintura Naif", label: "Pintura Naif", icon: "🎨" },
  { value: "Artesanías en Madera", label: "Artesanías en Madera", icon: "🪵" },
  { value: "Joyería en Plata", label: "Joyería en Plata", icon: "💍" },
  { value: "Tejidos Andinos", label: "Tejidos Andinos", icon: "🧶" },
] as const;

export type ProductCategoryValue = (typeof PRODUCT_CATEGORIES)[number]["value"];

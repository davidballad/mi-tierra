/**
 * /producto/[id] — product detail page.
 * Server component: fetches product + shop, passes serializable data to client sub-components.
 */

import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { fetchProduct, fetchShop } from "@/lib/db";
import ImageGallery from "./ImageGallery";
import AddToCartButton from "./AddToCartButton";
import { MapPin, Store, ArrowLeft } from "lucide-react";
import type { CartProduct } from "@/types";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = await fetchProduct(id);
  if (!product) return { title: "Producto | Mi Tierra" };
  return {
    title: `${product.title} | Mi Tierra`,
    description: `${product.category} de ${product.provinceOrigin} — $${product.price.toFixed(2)}`,
  };
}

export default async function ProductoPage({ params }: Props) {
  const { id } = await params;
  const [product, ] = await Promise.all([
    fetchProduct(id),
  ]);

  if (!product) notFound();

  const shop = await fetchShop(product.shopId);

  // Strip non-serializable Date before passing to client components
  const cartProduct: CartProduct = {
    id: product.id,
    shopId: product.shopId,
    shopName: product.shopName,
    title: product.title,
    price: product.price,
    category: product.category,
    images: product.images,
    stock: product.stock,
    provinceOrigin: product.provinceOrigin,
  };

  const stockLabel =
    product.stock === 0
      ? "Agotado"
      : product.stock <= 3
      ? `¡Solo ${product.stock} en stock!`
      : `${product.stock} disponibles`;

  const stockColor =
    product.stock === 0
      ? "text-red-500"
      : product.stock <= 3
      ? "text-amber-600"
      : "text-forest";

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-cream">
        {/* Breadcrumb */}
        <div className="border-b border-sand bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-2 text-xs text-muted-foreground">
            <Link href="/explorar" className="hover:text-terracotta transition-colors flex items-center gap-1">
              <ArrowLeft className="h-3 w-3" />
              Explorar
            </Link>
            <span>/</span>
            <Link
              href={`/explorar?categoria=${encodeURIComponent(product.category)}`}
              className="hover:text-terracotta transition-colors"
            >
              {product.category}
            </Link>
            <span>/</span>
            <span className="text-forest line-clamp-1">{product.title}</span>
          </div>
        </div>

        {/* Main content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Left — image gallery */}
            <ImageGallery images={product.images} title={product.title} />

            {/* Right — product info */}
            <div className="space-y-6">
              {/* Category + province */}
              <div className="flex flex-wrap items-center gap-2">
                <Link
                  href={`/explorar?categoria=${encodeURIComponent(product.category)}`}
                  className="inline-flex items-center rounded-full bg-forest/10 text-forest text-xs font-semibold px-3 py-1 hover:bg-forest hover:text-cream transition-colors"
                >
                  {product.category}
                </Link>
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3 text-terracotta" />
                  {product.provinceOrigin}
                </span>
              </div>

              {/* Title */}
              <h1 className="font-heading text-3xl md:text-4xl font-bold text-forest leading-tight">
                {product.title}
              </h1>

              {/* Price */}
              <div className="flex items-baseline gap-3">
                <span className="font-heading text-4xl font-bold text-terracotta">
                  ${product.price.toFixed(2)}
                </span>
                <span className="text-sm text-muted-foreground">USD</span>
              </div>

              {/* Stock */}
              <p className={`text-sm font-medium ${stockColor}`}>{stockLabel}</p>

              {/* Divider */}
              <div className="border-t border-sand" />

              {/* Add to cart */}
              <AddToCartButton product={cartProduct} />

              {/* Divider */}
              <div className="border-t border-sand" />

              {/* Shop info */}
              <div className="flex items-center gap-3 p-4 rounded-xl border border-sand bg-white hover:border-terracotta transition-colors group">
                <div className="h-10 w-10 rounded-full bg-forest/10 flex items-center justify-center flex-shrink-0">
                  <Store className="h-5 w-5 text-forest" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-muted-foreground">Vendido por</p>
                  <p className="text-sm font-semibold text-forest group-hover:text-terracotta transition-colors truncate">
                    {product.shopName}
                  </p>
                  {shop?.bio && (
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                      {shop.bio}
                    </p>
                  )}
                </div>
                <Link
                  href={`/tienda/${product.shopId}`}
                  className="text-xs text-terracotta font-semibold hover:underline flex-shrink-0"
                >
                  Ver tienda →
                </Link>
              </div>

              {/* Trust badges */}
              <ul className="space-y-1.5 text-xs text-muted-foreground">
                {[
                  "✓ Artesanía ecuatoriana auténtica",
                  "✓ Pagos seguros (próximamente)",
                  "✓ Soporte en español",
                ].map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

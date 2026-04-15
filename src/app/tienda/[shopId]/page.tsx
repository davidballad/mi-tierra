/**
 * /tienda/[shopId] — public artisan shop page.
 * Fetches shop info, owner province, and shop products server-side.
 */

import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ShopHeader from "@/components/ShopHeader";
import ProductGrid from "@/components/ProductGrid";
import { fetchShop, fetchShopProvince, fetchShopProducts } from "@/lib/db";

interface PageProps {
  params: Promise<{ shopId: string }>;
}

export default async function TiendaPage({ params }: PageProps) {
  const { shopId } = await params;

  const [shop, products] = await Promise.all([
    fetchShop(shopId),
    fetchShopProducts(shopId),
  ]);

  if (!shop) notFound();

  const province = await fetchShopProvince(shop.ownerId);

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <ShopHeader
          shop={shop}
          province={province}
          productCount={products.length}
        />

        <ProductGrid
          products={products}
          title="Productos de esta Tienda"
          subtitle={
            products.length === 0
              ? "Este artesano aún no ha publicado productos."
              : `${products.length} ${products.length === 1 ? "producto disponible" : "productos disponibles"}`
          }
        />
      </main>
      <Footer />
    </>
  );
}

export async function generateMetadata({ params }: PageProps) {
  const { shopId } = await params;
  const shop = await fetchShop(shopId);
  if (!shop) return { title: "Tienda no encontrada | Mi Tierra" };
  return {
    title: `${shop.shopName} | Mi Tierra`,
    description: shop.bio || `Explora los productos de ${shop.shopName} en Mi Tierra.`,
  };
}

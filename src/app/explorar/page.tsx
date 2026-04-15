/**
 * /explorar — browse and filter all products by category and province.
 * Server component: Firestore query runs on the server, filtered URL params
 * are shareable and bookmarkable.
 */

import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductGrid from "@/components/ProductGrid";
import ExplorarFilters from "@/components/ExplorarFilters";
import { fetchProducts } from "@/lib/db";
import type { ProductCategory } from "@/types";

interface PageProps {
  searchParams: Promise<{ categoria?: string; provincia?: string }>;
}

function DevBanner() {
  return (
    <div className="bg-amber-50 border-b border-amber-200 text-amber-800 text-xs text-center py-2 px-4">
      Modo desarrollo — mostrando datos de ejemplo. Configura Firebase Admin para datos reales.
    </div>
  );
}

export default async function ExplorarPage({ searchParams }: PageProps) {
  const { categoria, provincia } = await searchParams;

  const { products, isMock } = await fetchProducts({
    category: categoria as ProductCategory | undefined,
    province: provincia,
  });

  const subtitle = buildSubtitle(products.length, categoria, provincia);

  return (
    <>
      <Navbar />
      {isMock && <DevBanner />}
      <main className="flex-1">
        {/* Page header */}
        <div className="bg-cream border-b border-sand py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-forest">
              Explorar Artesanías
            </h1>
            <p className="text-muted-foreground mt-2">{subtitle}</p>
          </div>
        </div>

        {/* Sticky filters — Suspense required for useSearchParams */}
        <Suspense
          fallback={
            <div className="h-24 bg-cream border-b border-sand animate-pulse" />
          }
        >
          <ExplorarFilters />
        </Suspense>

        {/* Product grid */}
        <ProductGrid
          products={products}
          title=""
          subtitle=""
        />
      </main>
      <Footer />
    </>
  );
}

function buildSubtitle(count: number, category?: string, province?: string): string {
  const parts: string[] = [];
  if (category) parts.push(category);
  if (province) parts.push(province);

  if (parts.length === 0) {
    return `${count} productos de artesanos ecuatorianos`;
  }
  return `${count} ${count === 1 ? "resultado" : "resultados"} en ${parts.join(" · ")}`;
}

export function generateMetadata() {
  return {
    title: "Explorar Artesanías | Mi Tierra",
    description:
      "Navega por cientos de artesanías ecuatorianas auténticas. Filtra por categoría y provincia.",
  };
}

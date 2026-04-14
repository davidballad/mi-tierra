/**
 * Mi Tierra landing page — assembles all hero sections with mock data.
 * Replace MOCK_* imports with live Firestore queries once Firebase is configured.
 */

import Navbar from "@/components/Navbar";
import HeroBanner from "@/components/HeroBanner";
import CategoryFilter from "@/components/CategoryFilter";
import ProductGrid from "@/components/ProductGrid";
import FeaturedArtisans from "@/components/FeaturedArtisans";
import Footer from "@/components/Footer";
import { MOCK_PRODUCTS, MOCK_ARTISANS } from "@/data/mock";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <HeroBanner />
        <CategoryFilter />
        <ProductGrid products={MOCK_PRODUCTS} />
        <FeaturedArtisans artisans={MOCK_ARTISANS} />
      </main>
      <Footer />
    </>
  );
}

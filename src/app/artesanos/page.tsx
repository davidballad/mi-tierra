/**
 * /artesanos — artisan directory (placeholder, full implementation upcoming).
 */

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FeaturedArtisans from "@/components/FeaturedArtisans";
import { MOCK_ARTISANS } from "@/data/mock";

export const metadata = {
  title: "Artesanos | Mi Tierra",
  description: "Conoce a los mejores artesanos de Ecuador.",
};

export default function ArtesanosPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <div className="bg-cream border-b border-sand py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-forest">
              Artesanos Ecuatorianos
            </h1>
            <p className="text-muted-foreground mt-2">
              Conoce a los maestros detrás de cada creación
            </p>
          </div>
        </div>
        <FeaturedArtisans artisans={MOCK_ARTISANS} />
      </main>
      <Footer />
    </>
  );
}

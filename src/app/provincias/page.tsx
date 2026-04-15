/**
 * /provincias — browse artisans and products by province (placeholder).
 */

import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ECUADOR_PROVINCES } from "@/constants/provinces";
import { MapPin } from "lucide-react";

export const metadata = {
  title: "Provincias | Mi Tierra",
  description: "Explora artesanías por provincia ecuatoriana.",
};

export default function ProvinciasPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <div className="bg-cream border-b border-sand py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-forest">
              Provincias del Ecuador
            </h1>
            <p className="text-muted-foreground mt-2">
              Descubre las artesanías únicas de cada rincón del país
            </p>
          </div>
        </div>

        <section className="bg-cream py-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {ECUADOR_PROVINCES.map((provincia) => (
                <Link
                  key={provincia}
                  href={`/explorar?provincia=${encodeURIComponent(provincia)}`}
                  className="flex items-center gap-2 p-4 rounded-xl border border-sand bg-white
                             hover:border-terracotta hover:shadow-sm transition-all group"
                >
                  <MapPin className="h-4 w-4 text-terracotta flex-shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium text-forest group-hover:text-terracotta transition-colors">
                    {provincia}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

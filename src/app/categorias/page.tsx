/**
 * /categorias — all product categories with links to /explorar filtered view.
 */

import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { PRODUCT_CATEGORIES } from "@/constants/categories";

export const metadata = {
  title: "Categorías | Mi Tierra",
  description: "Explora todas las categorías de artesanías ecuatorianas.",
};

export default function CategoriasPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 bg-cream">
        <div className="border-b border-sand py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-forest">Categorías</h1>
            <p className="text-muted-foreground mt-2">Ocho tradiciones artesanales del Ecuador</p>
          </div>
        </div>

        <section className="py-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {PRODUCT_CATEGORIES.map(({ value, label, icon }) => (
              <Link
                key={value}
                href={`/explorar?categoria=${encodeURIComponent(value)}`}
                className="flex flex-col items-center justify-center gap-3 p-8 rounded-xl border-2
                           border-sand bg-white hover:border-terracotta hover:shadow-md
                           transition-all group text-center"
              >
                <span className="text-5xl">{icon}</span>
                <span className="font-heading font-semibold text-forest group-hover:text-terracotta transition-colors">
                  {label}
                </span>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

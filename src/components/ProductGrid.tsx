/**
 * Responsive 2→4 column product grid for the marketplace listing.
 */

import ProductCard from "@/components/ProductCard";
import type { Product } from "@/types";

interface ProductGridProps {
  products: Product[];
  title?: string;
  subtitle?: string;
}

export default function ProductGrid({
  products,
  title = "Productos Destacados",
  subtitle = "Lo mejor de los artesanos ecuatorianos, directo a ti",
}: ProductGridProps) {
  return (
    <section className="bg-cream py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-heading text-3xl md:text-4xl font-bold text-forest mb-2">
          {title}
        </h2>
        <p className="text-muted-foreground mb-8">{subtitle}</p>

        {products.length === 0 ? (
          <p className="text-center text-muted-foreground py-16">
            No se encontraron productos.
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

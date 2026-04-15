/**
 * 404 for unknown product IDs.
 */

import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Package } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export default function ProductNotFound() {
  return (
    <>
      <Navbar />
      <main className="flex-1 flex items-center justify-center bg-cream py-24 px-4">
        <div className="text-center max-w-md">
          <div className="flex justify-center mb-6">
            <div className="h-20 w-20 rounded-full bg-sand flex items-center justify-center">
              <Package className="h-10 w-10 text-terracotta" />
            </div>
          </div>
          <h1 className="font-heading text-3xl font-bold text-forest mb-3">
            Producto no encontrado
          </h1>
          <p className="text-muted-foreground mb-8">
            Este producto no existe o ya no está disponible. Explora más artesanías ecuatorianas.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/explorar"
              className={
                buttonVariants({ variant: "default" }) +
                " bg-terracotta text-white hover:bg-terracotta-light"
              }
            >
              Explorar Productos
            </Link>
            <Link href="/artesanos" className={buttonVariants({ variant: "outline" })}>
              Ver Artesanos
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

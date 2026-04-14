/**
 * Full-width hero section with tagline, sub-copy, and primary CTAs.
 */

import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ShoppingBag, Store } from "lucide-react";

const STATS = [
  { value: "500+", label: "Artesanos activos" },
  { value: "2.800+", label: "Productos únicos" },
  { value: "24", label: "Provincias representadas" },
] as const;

export default function HeroBanner() {
  return (
    <section className="relative min-h-[88vh] flex items-center overflow-hidden bg-terracotta">
      {/* Decorative gradient blobs */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-20"
        style={{
          background:
            "radial-gradient(ellipse at 15% 60%, #e8816a 0%, transparent 55%), " +
            "radial-gradient(ellipse at 85% 20%, #2d5016 0%, transparent 45%)",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
        <div className="max-w-3xl">
          {/* Badge */}
          <span className="inline-flex items-center gap-2 bg-white/10 text-sand border border-white/20 text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-8">
            🇪🇨 Hecho en Ecuador, con amor
          </span>

          {/* Headline */}
          <h1 className="font-heading text-5xl md:text-7xl font-bold text-cream leading-tight mb-6">
            Descubre el arte que vive en{" "}
            <em className="text-sand not-italic">tus manos</em>
          </h1>

          {/* Sub-copy */}
          <p className="text-sand/80 text-lg md:text-xl leading-relaxed mb-10 max-w-2xl">
            Conectamos a los mejores artesanos ecuatorianos contigo. Sombreros
            de paja toquilla, tejidos andinos, cerámica de Cuenca — cada pieza
            cuenta una historia.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/explorar"
              className={cn(
                buttonVariants({ size: "lg" }),
                "bg-cream text-terracotta hover:bg-sand font-semibold text-base px-8",
              )}
            >
              <ShoppingBag className="mr-2 h-5 w-5" />
              Explorar Productos
            </Link>
            <Link
              href="/vender"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "border-2 border-cream text-cream hover:bg-cream hover:text-terracotta font-semibold text-base px-8 bg-transparent",
              )}
            >
              <Store className="mr-2 h-5 w-5" />
              Vende tu Arte
            </Link>
          </div>

          {/* Stats bar */}
          <div className="flex flex-wrap gap-10 mt-16 pt-8 border-t border-cream/20">
            {STATS.map(({ value, label }) => (
              <div key={label}>
                <div className="font-heading text-3xl font-bold text-cream">{value}</div>
                <div className="text-sand/70 text-sm mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

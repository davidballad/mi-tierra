/**
 * Horizontally scrollable artisan showcase — avatar, shop name, province,
 * star rating, and "Ver Tienda" CTA.
 */

import Image from "next/image";
import Link from "next/link";
import { Star, MapPin } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import type { ArtisanCard } from "@/types";

interface FeaturedArtisansProps {
  artisans: ArtisanCard[];
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} de 5 estrellas`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          className={`h-3.5 w-3.5 ${
            n <= Math.round(rating)
              ? "text-amber-400 fill-amber-400"
              : "text-gray-200 fill-gray-200"
          }`}
        />
      ))}
      <span className="text-xs text-muted-foreground ml-1">{rating.toFixed(1)}</span>
    </div>
  );
}

export default function FeaturedArtisans({ artisans }: FeaturedArtisansProps) {
  return (
    <section className="py-14 bg-sand/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-heading text-3xl md:text-4xl font-bold text-forest mb-2">
          Artesanos Destacados
        </h2>
        <p className="text-muted-foreground mb-8">
          Conoce a los maestros detrás de cada obra
        </p>

        <div className="flex gap-5 overflow-x-auto pb-4 scrollbar-none">
          {artisans.map((artisan) => (
            <Card
              key={artisan.shopId}
              className="flex-shrink-0 w-52 border-sand hover:border-terracotta transition-all hover:shadow-md bg-white"
            >
              <CardContent className="p-4 flex flex-col items-center text-center">
                {/* Avatar */}
                <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-sand-dark mb-3">
                  <Image
                    src={artisan.avatar}
                    alt={artisan.ownerName}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </div>

                <h3 className="font-heading font-semibold text-sm text-forest leading-tight">
                  {artisan.shopName}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5 truncate w-full">
                  {artisan.ownerName}
                </p>

                <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
                  <MapPin className="h-3 w-3 flex-shrink-0" />
                  {artisan.province}
                </div>

                <div className="mt-2">
                  <StarRating rating={artisan.rating} />
                </div>

                <p className="text-xs text-muted-foreground mt-1">
                  {artisan.totalProducts} productos
                </p>

                <Link
                  href={`/tienda/${artisan.shopId}`}
                  className={cn(
                    buttonVariants({ variant: "outline", size: "sm" }),
                    "mt-3 w-full border-terracotta text-terracotta hover:bg-terracotta hover:text-white text-xs",
                  )}
                >
                  Ver Tienda
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * Shop profile header — banner, avatar/initials, name, province, rating, bio.
 */

import Image from "next/image";
import { MapPin, Star, Package } from "lucide-react";
import type { Shop } from "@/types";

interface ShopHeaderProps {
  shop: Shop;
  province?: string;
  avatarUrl?: string;
  productCount: number;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1" aria-label={`${rating} de 5 estrellas`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          className={`h-4 w-4 ${
            n <= Math.round(rating)
              ? "fill-amber-400 text-amber-400"
              : "fill-gray-200 text-gray-200"
          }`}
        />
      ))}
      <span className="text-sm text-muted-foreground ml-1">{rating.toFixed(1)}</span>
    </div>
  );
}

export default function ShopHeader({ shop, province, avatarUrl, productCount }: ShopHeaderProps) {
  const initials = shop.shopName
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <div className="bg-cream border-b border-sand">
      {/* Gradient banner */}
      <div className="h-36 bg-gradient-to-r from-terracotta via-terracotta-light to-forest" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        {/* Avatar */}
        <div className="-mt-14 mb-4">
          {avatarUrl ? (
            <div className="relative h-28 w-28 rounded-full overflow-hidden border-4 border-cream shadow-lg">
              <Image src={avatarUrl} alt={shop.shopName} fill className="object-cover" sizes="112px" />
            </div>
          ) : (
            <div className="h-28 w-28 rounded-full bg-forest border-4 border-cream shadow-lg flex items-center justify-center">
              <span className="text-cream text-3xl font-bold font-heading">{initials}</span>
            </div>
          )}
        </div>

        <h1 className="font-heading text-3xl md:text-4xl font-bold text-forest">
          {shop.shopName}
        </h1>

        <div className="flex flex-wrap items-center gap-4 mt-2 mb-3">
          {province && (
            <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 text-terracotta" />
              {province}
            </span>
          )}
          <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Package className="h-4 w-4 text-terracotta" />
            {productCount} {productCount === 1 ? "producto" : "productos"}
          </span>
        </div>

        <StarRating rating={shop.rating} />

        {shop.bio && (
          <p className="text-muted-foreground mt-3 max-w-2xl leading-relaxed text-sm md:text-base">
            {shop.bio}
          </p>
        )}
      </div>
    </div>
  );
}

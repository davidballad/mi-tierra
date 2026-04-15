/**
 * Individual product card — image, title, price, province badge, and shop name.
 */

import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import type { Product } from "@/types";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { title, price, provinceOrigin, shopName, images, category } = product;

  return (
    <Link href={`/producto/${product.id}`} className="block group">
    <Card className="overflow-hidden border-sand hover:border-terracotta transition-all hover:shadow-md bg-white h-full">
      {/* Product image */}
      <div className="relative aspect-square overflow-hidden bg-sand">
        <Image
          src={images[0] ?? "/placeholder.jpg"}
          alt={title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
        <div className="absolute top-2 left-2">
          <Badge className="bg-forest/90 text-white text-xs border-0">
            {category}
          </Badge>
        </div>
      </div>

      {/* Card content */}
      <CardContent className="p-3">
        <h3 className="font-medium text-sm text-gray-900 line-clamp-2 min-h-[2.5rem] leading-snug">
          {title}
        </h3>
        <p className="text-xs text-muted-foreground mt-1 truncate">{shopName}</p>
        <div className="flex items-center justify-between mt-2.5">
          <span className="font-semibold text-terracotta text-base">
            ${price.toFixed(2)}
          </span>
          <span className="flex items-center gap-0.5 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3 flex-shrink-0" />
            {provinceOrigin}
          </span>
        </div>
      </CardContent>
    </Card>
    </Link>
  );
}

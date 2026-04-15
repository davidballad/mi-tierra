/**
 * Quantity selector + add-to-cart button — client component.
 * Receives CartProduct (no Date fields) so it can be used as a server-component prop.
 */

"use client";

import { useState } from "react";
import { ShoppingCart, Check, Minus, Plus } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import type { CartProduct } from "@/types";

interface AddToCartButtonProps {
  product: CartProduct;
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const max = Math.min(product.stock, 10);

  function handleAdd() {
    addItem(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  if (product.stock === 0) {
    return (
      <button
        disabled
        className="w-full py-3 rounded-md bg-sand text-muted-foreground text-sm font-medium cursor-not-allowed"
      >
        Agotado
      </button>
    );
  }

  return (
    <div className="space-y-3">
      {/* Quantity selector */}
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-forest">Cantidad</span>
        <div className="flex items-center border border-sand rounded-md overflow-hidden">
          <button
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            disabled={qty <= 1}
            aria-label="Reducir cantidad"
            className="px-3 py-2 text-forest hover:bg-sand disabled:opacity-40 transition-colors"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="px-5 py-2 text-sm font-semibold text-forest border-x border-sand min-w-[3rem] text-center">
            {qty}
          </span>
          <button
            onClick={() => setQty((q) => Math.min(max, q + 1))}
            disabled={qty >= max}
            aria-label="Aumentar cantidad"
            className="px-3 py-2 text-forest hover:bg-sand disabled:opacity-40 transition-colors"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
        <span className="text-xs text-muted-foreground">
          {product.stock} disponibles
        </span>
      </div>

      {/* CTA */}
      <button
        onClick={handleAdd}
        className={`w-full flex items-center justify-center gap-2 py-3 rounded-md text-sm font-semibold transition-all ${
          added
            ? "bg-forest text-cream"
            : "bg-terracotta text-white hover:bg-terracotta-light"
        }`}
      >
        {added ? (
          <>
            <Check className="h-4 w-4" />
            ¡Añadido al carrito!
          </>
        ) : (
          <>
            <ShoppingCart className="h-4 w-4" />
            Añadir al carrito — ${(product.price * qty).toFixed(2)}
          </>
        )}
      </button>
    </div>
  );
}

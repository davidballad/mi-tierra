/**
 * /carrito — shopping cart page.
 * Reads from CartContext (localStorage-backed); checkout is a placeholder
 * until a payment processor is integrated.
 */

"use client";

import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/contexts/CartContext";
import { Minus, Plus, Trash2, ShoppingCart, ArrowRight, Lock } from "lucide-react";

export default function CarritoPage() {
  const { items, itemCount, subtotal, removeItem, updateQuantity, clearCart } =
    useCart();

  const COMMISSION_RATE = 0.05;
  const platformFee = subtotal * COMMISSION_RATE;
  const sellerNet = subtotal - platformFee;

  /* ── Empty state ──────────────────────────────────────────────────────── */
  if (itemCount === 0) {
    return (
      <>
        <Navbar />
        <main className="flex-1 flex items-center justify-center bg-cream py-24 px-4">
          <div className="text-center max-w-sm">
            <div className="flex justify-center mb-6">
              <div className="h-20 w-20 rounded-full bg-sand flex items-center justify-center">
                <ShoppingCart className="h-10 w-10 text-terracotta" />
              </div>
            </div>
            <h1 className="font-heading text-2xl font-bold text-forest mb-3">
              Tu carrito está vacío
            </h1>
            <p className="text-muted-foreground mb-8 text-sm">
              Descubre artesanías únicas de los mejores artesanos del Ecuador.
            </p>
            <Link
              href="/explorar"
              className="inline-flex items-center gap-2 rounded-md bg-terracotta text-white text-sm font-semibold px-6 py-3 hover:bg-terracotta-light transition-colors"
            >
              Explorar productos
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  /* ── Cart with items ──────────────────────────────────────────────────── */
  return (
    <>
      <Navbar />
      <main className="flex-1 bg-cream">
        {/* Header */}
        <div className="border-b border-sand bg-white py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
            <div>
              <h1 className="font-heading text-3xl font-bold text-forest">Tu carrito</h1>
              <p className="text-muted-foreground text-sm mt-0.5">
                {itemCount} {itemCount === 1 ? "producto" : "productos"}
              </p>
            </div>
            <button
              onClick={clearCart}
              className="text-xs text-muted-foreground hover:text-terracotta transition-colors underline"
            >
              Vaciar carrito
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
            {/* Cart items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map(({ product, quantity }) => {
                const imageSrc = product.images[0] ?? "/placeholder.jpg";
                const lineTotal = product.price * quantity;
                const maxQty = Math.min(product.stock, 10);

                return (
                  <div
                    key={product.id}
                    className="flex gap-4 p-4 rounded-xl border border-sand bg-white"
                  >
                    {/* Thumbnail */}
                    <Link href={`/producto/${product.id}`} className="flex-shrink-0">
                      <div className="relative h-20 w-20 rounded-lg overflow-hidden bg-sand">
                        <Image
                          src={imageSrc}
                          alt={product.title}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      </div>
                    </Link>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/producto/${product.id}`}
                        className="font-medium text-sm text-forest hover:text-terracotta transition-colors line-clamp-2 leading-snug"
                      >
                        {product.title}
                      </Link>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {product.shopName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {product.provinceOrigin}
                      </p>

                      {/* Quantity controls */}
                      <div className="flex items-center gap-3 mt-3">
                        <div className="flex items-center border border-sand rounded-md overflow-hidden">
                          <button
                            onClick={() =>
                              updateQuantity(product.id, quantity - 1)
                            }
                            aria-label="Reducir cantidad"
                            disabled={quantity <= 1}
                            className="px-2 py-1 text-forest hover:bg-sand disabled:opacity-40 transition-colors"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="px-3 py-1 text-sm font-semibold text-forest border-x border-sand min-w-[2.5rem] text-center">
                            {quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(product.id, quantity + 1)
                            }
                            aria-label="Aumentar cantidad"
                            disabled={quantity >= maxQty}
                            className="px-2 py-1 text-forest hover:bg-sand disabled:opacity-40 transition-colors"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeItem(product.id)}
                          aria-label="Eliminar producto"
                          className="p-1.5 rounded-md text-muted-foreground hover:text-terracotta hover:bg-sand transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {/* Line total */}
                    <div className="flex-shrink-0 text-right">
                      <p className="font-semibold text-forest">
                        ${lineTotal.toFixed(2)}
                      </p>
                      {quantity > 1 && (
                        <p className="text-xs text-muted-foreground">
                          ${product.price.toFixed(2)} c/u
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Order summary */}
            <div className="lg:sticky lg:top-24">
              <div className="rounded-xl border border-sand bg-white p-6 space-y-4">
                <h2 className="font-heading text-xl font-bold text-forest">
                  Resumen del pedido
                </h2>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium text-forest">
                      ${subtotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Envío</span>
                    <span className="text-muted-foreground">Por confirmar</span>
                  </div>
                </div>

                <div className="border-t border-sand pt-3 flex justify-between">
                  <span className="font-semibold text-forest">Total estimado</span>
                  <span className="font-heading text-xl font-bold text-terracotta">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>

                {/* Checkout CTA — payment not yet integrated */}
                <button
                  disabled
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-md bg-sand text-muted-foreground text-sm font-semibold cursor-not-allowed"
                >
                  <Lock className="h-4 w-4" />
                  Proceder al pago
                </button>

                <p className="text-xs text-muted-foreground text-center leading-relaxed">
                  Los pagos en línea estarán disponibles muy pronto. Por ahora
                  puedes contactar directamente al artesano para coordinar.
                </p>

                {/* Breakdown note */}
                <div className="rounded-lg bg-forest/5 p-3 text-xs text-forest/70 space-y-1">
                  <p className="font-semibold text-forest text-xs">
                    ¿Cómo funciona?
                  </p>
                  <p>
                    El artesano recibe el{" "}
                    <strong>
                      ${sellerNet.toFixed(2)} (95%)
                    </strong>{" "}
                    y Mi Tierra retiene{" "}
                    <strong>${platformFee.toFixed(2)} (5%)</strong>.
                  </p>
                </div>
              </div>

              {/* Continue shopping */}
              <div className="mt-4 text-center">
                <Link
                  href="/explorar"
                  className="text-sm text-terracotta hover:underline font-medium"
                >
                  ← Seguir explorando
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

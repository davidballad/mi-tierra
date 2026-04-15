/**
 * /carrito — shopping cart with bank transfer or contra-entrega checkout.
 * On confirm: uploads comprobante to Firebase Storage (if transferencia),
 * writes an Order document to Firestore, then clears the cart.
 */

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  doc,
  collection,
  setDoc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/firebase";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/contexts/CartContext";
import { useAuthFlow } from "@/contexts/AuthFlowContext";
import { calcPlatformFee } from "@/lib/commission";
import PaymentSelector from "./PaymentSelector";
import BankTransferSection from "./BankTransferSection";
import {
  Minus,
  Plus,
  Trash2,
  ShoppingCart,
  ArrowRight,
  Package,
  CheckCircle2,
  Truck,
} from "lucide-react";
import type { CartItem, Shop, PaymentMethod } from "@/types";

/* ─── Order confirmed screen ────────────────────────────────────────────── */
function OrderConfirmed({
  items,
  subtotal,
  method,
}: {
  items: CartItem[];
  subtotal: number;
  method: PaymentMethod;
}) {
  return (
    <main className="flex-1 bg-cream">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="flex justify-center mb-6">
          <div className="h-20 w-20 rounded-full bg-forest/10 flex items-center justify-center">
            <CheckCircle2 className="h-10 w-10 text-forest" />
          </div>
        </div>
        <h1 className="font-heading text-3xl font-bold text-forest mb-3">
          ¡Pedido confirmado!
        </h1>
        <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
          {method === "transferencia"
            ? "El artesano revisará tu comprobante y confirmará el pedido. Te contactará por WhatsApp."
            : "El artesano se pondrá en contacto contigo por WhatsApp para coordinar la entrega y el pago."}
        </p>

        {/* Order summary */}
        <div className="rounded-xl border border-sand bg-white p-6 text-left mb-8 space-y-3">
          <h2 className="font-heading font-semibold text-forest mb-4">
            Resumen de tu pedido
          </h2>
          {items.map(({ product, quantity }) => (
            <div key={product.id} className="flex items-center gap-3">
              <div className="relative h-12 w-12 rounded-lg overflow-hidden bg-sand flex-shrink-0">
                <Image
                  src={product.images[0] ?? "/placeholder.jpg"}
                  alt={product.title}
                  fill
                  className="object-cover"
                  sizes="48px"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-forest line-clamp-1">
                  {product.title}
                </p>
                <p className="text-xs text-muted-foreground">{product.shopName}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-sm font-semibold text-forest">
                  ${(product.price * quantity).toFixed(2)}
                </p>
                <p className="text-xs text-muted-foreground">×{quantity}</p>
              </div>
            </div>
          ))}
          <div className="border-t border-sand pt-3 flex justify-between">
            <span className="font-semibold text-forest">Total</span>
            <span className="font-heading text-xl font-bold text-terracotta">
              ${subtotal.toFixed(2)}
            </span>
          </div>
        </div>

        <div className="rounded-xl border border-sand bg-white p-6 text-left mb-8">
          <h2 className="font-heading font-semibold text-forest mb-4">¿Qué sigue?</h2>
          <ol className="space-y-3 text-sm text-muted-foreground">
            {(method === "transferencia"
              ? [
                  "El artesano verifica tu comprobante de transferencia.",
                  "Te confirma el pedido por WhatsApp y coordina la entrega.",
                  "Recibes tu artesanía.",
                ]
              : [
                  "El artesano te contacta por WhatsApp.",
                  "Coordinan juntos la entrega.",
                  "Recibes tu artesanía y pagas al momento de la entrega.",
                ]
            ).map((step, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="h-5 w-5 rounded-full bg-terracotta/10 text-terracotta text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </div>

        <Link
          href="/explorar"
          className="inline-flex items-center gap-2 rounded-md bg-terracotta text-white text-sm font-semibold px-6 py-3 hover:bg-terracotta-light transition-colors"
        >
          Seguir explorando <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </main>
  );
}

/* ─── Main cart page ────────────────────────────────────────────────────── */
export default function CarritoPage() {
  const { items, itemCount, subtotal, removeItem, updateQuantity, clearCart } =
    useCart();
  const { user, openAuthModal } = useAuthFlow();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("contra_entrega");
  const [whatsapp, setWhatsapp] = useState("");
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [shopData, setShopData] = useState<Shop | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Confirmation screen state
  const [confirmed, setConfirmed] = useState(false);
  const [snapItems, setSnapItems] = useState<CartItem[]>([]);
  const [snapSubtotal, setSnapSubtotal] = useState(0);
  const [snapMethod, setSnapMethod] = useState<PaymentMethod>("contra_entrega");

  // Fetch artisan's shop/bank details when cart has items
  useEffect(() => {
    if (!db || items.length === 0) return;
    const shopId = items[0].product.shopId;
    getDoc(doc(db, "shops", shopId))
      .then((snap) => {
        if (!snap.exists()) return;
        const d = snap.data();
        setShopData({
          id: snap.id,
          ownerId: d.ownerId as string,
          shopName: d.shopName as string,
          bio: (d.bio as string) ?? "",
          rating: (d.rating as number) ?? 0,
          createdAt: d.createdAt?.toDate?.() ?? new Date(),
          bankName: d.bankName as string | undefined,
          accountType: d.accountType as Shop["accountType"],
          accountNumber: d.accountNumber as string | undefined,
          accountHolderName: d.accountHolderName as string | undefined,
          cedula: d.cedula as string | undefined,
        });
      })
      .catch(() => {/* no bank data — that's fine */});
  }, [items]);

  const hasBank = Boolean(shopData?.bankName && shopData?.accountNumber);
  const { fee: platformFee, sellerNet } = calcPlatformFee(subtotal);

  async function handleConfirm() {
    // Auth gate
    if (!user) { openAuthModal(); return; }
    if (!db) { setError("Firebase no configurado — revisa tus variables de entorno."); return; }

    // Validation
    if (!whatsapp.trim()) { setError("Por favor ingresa tu número de WhatsApp."); return; }
    if (paymentMethod === "transferencia" && !receiptFile) {
      setError("Por favor sube el comprobante de tu transferencia."); return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const orderRef = doc(collection(db, "orders"));
      let paymentProofUrl: string | undefined;

      // Upload screenshot to Firebase Storage
      if (paymentMethod === "transferencia" && receiptFile && storage) {
        const ext = receiptFile.name.split(".").pop() ?? "jpg";
        const fileRef = ref(storage, `orders/${orderRef.id}/comprobante.${ext}`);
        await uploadBytes(fileRef, receiptFile, { contentType: receiptFile.type });
        paymentProofUrl = await getDownloadURL(fileRef);
      }

      // Build order payload
      const orderItems = items.map(({ product, quantity }) => ({
        productId: product.id,
        title: product.title,
        price: product.price,
        quantity,
      }));

      await setDoc(orderRef, {
        buyerId: user.uid,
        shopId: items[0].product.shopId,
        items: orderItems,
        totalPrice: subtotal,
        platformFee,
        status: "pending",
        paymentMethod,
        buyerWhatsApp: whatsapp.trim(),
        ...(paymentProofUrl ? { paymentProofUrl } : {}),
        createdAt: serverTimestamp(),
      });

      // Snapshot for confirmation screen, then clear
      setSnapItems([...items]);
      setSnapSubtotal(subtotal);
      setSnapMethod(paymentMethod);
      clearCart();
      setConfirmed(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al confirmar el pedido. Intenta de nuevo.");
    } finally {
      setSubmitting(false);
    }
  }

  /* ── Confirmed ──────────────────────────────────────────────────────────── */
  if (confirmed) {
    return (
      <>
        <Navbar />
        <OrderConfirmed items={snapItems} subtotal={snapSubtotal} method={snapMethod} />
        <Footer />
      </>
    );
  }

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
              Explorar productos <ArrowRight className="h-4 w-4" />
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
                {itemCount} {itemCount === 1 ? "producto" : "productos"} de{" "}
                {items[0]?.product.shopName}
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
                  <div key={product.id} className="flex gap-4 p-4 rounded-xl border border-sand bg-white">
                    <Link href={`/producto/${product.id}`} className="flex-shrink-0">
                      <div className="relative h-20 w-20 rounded-lg overflow-hidden bg-sand">
                        <Image src={imageSrc} alt={product.title} fill className="object-cover" sizes="80px" />
                      </div>
                    </Link>
                    <div className="flex-1 min-w-0">
                      <Link href={`/producto/${product.id}`} className="font-medium text-sm text-forest hover:text-terracotta transition-colors line-clamp-2 leading-snug">
                        {product.title}
                      </Link>
                      <p className="text-xs text-muted-foreground mt-0.5">{product.shopName}</p>
                      <p className="text-xs text-muted-foreground">{product.provinceOrigin}</p>
                      <div className="flex items-center gap-3 mt-3">
                        <div className="flex items-center border border-sand rounded-md overflow-hidden">
                          <button onClick={() => updateQuantity(product.id, quantity - 1)} disabled={quantity <= 1} aria-label="Reducir" className="px-2 py-1 text-forest hover:bg-sand disabled:opacity-40 transition-colors">
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="px-3 py-1 text-sm font-semibold text-forest border-x border-sand min-w-[2.5rem] text-center">{quantity}</span>
                          <button onClick={() => updateQuantity(product.id, quantity + 1)} disabled={quantity >= maxQty} aria-label="Aumentar" className="px-2 py-1 text-forest hover:bg-sand disabled:opacity-40 transition-colors">
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <button onClick={() => removeItem(product.id)} aria-label="Eliminar" className="p-1.5 rounded-md text-muted-foreground hover:text-terracotta hover:bg-sand transition-colors">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <div className="flex-shrink-0 text-right">
                      <p className="font-semibold text-forest">${lineTotal.toFixed(2)}</p>
                      {quantity > 1 && <p className="text-xs text-muted-foreground">${product.price.toFixed(2)} c/u</p>}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Order summary + checkout */}
            <div className="lg:sticky lg:top-24 space-y-4">
              <div className="rounded-xl border border-sand bg-white p-6 space-y-5">
                <h2 className="font-heading text-xl font-bold text-forest">Resumen</h2>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium text-forest">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Envío</span>
                    <span className="text-muted-foreground">Coordinado con el artesano</span>
                  </div>
                </div>

                <div className="border-t border-sand pt-3 flex justify-between">
                  <span className="font-semibold text-forest">Total</span>
                  <span className="font-heading text-xl font-bold text-terracotta">${subtotal.toFixed(2)}</span>
                </div>

                {/* Payment method selector */}
                <div className="border-t border-sand pt-4">
                  <PaymentSelector
                    method={paymentMethod}
                    onChange={setPaymentMethod}
                    whatsapp={whatsapp}
                    onWhatsappChange={setWhatsapp}
                    transferEnabled={hasBank}
                  />
                </div>

                {/* Bank transfer section */}
                {paymentMethod === "transferencia" && shopData && hasBank && (
                  <BankTransferSection
                    shop={shopData}
                    file={receiptFile}
                    onFileChange={setReceiptFile}
                  />
                )}

                {/* Delivery badge for contra entrega */}
                {paymentMethod === "contra_entrega" && (
                  <div className="flex items-center gap-2 rounded-lg bg-forest/5 p-3">
                    <Truck className="h-4 w-4 text-forest flex-shrink-0" />
                    <p className="text-xs text-forest font-medium">Pagas al recibir tu pedido</p>
                  </div>
                )}

                {/* Error */}
                {error && (
                  <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg p-2.5">
                    {error}
                  </p>
                )}

                {/* Confirm button */}
                <button
                  onClick={handleConfirm}
                  disabled={submitting}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-md bg-terracotta text-white text-sm font-semibold hover:bg-terracotta-light transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <Package className="h-4 w-4" />
                  {submitting ? "Procesando…" : "Confirmar pedido"}
                </button>

                {/* Commission note */}
                <div className="rounded-lg bg-forest/5 p-3 text-xs text-forest/70 space-y-1">
                  <p className="font-semibold text-forest text-xs">¿Cómo funciona la comisión?</p>
                  <p>El artesano recibe <strong>${sellerNet.toFixed(2)} (95%)</strong> y Mi Tierra retiene <strong>${platformFee.toFixed(2)} (5%)</strong>.</p>
                </div>
              </div>

              <div className="text-center">
                <Link href="/explorar" className="text-sm text-terracotta hover:underline font-medium">
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

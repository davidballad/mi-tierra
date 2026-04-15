/**
 * Live list of a seller's own products with Edit / Delete actions.
 * Uses onSnapshot for real-time updates when a product is added or edited.
 */

"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { collection, query, where, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Plus, Pencil, Trash2, Package } from "lucide-react";
import ProductForm from "./ProductForm";
import type { Product } from "@/types";

interface ProductsListProps {
  shopId: string;
  shopName: string;
}

export default function ProductsList({ shopId, shopName }: ProductsListProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Product | null | "new">(null);

  useEffect(() => {
    if (!db) { setLoading(false); return; }
    const q = query(collection(db, "products"), where("shopId", "==", shopId));
    const unsub = onSnapshot(q, (snap) => {
      const list: Product[] = snap.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          shopId: data.shopId as string,
          shopName: data.shopName as string,
          title: data.title as string,
          price: data.price as number,
          category: data.category as Product["category"],
          images: (data.images as string[]) ?? [],
          stock: data.stock as number,
          provinceOrigin: data.provinceOrigin as string,
          createdAt: data.createdAt?.toDate?.() ?? new Date(),
        };
      });
      setProducts(list.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()));
      setLoading(false);
    });
    return unsub;
  }, [shopId]);

  async function handleDelete(productId: string) {
    if (!db) return;
    if (!confirm("¿Seguro que quieres eliminar este producto?")) return;
    await deleteDoc(doc(db, "products", productId));
  }

  if (editing) {
    return (
      <ProductForm
        shopId={shopId}
        shopName={shopName}
        product={editing === "new" ? undefined : editing}
        onDone={() => setEditing(null)}
        onCancel={() => setEditing(null)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{products.length} {products.length === 1 ? "producto publicado" : "productos publicados"}</p>
        <button
          onClick={() => setEditing("new")}
          className="flex items-center gap-2 px-4 py-2 rounded-md bg-terracotta text-white text-sm font-semibold hover:bg-terracotta-light transition-colors"
        >
          <Plus className="h-4 w-4" /> Añadir producto
        </button>
      </div>

      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="rounded-xl border border-sand bg-white h-48" />
          ))}
        </div>
      )}

      {!loading && products.length === 0 && (
        <div className="text-center py-16 rounded-xl border-2 border-dashed border-sand">
          <Package className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-forest font-medium mb-1">Aún no tienes productos</p>
          <p className="text-sm text-muted-foreground mb-4">Añade tu primera artesanía para que los compradores puedan encontrarla.</p>
          <button onClick={() => setEditing("new")} className="inline-flex items-center gap-2 px-5 py-2 rounded-md bg-terracotta text-white text-sm font-semibold hover:bg-terracotta-light transition-colors">
            <Plus className="h-4 w-4" /> Añadir primer producto
          </button>
        </div>
      )}

      {!loading && products.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((p) => (
            <div key={p.id} className="rounded-xl border border-sand bg-white overflow-hidden">
              <div className="relative h-40 bg-sand">
                {p.images[0] ? (
                  <Image src={p.images[0]} alt={p.title} fill className="object-cover" sizes="(max-width: 640px) 100vw, 33vw" />
                ) : (
                  <div className="flex h-full items-center justify-center text-3xl">📦</div>
                )}
                <span className={`absolute top-2 right-2 text-xs font-semibold px-2 py-0.5 rounded-full ${p.stock > 0 ? "bg-forest/90 text-cream" : "bg-red-500 text-white"}`}>
                  {p.stock > 0 ? `${p.stock} en stock` : "Agotado"}
                </span>
              </div>
              <div className="p-4">
                <p className="font-medium text-sm text-forest line-clamp-1">{p.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{p.category}</p>
                <p className="font-heading text-lg font-bold text-terracotta mt-1">${p.price.toFixed(2)}</p>
                <div className="flex gap-2 mt-3">
                  <button onClick={() => setEditing(p)} className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md border border-sand text-xs font-medium text-forest hover:bg-sand transition-colors">
                    <Pencil className="h-3 w-3" /> Editar
                  </button>
                  <button onClick={() => handleDelete(p.id)} className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md border border-red-200 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors">
                    <Trash2 className="h-3 w-3" /> Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

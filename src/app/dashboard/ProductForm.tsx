/**
 * Create / edit product form for the seller dashboard.
 * Uploads the first image to Firebase Storage, then writes to /products.
 */

"use client";

import { useState, useRef } from "react";
import { doc, setDoc, updateDoc, collection, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/firebase";
import { Upload, X } from "lucide-react";
import { PRODUCT_CATEGORIES } from "@/constants/categories";
import { ECUADOR_PROVINCES } from "@/constants/provinces";
import type { Product } from "@/types";

interface ProductFormProps {
  shopId: string;
  shopName: string;
  /** Pass existing product to edit; omit for create. */
  product?: Product;
  onDone: () => void;
  onCancel: () => void;
}

export default function ProductForm({ shopId, shopName, product, onDone, onCancel }: ProductFormProps) {
  const isEdit = Boolean(product);
  const [title, setTitle] = useState(product?.title ?? "");

  // Category: preset from the 8 defaults, or custom free-text
  const isPreset = (cat: string) => PRODUCT_CATEGORIES.some((c) => c.value === cat);
  const initialCat = product?.category ?? PRODUCT_CATEGORIES[0].value;
  const [categoryMode, setCategoryMode] = useState<"preset" | "custom">(
    isPreset(initialCat) ? "preset" : "custom"
  );
  const [presetCategory, setPresetCategory] = useState(
    isPreset(initialCat) ? initialCat : PRODUCT_CATEGORIES[0].value
  );
  const [customCategory, setCustomCategory] = useState(
    isPreset(initialCat) ? "" : initialCat
  );

  const [price, setPrice] = useState(product?.price?.toString() ?? "");
  const [stock, setStock] = useState(product?.stock?.toString() ?? "");
  const [province, setProvince] = useState(product?.provinceOrigin ?? "");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const existingImage = product?.images[0];
  const previewUrl = imageFile ? URL.createObjectURL(imageFile) : existingImage ?? null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!db) { setError("Firebase no disponible."); return; }
    if (!isEdit && !imageFile) { setError("Por favor sube una imagen del producto."); return; }

    const finalCategory = categoryMode === "preset" ? presetCategory : customCategory.trim();
    if (!finalCategory) { setError("Por favor escribe el nombre de la categoría."); return; }

    setSaving(true); setError(null);
    try {
      let imageUrl = existingImage ?? "";
      if (imageFile && storage) {
        const ext = imageFile.name.split(".").pop() ?? "jpg";
        const fileRef = ref(storage, `products/${shopId}/${Date.now()}.${ext}`);
        await uploadBytes(fileRef, imageFile, { contentType: imageFile.type });
        imageUrl = await getDownloadURL(fileRef);
      }

      const payload = {
        shopId, shopName,
        title: title.trim(),
        category: finalCategory,
        price: parseFloat(price),
        stock: parseInt(stock, 10),
        provinceOrigin: province,
        images: [imageUrl],
      };

      if (isEdit && product) {
        await updateDoc(doc(db, "products", product.id), payload);
      } else {
        await setDoc(doc(collection(db, "products")), {
          ...payload,
          createdAt: serverTimestamp(),
        });
      }
      onDone();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al guardar el producto.");
    } finally {
      setSaving(false);
    }
  }

  const field = "w-full rounded-md border border-sand bg-cream px-3 py-2 text-sm text-forest placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-terracotta/40";
  const labelCls = "block text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1.5";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <h3 className="font-heading text-xl font-bold text-forest">
        {isEdit ? "Editar producto" : "Añadir producto"}
      </h3>

      <div>
        <label className={labelCls}>Nombre del producto</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="Ej: Tapiz Otavaleño — Diseño Cóndor" className={field} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Categoría</label>
          <select
            value={categoryMode === "preset" ? presetCategory : "__custom__"}
            onChange={(e) => {
              if (e.target.value === "__custom__") {
                setCategoryMode("custom");
              } else {
                setCategoryMode("preset");
                setPresetCategory(e.target.value);
              }
            }}
            className={field}
          >
            {PRODUCT_CATEGORIES.map(({ value, label }) => (
              <option key={value} value={value}>{label}</option>
            ))}
            <option value="__custom__">✏️ Otra categoría…</option>
          </select>
          {categoryMode === "custom" && (
            <input
              type="text"
              value={customCategory}
              onChange={(e) => setCustomCategory(e.target.value)}
              placeholder="Ej: Bordados Amazónicos, Artesanías de Cuero…"
              className={`${field} mt-2`}
            />
          )}
        </div>
        <div>
          <label className={labelCls}>Provincia de origen</label>
          <select value={province} onChange={(e) => setProvince(e.target.value)} required className={field}>
            <option value="">Selecciona</option>
            {ECUADOR_PROVINCES.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Precio (USD)</label>
          <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required min="0.01" step="0.01" placeholder="0.00" className={field} />
        </div>
        <div>
          <label className={labelCls}>Stock disponible</label>
          <input type="number" value={stock} onChange={(e) => setStock(e.target.value)} required min="0" step="1" placeholder="0" className={field} />
        </div>
      </div>

      {/* Image upload */}
      <div>
        <label className={labelCls}>Imagen del producto {isEdit ? "(opcional — sube para reemplazar)" : "*"}</label>
        {previewUrl && (
          <div className="relative h-40 w-40 rounded-xl overflow-hidden border border-sand mb-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={previewUrl} alt="Vista previa" className="h-full w-full object-cover" />
            {imageFile && (
              <button type="button" onClick={() => { setImageFile(null); if (inputRef.current) inputRef.current.value = ""; }} className="absolute top-1 right-1 h-6 w-6 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70">
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
        )}
        <button type="button" onClick={() => inputRef.current?.click()} className="flex items-center gap-2 px-4 py-2 rounded-md border border-dashed border-sand hover:border-terracotta text-sm text-muted-foreground hover:text-terracotta transition-colors">
          <Upload className="h-4 w-4" /> Seleccionar imagen
        </button>
        <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => setImageFile(e.target.files?.[0] ?? null)} className="hidden" />
        <p className="text-xs text-muted-foreground mt-1">JPG, PNG o WebP. Máximo 5 MB.</p>
      </div>

      {error && <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg p-2.5">{error}</p>}

      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onCancel} className="px-5 py-2.5 rounded-md border border-sand text-sm font-medium text-forest hover:bg-sand transition-colors">
          Cancelar
        </button>
        <button type="submit" disabled={saving} className="px-6 py-2.5 rounded-md bg-terracotta text-white text-sm font-semibold hover:bg-terracotta-light transition-colors disabled:opacity-60">
          {saving ? "Guardando…" : isEdit ? "Guardar cambios" : "Publicar producto"}
        </button>
      </div>
    </form>
  );
}

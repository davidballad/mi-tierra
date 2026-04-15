/**
 * URL-driven category + province filters for the /explorar page.
 * Updates query params on change so filtering is server-rendered and shareable.
 * Must be wrapped in <Suspense> by the parent (useSearchParams requirement).
 */

"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { PRODUCT_CATEGORIES } from "@/constants/categories";
import { ECUADOR_PROVINCES } from "@/constants/provinces";
import { SlidersHorizontal } from "lucide-react";

const pill = (active: boolean) =>
  [
    "flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium",
    "border transition-colors whitespace-nowrap cursor-pointer",
    active
      ? "bg-terracotta text-white border-terracotta shadow-sm"
      : "bg-white text-forest border-sand-dark hover:border-terracotta hover:text-terracotta",
  ].join(" ");

export default function ExplorarFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const activeCategory = searchParams.get("categoria");
  const activeProvince = searchParams.get("provincia");
  const hasFilters = activeCategory || activeProvince;

  const push = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    router.push(`/explorar?${params.toString()}`);
  };

  return (
    <section className="bg-cream border-b border-sand py-4 sticky top-16 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
        {/* Category pills */}
        <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-none">
          <button onClick={() => push("categoria", null)} className={pill(!activeCategory)}>
            Todas
          </button>
          {PRODUCT_CATEGORIES.map(({ value, label, icon }) => (
            <button
              key={value}
              onClick={() => push("categoria", value)}
              className={pill(activeCategory === value)}
            >
              <span aria-hidden>{icon}</span>
              <span>{label}</span>
            </button>
          ))}
        </div>

        {/* Province select + clear */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 text-forest">
            <SlidersHorizontal className="h-4 w-4 flex-shrink-0" />
            <select
              value={activeProvince ?? ""}
              onChange={(e) => push("provincia", e.target.value || null)}
              className="text-sm border border-sand-dark rounded-full px-3 py-1.5 bg-white focus:outline-none focus:border-terracotta cursor-pointer"
            >
              <option value="">Todas las provincias</option>
              {ECUADOR_PROVINCES.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          {hasFilters && (
            <button
              onClick={() => router.push("/explorar")}
              className="text-sm text-terracotta hover:underline font-medium"
            >
              Limpiar filtros ×
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

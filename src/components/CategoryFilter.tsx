/**
 * Horizontally scrollable pill-buttons for filtering by product category.
 * Tracks selected category in local state for visual feedback.
 */

"use client";

import { useState } from "react";
import { PRODUCT_CATEGORIES } from "@/constants/categories";

export default function CategoryFilter() {
  const [selected, setSelected] = useState<string | null>(null);

  const pillClass = (active: boolean) =>
    [
      "flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium",
      "border transition-colors whitespace-nowrap cursor-pointer",
      active
        ? "bg-terracotta text-white border-terracotta shadow-sm"
        : "bg-white text-forest border-sand-dark hover:border-terracotta hover:text-terracotta",
    ].join(" ");

  return (
    <section className="bg-cream py-6 border-b border-sand">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setSelected(null)}
            className={pillClass(selected === null)}
          >
            Todas
          </button>

          {PRODUCT_CATEGORIES.map(({ value, label, icon }) => (
            <button
              key={value}
              onClick={() => setSelected(value)}
              className={pillClass(selected === value)}
            >
              <span aria-hidden>{icon}</span>
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

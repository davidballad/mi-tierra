/**
 * Site-wide footer with brand statement and organized link columns.
 */

import Link from "next/link";
import { Leaf } from "lucide-react";

const FOOTER_SECTIONS = [
  {
    title: "Marketplace",
    links: [
      { label: "Explorar Productos", href: "/explorar" },
      { label: "Artesanos", href: "/artesanos" },
      { label: "Provincias", href: "/provincias" },
      { label: "Categorías", href: "/categorias" },
    ],
  },
  {
    title: "Vendedores",
    links: [
      { label: "Vende tu Arte", href: "/vender" },
      { label: "Centro de Ayuda", href: "/ayuda" },
      { label: "Comisiones", href: "/comisiones" },
    ],
  },
  {
    title: "Mi Tierra",
    links: [
      { label: "Sobre Nosotros", href: "/nosotros" },
      { label: "Términos de Uso", href: "/terminos" },
      { label: "Privacidad", href: "/privacidad" },
      { label: "Contacto", href: "/contacto" },
    ],
  },
] as const;

export default function Footer() {
  return (
    <footer className="bg-forest text-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand column */}
          <div>
            <div className="flex items-center gap-2 font-heading text-2xl font-bold text-cream mb-3">
              <Leaf className="h-6 w-6" />
              Mi Tierra
            </div>
            <p className="text-cream/70 text-sm leading-relaxed">
              Conectamos el alma artesanal del Ecuador con el mundo. Cada compra
              apoya a una familia y preserva nuestra cultura.
            </p>
          </div>

          {/* Link columns */}
          {FOOTER_SECTIONS.map(({ title, links }) => (
            <div key={title}>
              <h3 className="font-semibold text-sand text-xs uppercase tracking-widest mb-4">
                {title}
              </h3>
              <ul className="space-y-2.5">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="text-cream/70 hover:text-cream text-sm transition-colors"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-cream/20 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-cream/50">
          <p>© 2025 Mi Tierra. Hecho con ❤️ en Ecuador.</p>
          <p>Plataforma construida para los artesanos ecuatorianos.</p>
        </div>
      </div>
    </footer>
  );
}

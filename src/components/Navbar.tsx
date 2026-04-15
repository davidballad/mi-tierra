/**
 * Sticky top navigation — shows auth state and triggers the sign-in flow.
 */

"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Leaf, LogOut, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthFlow } from "@/contexts/AuthFlowContext";
import { useCart } from "@/contexts/CartContext";

const NAV_LINKS = [
  { label: "Explorar", href: "/explorar" },
  { label: "Artesanos", href: "/artesanos" },
  { label: "Provincias", href: "/provincias" },
] as const;

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, firestoreUser, loading, openAuthModal, signOut } = useAuthFlow();
  const { itemCount } = useCart();

  const initials = (
    user?.displayName?.[0] ?? user?.email?.[0] ?? "U"
  ).toUpperCase();

  const roleLabel = firestoreUser?.role === "seller" ? "Artesano" : "Comprador";

  return (
    <header className="sticky top-0 z-50 bg-cream/95 backdrop-blur border-b border-sand-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-heading text-2xl font-bold text-terracotta">
            <Leaf className="h-6 w-6" />
            Mi Tierra
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map(({ label, href }) => (
              <Link key={href} href={href}
                className="text-sm font-medium text-forest hover:text-terracotta transition-colors">
                {label}
              </Link>
            ))}
          </nav>

          {/* Seller dashboard link */}
          {firestoreUser?.role === "seller" && (
            <Link
              href="/dashboard"
              className="hidden sm:inline-flex items-center text-xs font-semibold text-forest hover:text-terracotta transition-colors border border-sand rounded-md px-3 py-1.5 hover:border-terracotta"
            >
              Mi Panel
            </Link>
          )}

          {/* Cart icon */}
          <Link
            href="/carrito"
            aria-label={`Carrito${itemCount > 0 ? ` — ${itemCount} productos` : ""}`}
            className="relative p-1.5 rounded-md text-forest hover:text-terracotta hover:bg-sand transition-colors"
          >
            <ShoppingCart className="h-5 w-5" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-terracotta text-white text-[10px] font-bold flex items-center justify-center leading-none">
                {itemCount > 9 ? "9+" : itemCount}
              </span>
            )}
          </Link>

          {/* Desktop auth */}
          <div className="hidden sm:flex items-center gap-3">
            {!loading && (
              user ? (
                <>
                  <div className="text-right">
                    <p className="text-xs font-semibold text-forest">{roleLabel}</p>
                    <p className="text-xs text-muted-foreground truncate max-w-[140px]">
                      {user.displayName ?? user.email}
                    </p>
                  </div>
                  <div className="h-8 w-8 rounded-full bg-forest text-cream flex items-center justify-center text-sm font-bold flex-shrink-0">
                    {initials}
                  </div>
                  <button onClick={signOut} aria-label="Cerrar sesión"
                    className="p-1.5 rounded-md text-forest hover:text-terracotta hover:bg-sand transition-colors">
                    <LogOut className="h-4 w-4" />
                  </button>
                </>
              ) : (
                <Button onClick={openAuthModal} className="bg-terracotta text-white hover:bg-terracotta-light">
                  Inicia Sesión
                </Button>
              )
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 text-forest rounded-md hover:bg-sand transition-colors"
            onClick={() => setMenuOpen((p) => !p)}
            aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
          >
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile dropdown */}
        {menuOpen && (
          <div className="md:hidden border-t border-sand pb-4">
            <nav className="flex flex-col gap-1 pt-3">
              {NAV_LINKS.map(({ label, href }) => (
                <Link key={href} href={href} onClick={() => setMenuOpen(false)}
                  className="px-3 py-2 text-forest hover:text-terracotta font-medium rounded-md hover:bg-sand transition-colors">
                  {label}
                </Link>
              ))}
              {firestoreUser?.role === "seller" && (
                <Link href="/dashboard" onClick={() => setMenuOpen(false)}
                  className="px-3 py-2 text-forest hover:text-terracotta font-medium rounded-md hover:bg-sand transition-colors flex items-center gap-2">
                  Mi Panel
                </Link>
              )}
              <div className="pt-2 px-3">
                {user ? (
                  <button onClick={signOut}
                    className="flex items-center gap-2 text-sm font-medium text-forest hover:text-terracotta">
                    <LogOut className="h-4 w-4" /> Cerrar Sesión
                  </button>
                ) : (
                  <Button onClick={() => { openAuthModal(); setMenuOpen(false); }}
                    className="w-full bg-terracotta text-white hover:bg-terracotta-light">
                    Inicia Sesión
                  </Button>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

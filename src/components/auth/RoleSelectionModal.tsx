/**
 * Role selection modal — first-time users choose Comprador or Artesano.
 * Immediately writes the role to the /users Firestore document.
 */

"use client";

import { useState } from "react";
import { ShoppingBag, Store, X } from "lucide-react";
import { useAuthFlow } from "@/contexts/AuthFlowContext";
import type { UserRole } from "@/types";

const ROLES = [
  {
    role: "buyer" as UserRole,
    Icon: ShoppingBag,
    title: "Comprador",
    subtitle: "Quiero explorar y comprar artesanías ecuatorianas auténticas.",
    cta: "Soy Comprador",
    border: "border-forest hover:border-forest",
    badge: "bg-forest/10 text-forest",
    ring: "ring-forest/40",
  },
  {
    role: "seller" as UserRole,
    Icon: Store,
    title: "Artesano",
    subtitle: "Quiero vender mis creaciones y llegar a más personas en Ecuador.",
    cta: "Soy Artesano",
    border: "border-terracotta hover:border-terracotta",
    badge: "bg-terracotta/10 text-terracotta",
    ring: "ring-terracotta/40",
  },
] as const;

export default function RoleSelectionModal() {
  const { selectRole, closeModal } = useAuthFlow();
  const [selected, setSelected] = useState<UserRole | null>(null);
  const [busy, setBusy] = useState(false);

  const handle = async (role: UserRole) => {
    setSelected(role);
    setBusy(true);
    try {
      await selectRole(role);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="font-heading text-2xl font-bold text-forest">
            ¿Cómo quieres usar Mi Tierra?
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Elige tu rol — podrás cambiarlo más adelante.
          </p>
        </div>
        <button
          onClick={closeModal}
          className="ml-4 mt-1 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Cerrar"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="flex flex-col gap-4">
        {ROLES.map(({ role, Icon, title, subtitle, cta, border, badge, ring }) => (
          <button
            key={role}
            onClick={() => handle(role)}
            disabled={busy}
            className={[
              "text-left rounded-xl border-2 p-5 transition-all",
              border,
              selected === role ? `ring-2 ${ring}` : "",
              "disabled:opacity-60 hover:shadow-sm",
            ].join(" ")}
          >
            <div className="flex items-start gap-4">
              <div className={`p-2.5 rounded-lg flex-shrink-0 ${badge}`}>
                <Icon className="h-6 w-6" />
              </div>
              <div>
                <p className="font-heading font-semibold text-base text-gray-900">{title}</p>
                <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>
                <span className={`inline-block mt-3 text-xs font-semibold px-3 py-1 rounded-full ${badge}`}>
                  {busy && selected === role ? "Guardando..." : cta}
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

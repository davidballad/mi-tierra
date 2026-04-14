/**
 * Seller onboarding form — collects shop name, bio, and province.
 * Creates the /users doc (role=seller) and the /shops doc in Firestore.
 */

"use client";

import { useState, type FormEvent } from "react";
import { Store, X } from "lucide-react";
import { useAuthFlow } from "@/contexts/AuthFlowContext";
import { ECUADOR_PROVINCES } from "@/constants/provinces";
import { Button } from "@/components/ui/button";

const FIELD =
  "w-full border border-sand-dark rounded-lg px-3 py-2 text-sm bg-white " +
  "focus:outline-none focus:border-terracotta focus:ring-1 focus:ring-terracotta/30";

export default function SellerOnboardingModal() {
  const { completeOnboarding, closeModal } = useAuthFlow();
  const [shopName, setShopName] = useState("");
  const [bio, setBio] = useState("");
  const [province, setProvince] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!province) { setError("Selecciona tu provincia de origen."); return; }
    setError(null);
    setBusy(true);
    try {
      await completeOnboarding({ shopName, bio, province });
    } catch {
      setError("Error al crear tu tienda. Intenta de nuevo.");
      setBusy(false);
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-1.5 text-terracotta mb-1">
            <Store className="h-4 w-4" />
            <span className="text-xs font-semibold uppercase tracking-widest">Paso 2 de 2</span>
          </div>
          <h2 className="font-heading text-2xl font-bold text-forest">Configura tu Tienda</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Cuéntanos sobre ti para que los compradores te encuentren.
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

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Shop name */}
        <div>
          <label className="block text-sm font-medium text-forest mb-1">
            Nombre de la tienda <span className="text-terracotta">*</span>
          </label>
          <input
            type="text"
            value={shopName}
            onChange={(e) => setShopName(e.target.value)}
            required
            maxLength={60}
            placeholder="Ej: Manos de Otavalo"
            className={FIELD}
          />
        </div>

        {/* Bio */}
        <div>
          <label className="block text-sm font-medium text-forest mb-1">
            Biografía{" "}
            <span className="text-muted-foreground font-normal">({bio.length}/300)</span>
          </label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            maxLength={300}
            rows={3}
            placeholder="Cuéntanos tu historia como artesano..."
            className={`${FIELD} resize-none`}
          />
        </div>

        {/* Province */}
        <div>
          <label className="block text-sm font-medium text-forest mb-1">
            Provincia de origen <span className="text-terracotta">*</span>
          </label>
          <select
            value={province}
            onChange={(e) => setProvince(e.target.value)}
            className={FIELD}
          >
            <option value="">Selecciona tu provincia</option>
            {ECUADOR_PROVINCES.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>
        )}

        <Button
          type="submit"
          disabled={busy}
          className="w-full bg-terracotta text-white hover:bg-terracotta-light"
        >
          {busy ? "Creando tu tienda..." : "Crear mi Tienda"}
        </Button>
      </form>
    </div>
  );
}

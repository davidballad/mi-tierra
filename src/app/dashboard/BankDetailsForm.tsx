/**
 * Seller payment settings — bank details + flat shipping fee.
 * Saves to shops/{shopId} so buyers can see the info at checkout.
 */

"use client";

import { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { CheckCircle2 } from "lucide-react";
import type { Shop } from "@/types";

const ECUADORIAN_BANKS = [
  "Banco Pichincha",
  "Banco Guayaquil",
  "Banco del Pacífico",
  "Produbanco",
  "Banco Internacional",
  "Cooperativa JEP",
  "Cooperativa 29 de Octubre",
  "Otro",
] as const;

interface BankDetailsFormProps {
  shopId: string;
  initial: Pick<
    Shop,
    "bankName" | "accountType" | "accountNumber" | "accountHolderName" | "cedula" | "shippingFee"
  >;
}

export default function BankDetailsForm({ shopId, initial }: BankDetailsFormProps) {
  const [bankName, setBankName] = useState(initial.bankName ?? "");
  const [accountType, setAccountType] = useState<"ahorros" | "corriente">(
    initial.accountType ?? "ahorros"
  );
  const [accountNumber, setAccountNumber] = useState(initial.accountNumber ?? "");
  const [accountHolderName, setAccountHolderName] = useState(initial.accountHolderName ?? "");
  const [cedula, setCedula] = useState(initial.cedula ?? "");
  const [shippingFee, setShippingFee] = useState(
    initial.shippingFee !== undefined ? String(initial.shippingFee) : "0"
  );
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!db) { setError("Firebase no disponible."); return; }
    setSaving(true); setError(null); setSaved(false);
    try {
      await updateDoc(doc(db, "shops", shopId), {
        bankName: bankName.trim(),
        accountType,
        accountNumber: accountNumber.trim(),
        accountHolderName: accountHolderName.trim(),
        cedula: cedula.trim(),
        shippingFee: parseFloat(shippingFee) || 0,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al guardar.");
    } finally {
      setSaving(false);
    }
  }

  const field =
    "w-full rounded-md border border-sand bg-cream px-3 py-2 text-sm text-forest placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-terracotta/40";
  const labelCls =
    "block text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1.5";

  return (
    <form onSubmit={handleSave} className="max-w-lg space-y-5">
      <p className="text-sm text-muted-foreground">
        Estos datos aparecen en el checkout cuando el comprador elige pagar por transferencia.
      </p>

      {/* Bank */}
      <div>
        <label className={labelCls}>Banco</label>
        <select value={bankName} onChange={(e) => setBankName(e.target.value)} required className={field}>
          <option value="">Selecciona tu banco</option>
          {ECUADORIAN_BANKS.map((b) => <option key={b} value={b}>{b}</option>)}
        </select>
      </div>

      {/* Account type */}
      <div>
        <label className={labelCls}>Tipo de cuenta</label>
        <div className="flex gap-3">
          {(["ahorros", "corriente"] as const).map((t) => (
            <label
              key={t}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 cursor-pointer transition-colors text-sm font-medium ${
                accountType === t
                  ? "border-terracotta bg-terracotta/5 text-terracotta"
                  : "border-sand text-forest hover:border-forest"
              }`}
            >
              <input type="radio" name="accountType" value={t} checked={accountType === t} onChange={() => setAccountType(t)} className="sr-only" />
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </label>
          ))}
        </div>
      </div>

      {/* Account number */}
      <div>
        <label className={labelCls}>Número de cuenta</label>
        <input type="text" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} placeholder="Ej: 2200123456789" required className={field} />
      </div>

      {/* Holder name */}
      <div>
        <label className={labelCls}>Nombre del titular</label>
        <input type="text" value={accountHolderName} onChange={(e) => setAccountHolderName(e.target.value)} placeholder="Nombre completo tal como aparece en el banco" required className={field} />
      </div>

      {/* Cedula */}
      <div>
        <label className={labelCls}>Cédula / RUC</label>
        <input type="text" value={cedula} onChange={(e) => setCedula(e.target.value)} placeholder="Ej: 1712345678" required className={field} />
      </div>

      {/* Shipping fee */}
      <div className="border-t border-sand pt-5">
        <label className={labelCls}>Tarifa de envío (USD)</label>
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">$</span>
            <input
              type="number"
              min="0"
              step="0.01"
              value={shippingFee}
              onChange={(e) => setShippingFee(e.target.value)}
              className={`${field} pl-7`}
              placeholder="0.00"
            />
          </div>
          {parseFloat(shippingFee) === 0 && (
            <span className="text-xs font-semibold text-forest bg-forest/10 px-2 py-1 rounded-md whitespace-nowrap">
              Envío gratis 🎉
            </span>
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-1.5">
          Tarifa fija por pedido, sin importar cuántos productos incluya. Pon 0 para ofrecer envío gratis.
        </p>
      </div>

      {error && (
        <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg p-2.5">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={saving}
        className="flex items-center gap-2 px-6 py-2.5 rounded-md bg-terracotta text-white text-sm font-semibold hover:bg-terracotta-light transition-colors disabled:opacity-60"
      >
        {saved ? (
          <><CheckCircle2 className="h-4 w-4" /> ¡Guardado!</>
        ) : saving ? "Guardando…" : "Guardar configuración"}
      </button>
    </form>
  );
}

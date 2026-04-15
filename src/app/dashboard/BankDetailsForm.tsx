/**
 * Seller bank details form — saves to shops/{shopId} so buyers can
 * see the account info at checkout when paying by bank transfer.
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
  initial: Pick<Shop, "bankName" | "accountType" | "accountNumber" | "accountHolderName" | "cedula">;
}

export default function BankDetailsForm({ shopId, initial }: BankDetailsFormProps) {
  const [bankName, setBankName] = useState(initial.bankName ?? "");
  const [accountType, setAccountType] = useState<"ahorros" | "corriente">(
    initial.accountType ?? "ahorros"
  );
  const [accountNumber, setAccountNumber] = useState(initial.accountNumber ?? "");
  const [accountHolderName, setAccountHolderName] = useState(initial.accountHolderName ?? "");
  const [cedula, setCedula] = useState(initial.cedula ?? "");
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
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al guardar.");
    } finally {
      setSaving(false);
    }
  }

  const field = "w-full rounded-md border border-sand bg-cream px-3 py-2 text-sm text-forest placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-terracotta/40";
  const label = "block text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1.5";

  return (
    <form onSubmit={handleSave} className="max-w-lg space-y-5">
      <p className="text-sm text-muted-foreground">
        Estos datos aparecerán en el checkout cuando un comprador elija pagar por transferencia bancaria.
      </p>

      <div>
        <label className={label}>Banco</label>
        <select value={bankName} onChange={(e) => setBankName(e.target.value)} required className={field}>
          <option value="">Selecciona tu banco</option>
          {ECUADORIAN_BANKS.map((b) => <option key={b} value={b}>{b}</option>)}
        </select>
      </div>

      <div>
        <label className={label}>Tipo de cuenta</label>
        <div className="flex gap-3">
          {(["ahorros", "corriente"] as const).map((t) => (
            <label key={t} className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 cursor-pointer transition-colors text-sm font-medium ${accountType === t ? "border-terracotta bg-terracotta/5 text-terracotta" : "border-sand text-forest hover:border-forest"}`}>
              <input type="radio" name="accountType" value={t} checked={accountType === t} onChange={() => setAccountType(t)} className="sr-only" />
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className={label}>Número de cuenta</label>
        <input type="text" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} placeholder="Ej: 2200123456789" required className={field} />
      </div>

      <div>
        <label className={label}>Nombre del titular</label>
        <input type="text" value={accountHolderName} onChange={(e) => setAccountHolderName(e.target.value)} placeholder="Nombre completo tal como aparece en el banco" required className={field} />
      </div>

      <div>
        <label className={label}>Cédula / RUC</label>
        <input type="text" value={cedula} onChange={(e) => setCedula(e.target.value)} placeholder="Ej: 1712345678" required className={field} />
      </div>

      {error && <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg p-2.5">{error}</p>}

      <button type="submit" disabled={saving} className="flex items-center gap-2 px-6 py-2.5 rounded-md bg-terracotta text-white text-sm font-semibold hover:bg-terracotta-light transition-colors disabled:opacity-60">
        {saved ? <><CheckCircle2 className="h-4 w-4" /> ¡Guardado!</> : saving ? "Guardando…" : "Guardar datos bancarios"}
      </button>
    </form>
  );
}

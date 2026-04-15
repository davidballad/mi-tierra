/**
 * Bank details display + comprobante (screenshot) upload for transferencia payments.
 */

"use client";

import { useRef } from "react";
import { Upload, X, FileImage } from "lucide-react";
import type { Shop } from "@/types";

interface BankTransferSectionProps {
  shop: Shop;
  file: File | null;
  onFileChange: (f: File | null) => void;
}

export default function BankTransferSection({
  shop,
  file,
  onFileChange,
}: BankTransferSectionProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0] ?? null;
    onFileChange(selected);
  }

  const bankRows = [
    { label: "Banco", value: shop.bankName },
    { label: "Tipo de cuenta", value: shop.accountType === "ahorros" ? "Ahorros" : shop.accountType === "corriente" ? "Corriente" : undefined },
    { label: "Número de cuenta", value: shop.accountNumber },
    { label: "Titular", value: shop.accountHolderName },
    { label: "Cédula / RUC", value: shop.cedula },
  ].filter((r) => r.value);

  return (
    <div className="space-y-4">
      {/* Bank details card */}
      <div className="rounded-lg border border-sand bg-forest/5 p-4 space-y-2">
        <p className="text-xs font-semibold uppercase tracking-widest text-forest mb-3">
          Datos para la transferencia
        </p>
        {bankRows.map(({ label, value }) => (
          <div key={label} className="flex justify-between text-sm gap-4">
            <span className="text-muted-foreground flex-shrink-0">{label}</span>
            <span className="font-medium text-forest text-right">{value}</span>
          </div>
        ))}
      </div>

      {/* Screenshot upload */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">
          Sube tu comprobante *
        </p>

        {file ? (
          <div className="flex items-center gap-3 p-3 rounded-lg border border-forest/30 bg-forest/5">
            <FileImage className="h-5 w-5 text-forest flex-shrink-0" />
            <span className="text-sm font-medium text-forest flex-1 truncate">
              {file.name}
            </span>
            <button
              onClick={() => {
                onFileChange(null);
                if (inputRef.current) inputRef.current.value = "";
              }}
              aria-label="Eliminar archivo"
              className="p-1 rounded text-muted-foreground hover:text-terracotta transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="w-full flex items-center justify-center gap-2 p-4 rounded-lg border-2 border-dashed border-sand hover:border-terracotta text-sm text-muted-foreground hover:text-terracotta transition-colors"
          >
            <Upload className="h-4 w-4" />
            📸 Subir captura de pantalla o foto
          </button>
        )}

        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png"
          onChange={handleFileInput}
          className="hidden"
          aria-label="Seleccionar comprobante de pago"
        />
        <p className="text-xs text-muted-foreground mt-1.5">
          Acepta JPG o PNG. Máximo 5 MB.
        </p>
      </div>
    </div>
  );
}

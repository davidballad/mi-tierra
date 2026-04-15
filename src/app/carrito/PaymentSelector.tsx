/**
 * Payment method toggle (Transferencia / Contra Entrega) + WhatsApp field.
 */

"use client";

import { Landmark, Truck } from "lucide-react";
import type { PaymentMethod } from "@/types";

interface PaymentSelectorProps {
  method: PaymentMethod;
  onChange: (m: PaymentMethod) => void;
  whatsapp: string;
  onWhatsappChange: (v: string) => void;
  transferEnabled: boolean;
}

export default function PaymentSelector({
  method,
  onChange,
  whatsapp,
  onWhatsappChange,
  transferEnabled,
}: PaymentSelectorProps) {
  const options: { value: PaymentMethod; label: string; Icon: typeof Truck; disabled?: boolean }[] =
    [
      {
        value: "transferencia",
        label: "Transferencia bancaria",
        Icon: Landmark,
        disabled: !transferEnabled,
      },
      { value: "contra_entrega", label: "Pago contra entrega", Icon: Truck },
    ];

  return (
    <div className="space-y-4">
      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        Método de pago
      </p>

      <div className="grid grid-cols-2 gap-2">
        {options.map(({ value, label, Icon, disabled }) => (
          <button
            key={value}
            type="button"
            disabled={disabled}
            onClick={() => !disabled && onChange(value)}
            className={`flex flex-col items-center gap-1.5 p-3 rounded-lg border-2 text-xs font-medium transition-all ${
              method === value && !disabled
                ? "border-terracotta bg-terracotta/5 text-terracotta"
                : disabled
                ? "border-sand bg-sand/40 text-muted-foreground cursor-not-allowed opacity-60"
                : "border-sand bg-white text-forest hover:border-forest"
            }`}
          >
            <Icon className="h-5 w-5" />
            {label}
          </button>
        ))}
      </div>

      {!transferEnabled && (
        <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-2.5">
          Este artesano aún no ha configurado sus datos bancarios. Solo está disponible el pago contra entrega.
        </p>
      )}

      {/* WhatsApp */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1.5">
          Tu número de WhatsApp *
        </label>
        <input
          type="tel"
          value={whatsapp}
          onChange={(e) => onWhatsappChange(e.target.value)}
          placeholder="+593 99 123 4567"
          className="w-full rounded-md border border-sand bg-cream px-3 py-2 text-sm text-forest placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-terracotta/40"
        />
        <p className="text-xs text-muted-foreground mt-1">
          El artesano te contactará aquí para coordinar la entrega.
        </p>
      </div>
    </div>
  );
}

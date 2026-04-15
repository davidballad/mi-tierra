/**
 * /comisiones — Commission and fee breakdown for sellers.
 */

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Banknote, Percent, ShieldCheck, BadgeCheck } from "lucide-react";

export const metadata = {
  title: "Comisiones | Mi Tierra",
  description: "Estructura de comisiones transparente para artesanos en Mi Tierra.",
};

const TIERS = [
  {
    label: "Comisión de plataforma",
    value: "5%",
    desc: "Por cada venta completada. La más baja del mercado.",
    highlight: true,
  },
  {
    label: "Creación de cuenta",
    value: "Gratis",
    desc: "Sin costos de registro ni mensualidades.",
    highlight: false,
  },
  {
    label: "Listado de productos",
    value: "Gratis",
    desc: "Publica todos los productos que quieras sin límite.",
    highlight: false,
  },
  {
    label: "Modelo de pago",
    value: "Contra entrega",
    desc: "El comprador paga al recibir. Sin riesgo para el artesano.",
    highlight: false,
  },
];

const EXAMPLE_SALE = { price: 80, commission: 4, sellerNet: 76 };

export default function ComisionesPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 bg-cream">
        {/* Header */}
        <div className="border-b border-sand py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-forest">
              Comisiones
            </h1>
            <p className="text-muted-foreground mt-2">
              Transparencia total — sin sorpresas, sin letra pequeña.
            </p>
          </div>
        </div>

        <section className="py-14">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">

            {/* Fee tiles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {TIERS.map(({ label, value, desc, highlight }) => (
                <div
                  key={label}
                  className={`p-6 rounded-xl border-2 bg-white ${
                    highlight ? "border-terracotta" : "border-sand"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">
                        {label}
                      </p>
                      <p
                        className={`font-heading text-4xl font-bold ${
                          highlight ? "text-terracotta" : "text-forest"
                        }`}
                      >
                        {value}
                      </p>
                      <p className="text-sm text-muted-foreground mt-2">{desc}</p>
                    </div>
                    {highlight && (
                      <Percent className="h-6 w-6 text-terracotta flex-shrink-0 mt-1" />
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Example calculation */}
            <div className="rounded-xl border border-sand bg-white p-8">
              <div className="flex items-center gap-3 mb-6">
                <Banknote className="h-6 w-6 text-terracotta" />
                <h2 className="font-heading text-2xl font-bold text-forest">
                  Ejemplo de venta
                </h2>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-3 border-b border-sand">
                  <span className="text-sm text-muted-foreground">Precio de venta</span>
                  <span className="font-semibold text-forest">
                    ${EXAMPLE_SALE.price.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-sand">
                  <span className="text-sm text-muted-foreground">
                    Comisión Mi Tierra (5%)
                  </span>
                  <span className="font-semibold text-terracotta">
                    −${EXAMPLE_SALE.commission.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="font-semibold text-forest">Tú recibes</span>
                  <span className="font-heading text-2xl font-bold text-forest">
                    ${EXAMPLE_SALE.sellerNet.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Benefits */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { icon: ShieldCheck, text: "Pagos protegidos y garantizados" },
                { icon: BadgeCheck,  text: "Sin cobros mensuales ni suscripciones" },
                { icon: Banknote,    text: "Transferencia a tu cuenta en 48 h" },
                { icon: Percent,     text: "La comisión más baja del mercado artesanal" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3 p-4 rounded-lg bg-forest/5">
                  <Icon className="h-5 w-5 text-forest flex-shrink-0" />
                  <span className="text-sm font-medium text-forest">{text}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

/**
 * /vender — seller landing page with CTA to open the onboarding flow.
 */

"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useAuthFlow } from "@/contexts/AuthFlowContext";
import { Store, ShieldCheck, TrendingUp, Banknote } from "lucide-react";

const BENEFITS = [
  { icon: Store,       title: "Crea tu tienda gratis",   desc: "Configura tu perfil y empieza a vender en minutos." },
  { icon: TrendingUp,  title: "Llega a más compradores", desc: "Accede a clientes de todo Ecuador y el mundo." },
  { icon: Banknote,    title: "Cobra con seguridad",     desc: "Pagos protegidos con solo 5% de comisión por venta." },
  { icon: ShieldCheck, title: "Soporte artesanal",       desc: "Te acompañamos en cada paso de tu camino." },
] as const;

export default function VenderPage() {
  const { user, firestoreUser, openAuthModal } = useAuthFlow();

  const cta =
    firestoreUser?.role === "seller"
      ? null // already a seller, show dashboard link later
      : user
      ? "Configura tu Tienda"
      : "Empieza Ahora — Es Gratis";

  return (
    <>
      <Navbar />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-forest text-cream py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="font-heading text-5xl md:text-6xl font-bold mb-6">
              Vende tu Arte en<br />
              <span className="text-sand italic">Mi Tierra</span>
            </h1>
            <p className="text-cream/80 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
              Conectamos tu talento con miles de compradores que valoran las artesanías
              ecuatorianas auténticas.
            </p>
            {cta && (
              <Button
                onClick={openAuthModal}
                className="bg-terracotta text-white hover:bg-terracotta-light text-base px-10 py-3 h-auto"
              >
                {cta}
              </Button>
            )}
            {firestoreUser?.role === "seller" && (
              <p className="text-sand text-base">
                ¡Ya eres artesano en Mi Tierra! El panel de vendedor llega pronto.
              </p>
            )}
          </div>
        </section>

        {/* Benefits */}
        <section className="bg-cream py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-heading text-3xl font-bold text-forest text-center mb-10">
              ¿Por qué vender en Mi Tierra?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {BENEFITS.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="p-6 rounded-xl border border-sand bg-white hover:shadow-sm transition-shadow">
                  <div className="h-12 w-12 rounded-lg bg-terracotta/10 flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6 text-terracotta" />
                  </div>
                  <h3 className="font-heading font-semibold text-forest mb-2">{title}</h3>
                  <p className="text-sm text-muted-foreground">{desc}</p>
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

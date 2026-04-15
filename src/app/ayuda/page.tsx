/**
 * /ayuda — Centro de Ayuda (Help Center).
 */

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { HelpCircle, Package, CreditCard, Store, MessageCircle } from "lucide-react";

export const metadata = {
  title: "Centro de Ayuda | Mi Tierra",
  description: "Resuelve tus dudas sobre compras, ventas y pagos en Mi Tierra.",
};

const FAQ_SECTIONS = [
  {
    icon: Package,
    title: "Compras",
    questions: [
      {
        q: "¿Cómo realizo un pedido?",
        a: "Explora nuestro catálogo, elige el producto que deseas, selecciona cantidad y haz clic en 'Añadir al carrito'. Luego completa el proceso de pago.",
      },
      {
        q: "¿Cuánto tarda el envío?",
        a: "El tiempo de envío depende del artesano y tu provincia. Normalmente entre 3 y 10 días hábiles dentro de Ecuador.",
      },
      {
        q: "¿Puedo devolver un producto?",
        a: "Sí, tienes hasta 7 días desde la recepción para solicitar una devolución si el producto presenta defectos o no corresponde a lo descrito.",
      },
    ],
  },
  {
    icon: CreditCard,
    title: "Pagos",
    questions: [
      {
        q: "¿Qué métodos de pago aceptan?",
        a: "Aceptamos tarjetas de crédito/débito Visa, Mastercard, y transferencias bancarias a través de nuestra plataforma segura.",
      },
      {
        q: "¿Es seguro pagar en Mi Tierra?",
        a: "Todos los pagos están protegidos con encriptación SSL. Tu información financiera nunca se comparte con los artesanos.",
      },
    ],
  },
  {
    icon: Store,
    title: "Vendedores",
    questions: [
      {
        q: "¿Cómo me registro como artesano?",
        a: "Crea una cuenta, elige el rol 'Artesano' y configura tu tienda con nombre, descripción y productos. El proceso toma menos de 5 minutos.",
      },
      {
        q: "¿Cuándo recibo mi pago?",
        a: "Los pagos se liberan 48 horas después de confirmada la entrega, directamente a la cuenta que registres en tu panel de vendedor.",
      },
    ],
  },
];

export default function AyudaPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 bg-cream">
        {/* Header */}
        <div className="border-b border-sand py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="h-14 w-14 rounded-full bg-terracotta/10 flex items-center justify-center">
                <HelpCircle className="h-7 w-7 text-terracotta" />
              </div>
            </div>
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-forest">
              Centro de Ayuda
            </h1>
            <p className="text-muted-foreground mt-2 max-w-xl mx-auto">
              Encuentra respuestas a las preguntas más frecuentes sobre Mi Tierra.
            </p>
          </div>
        </div>

        {/* FAQ sections */}
        <section className="py-14">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            {FAQ_SECTIONS.map(({ icon: Icon, title, questions }) => (
              <div key={title}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-9 w-9 rounded-lg bg-terracotta/10 flex items-center justify-center">
                    <Icon className="h-5 w-5 text-terracotta" />
                  </div>
                  <h2 className="font-heading text-2xl font-bold text-forest">{title}</h2>
                </div>
                <div className="space-y-4">
                  {questions.map(({ q, a }) => (
                    <div key={q} className="p-5 rounded-xl border border-sand bg-white">
                      <p className="font-semibold text-forest mb-2">{q}</p>
                      <p className="text-sm text-muted-foreground leading-relaxed">{a}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Contact CTA */}
        <section className="py-10 border-t border-sand">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex justify-center mb-3">
              <MessageCircle className="h-6 w-6 text-terracotta" />
            </div>
            <h2 className="font-heading text-xl font-bold text-forest mb-2">
              ¿No encontraste tu respuesta?
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              Escríbenos y te respondemos en menos de 24 horas.
            </p>
            <a
              href="/contacto"
              className="inline-flex items-center justify-center rounded-md bg-terracotta text-white text-sm font-medium px-6 py-2.5 hover:bg-terracotta-light transition-colors"
            >
              Contáctanos
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

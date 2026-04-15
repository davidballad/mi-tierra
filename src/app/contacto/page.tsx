/**
 * /contacto — Contact page with info and a static form (UI only).
 */

"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Mail, MapPin, Clock, Send } from "lucide-react";

const CONTACT_INFO = [
  {
    icon: Mail,
    label: "Correo electrónico",
    value: "hola@mitierra.ec",
  },
  {
    icon: MapPin,
    label: "Ubicación",
    value: "Quito, Ecuador",
  },
  {
    icon: Clock,
    label: "Horario de atención",
    value: "Lun – Vie, 9:00 – 18:00 (ECT)",
  },
];

type FormState = "idle" | "loading" | "sent";

export default function ContactoPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [state, setState] = useState<FormState>("idle");

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");
    // TODO: wire up to a backend / email service
    setTimeout(() => setState("sent"), 1200);
  }

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-cream">
        <div className="border-b border-sand py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-forest">
              Contacto
            </h1>
            <p className="text-muted-foreground mt-2">
              Estamos aquí para ayudarte. Escríbenos y te respondemos pronto.
            </p>
          </div>
        </div>

        <section className="py-14">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-10">

            {/* Contact info */}
            <div className="space-y-6">
              <h2 className="font-heading text-xl font-bold text-forest">
                Información de contacto
              </h2>
              {CONTACT_INFO.map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-start gap-3">
                  <div className="h-9 w-9 rounded-lg bg-terracotta/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Icon className="h-4 w-4 text-terracotta" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                      {label}
                    </p>
                    <p className="text-sm text-forest font-medium mt-0.5">{value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Form */}
            <div className="lg:col-span-2">
              {state === "sent" ? (
                <div className="flex flex-col items-center justify-center text-center py-16 px-6 rounded-xl border border-sand bg-white h-full">
                  <div className="h-14 w-14 rounded-full bg-forest/10 flex items-center justify-center mb-4">
                    <Send className="h-7 w-7 text-forest" />
                  </div>
                  <h2 className="font-heading text-2xl font-bold text-forest mb-2">
                    ¡Mensaje enviado!
                  </h2>
                  <p className="text-muted-foreground text-sm max-w-sm">
                    Gracias por escribirnos. Nuestro equipo te responderá en menos de 24 horas.
                  </p>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="p-8 rounded-xl border border-sand bg-white space-y-5"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1.5">
                        Nombre
                      </label>
                      <input
                        name="name"
                        required
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Tu nombre completo"
                        className="w-full rounded-md border border-sand bg-cream px-3 py-2 text-sm text-forest placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-terracotta/40"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1.5">
                        Correo electrónico
                      </label>
                      <input
                        name="email"
                        type="email"
                        required
                        value={form.email}
                        onChange={handleChange}
                        placeholder="tu@correo.com"
                        className="w-full rounded-md border border-sand bg-cream px-3 py-2 text-sm text-forest placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-terracotta/40"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1.5">
                      Asunto
                    </label>
                    <select
                      name="subject"
                      required
                      value={form.subject}
                      onChange={handleChange}
                      className="w-full rounded-md border border-sand bg-cream px-3 py-2 text-sm text-forest focus:outline-none focus:ring-2 focus:ring-terracotta/40"
                    >
                      <option value="">Selecciona un tema</option>
                      <option value="compra">Consulta sobre una compra</option>
                      <option value="venta">Quiero ser artesano</option>
                      <option value="pago">Problema con un pago</option>
                      <option value="cuenta">Problema con mi cuenta</option>
                      <option value="otro">Otro</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1.5">
                      Mensaje
                    </label>
                    <textarea
                      name="message"
                      required
                      rows={5}
                      value={form.message}
                      onChange={handleChange}
                      placeholder="Cuéntanos en qué podemos ayudarte..."
                      className="w-full rounded-md border border-sand bg-cream px-3 py-2 text-sm text-forest placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-terracotta/40 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={state === "loading"}
                    className="inline-flex items-center justify-center gap-2 w-full rounded-md bg-terracotta text-white text-sm font-medium px-6 py-2.5 hover:bg-terracotta-light transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {state === "loading" ? (
                      "Enviando…"
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        Enviar mensaje
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

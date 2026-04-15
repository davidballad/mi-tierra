/**
 * /terminos — Términos de Uso.
 */

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Scale } from "lucide-react";

export const metadata = {
  title: "Términos de Uso | Mi Tierra",
  description: "Términos y condiciones de uso de la plataforma Mi Tierra.",
};

const SECTIONS = [
  {
    title: "1. Aceptación de los Términos",
    body: `Al acceder y usar Mi Tierra, aceptas quedar vinculado por estos Términos de Uso. Si no estás de acuerdo con alguna parte de estos términos, no podrás acceder a la plataforma. Nos reservamos el derecho de actualizar estos términos en cualquier momento; los cambios entran en vigor al publicarse.`,
  },
  {
    title: "2. Uso de la Plataforma",
    body: `Mi Tierra es una plataforma de marketplace para artesanías ecuatorianas. Los usuarios pueden registrarse como compradores o como vendedores (artesanos). Está prohibido publicar productos falsos, plagiar creaciones de otros artesanos, o utilizar la plataforma con fines fraudulentos. Nos reservamos el derecho de suspender cuentas que infrinjan estas normas.`,
  },
  {
    title: "3. Cuentas de Usuario",
    body: `Eres responsable de mantener la confidencialidad de tu cuenta y contraseña. Toda actividad que ocurra bajo tu cuenta es de tu responsabilidad. Notifícanos de inmediato si sospechas de uso no autorizado. Puedes eliminar tu cuenta en cualquier momento desde tu perfil.`,
  },
  {
    title: "4. Transacciones y Pagos",
    body: `Mi Tierra actúa como intermediario entre compradores y vendedores. Los pagos se procesan de forma segura a través de nuestra plataforma. Mi Tierra retiene una comisión del 5% por cada venta completada. Los vendedores reciben el 95% restante dentro de 48 horas tras confirmarse la entrega.`,
  },
  {
    title: "5. Propiedad Intelectual",
    body: `Los artesanos conservan todos los derechos sobre sus diseños y creaciones. Al publicar en Mi Tierra, concedes una licencia no exclusiva para mostrar tus productos en la plataforma con fines de promoción y venta. El contenido de Mi Tierra (logotipos, diseño, código) es propiedad exclusiva de la plataforma.`,
  },
  {
    title: "6. Devoluciones y Disputas",
    body: `Los compradores tienen derecho a solicitar una devolución dentro de los 7 días siguientes a la recepción si el producto presenta defectos o no corresponde a la descripción. Las disputas se resuelven mediante nuestro equipo de soporte. Mi Tierra se reserva la decisión final en casos de conflicto entre comprador y vendedor.`,
  },
  {
    title: "7. Limitación de Responsabilidad",
    body: `Mi Tierra no es responsable por demoras en envíos, daños durante el transporte, o incumplimientos por parte de vendedores individuales. La plataforma se provee "tal como está" sin garantías implícitas de disponibilidad continua. Tomamos medidas razonables para garantizar la seguridad pero no podemos garantizar la ausencia total de interrupciones.`,
  },
  {
    title: "8. Ley Aplicable",
    body: `Estos términos se rigen por las leyes de la República del Ecuador. Cualquier disputa legal se someterá a los tribunales competentes de Quito, Ecuador. Si alguna disposición de estos términos resulta inválida, las demás permanecerán vigentes.`,
  },
];

export default function TerminosPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 bg-cream">
        <div className="border-b border-sand py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-2">
              <Scale className="h-7 w-7 text-terracotta" />
              <h1 className="font-heading text-4xl md:text-5xl font-bold text-forest">
                Términos de Uso
              </h1>
            </div>
            <p className="text-muted-foreground mt-1">Última actualización: enero 2025</p>
          </div>
        </div>

        <section className="py-14">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            {SECTIONS.map(({ title, body }) => (
              <div key={title}>
                <h2 className="font-heading text-xl font-bold text-forest mb-3">{title}</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

/**
 * /privacidad — Política de Privacidad.
 */

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Lock } from "lucide-react";

export const metadata = {
  title: "Privacidad | Mi Tierra",
  description: "Política de privacidad y tratamiento de datos personales en Mi Tierra.",
};

const SECTIONS = [
  {
    title: "1. Información que Recopilamos",
    body: `Recopilamos información que nos proporcionas directamente al crear una cuenta: nombre, dirección de correo electrónico, provincia y, para vendedores, información de tu tienda. También recopilamos datos de uso de la plataforma como páginas visitadas, productos visualizados y compras realizadas. No recopilamos información de pago directamente — los pagos los gestiona nuestro proveedor de pagos certificado PCI-DSS.`,
  },
  {
    title: "2. Uso de la Información",
    body: `Usamos tu información para operar la plataforma, procesar pedidos, enviarte comunicaciones relacionadas con tus compras o ventas, mejorar nuestros servicios y cumplir con obligaciones legales. Nunca vendemos tu información personal a terceros. Podemos compartir datos con proveedores de servicios (hosting, pagos, envíos) únicamente en la medida necesaria para operar la plataforma.`,
  },
  {
    title: "3. Cookies y Tecnologías de Rastreo",
    body: `Mi Tierra utiliza cookies esenciales para el funcionamiento de la plataforma (autenticación, carrito de compras) y cookies analíticas para entender cómo se usa el sitio. Puedes controlar las cookies analíticas desde la configuración de tu navegador. Las cookies esenciales no pueden desactivarse ya que son necesarias para el funcionamiento básico.`,
  },
  {
    title: "4. Almacenamiento y Seguridad",
    body: `Tus datos se almacenan en servidores seguros de Google Cloud Platform con acceso restringido. Implementamos medidas técnicas y organizativas para proteger tu información contra acceso no autorizado, pérdida o divulgación. Sin embargo, ningún sistema es 100% seguro; te recomendamos usar una contraseña robusta y no compartirla.`,
  },
  {
    title: "5. Tus Derechos",
    body: `De acuerdo con la legislación ecuatoriana vigente, tienes derecho a acceder a tu información personal, corregirla, solicitar su eliminación y oponerte a ciertos usos. Puedes ejercer estos derechos contactándonos en privacidad@mitierra.ec. Respondemos dentro de 30 días hábiles.`,
  },
  {
    title: "6. Retención de Datos",
    body: `Conservamos tu información mientras tu cuenta esté activa o sea necesario para prestarte el servicio. Si eliminas tu cuenta, borraremos tus datos personales dentro de 30 días, excepto cuando debamos conservarlos por obligaciones legales (p.ej., registros de transacciones por 7 años según normativa tributaria ecuatoriana).`,
  },
  {
    title: "7. Menores de Edad",
    body: `Mi Tierra no está dirigida a personas menores de 18 años. No recopilamos intencionalmente información de menores. Si descubrimos que hemos recopilado datos de un menor sin consentimiento parental verificable, los eliminaremos de inmediato.`,
  },
  {
    title: "8. Cambios a esta Política",
    body: `Podemos actualizar esta política de privacidad periódicamente. Te notificaremos de cambios significativos por correo electrónico o mediante un aviso prominente en la plataforma. El uso continuado de Mi Tierra tras la publicación de cambios constituye tu aceptación de la política actualizada.`,
  },
  {
    title: "9. Contacto",
    body: `Si tienes preguntas sobre esta política o el tratamiento de tus datos, escríbenos a privacidad@mitierra.ec o a través de nuestro formulario de contacto en /contacto.`,
  },
];

export default function PrivacidadPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 bg-cream">
        <div className="border-b border-sand py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-2">
              <Lock className="h-7 w-7 text-terracotta" />
              <h1 className="font-heading text-4xl md:text-5xl font-bold text-forest">
                Política de Privacidad
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

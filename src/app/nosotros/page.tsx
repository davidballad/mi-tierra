/**
 * /nosotros — About Mi Tierra.
 */

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Leaf, Heart, Globe, Users } from "lucide-react";

export const metadata = {
  title: "Sobre Nosotros | Mi Tierra",
  description: "Conoce la misión y visión de Mi Tierra, el marketplace de artesanías ecuatorianas.",
};

const VALUES = [
  {
    icon: Heart,
    title: "Pasión por la cultura",
    desc: "Creemos que cada pieza artesanal es un fragmento del alma del Ecuador, y trabajamos para preservarla.",
  },
  {
    icon: Users,
    title: "Comunidad primero",
    desc: "Nuestra plataforma existe para el artesano. Ellos son los protagonistas, nosotros solo el puente.",
  },
  {
    icon: Globe,
    title: "Alcance global",
    desc: "Llevamos las tradiciones ecuatorianas a compradores de todo el mundo que valoran lo auténtico.",
  },
  {
    icon: Leaf,
    title: "Comercio justo",
    desc: "95% de cada venta va directamente al artesano. Sostenibilidad económica y cultural van de la mano.",
  },
];

const STATS = [
  { value: "500+", label: "Artesanos activos" },
  { value: "2,800+", label: "Productos únicos" },
  { value: "24", label: "Provincias representadas" },
  { value: "5%", label: "Comisión — la más justa" },
];

export default function NosotrosPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-forest text-cream py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex justify-center mb-6">
              <Leaf className="h-12 w-12 text-sand" />
            </div>
            <h1 className="font-heading text-5xl md:text-6xl font-bold mb-6">
              Sobre <span className="text-sand italic">Mi Tierra</span>
            </h1>
            <p className="text-cream/80 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              Somos un marketplace nacido en Ecuador para conectar a los maestros artesanos
              con compradores que buscan algo genuino — una historia, una tradición, un alma.
            </p>
          </div>
        </section>

        {/* Stats */}
        <section className="bg-sand py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
              {STATS.map(({ value, label }) => (
                <div key={label}>
                  <p className="font-heading text-4xl font-bold text-terracotta">{value}</p>
                  <p className="text-sm text-forest/70 mt-1">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Mission */}
        <section className="bg-cream py-16">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-heading text-3xl font-bold text-forest text-center mb-6">
              Nuestra Misión
            </h2>
            <p className="text-muted-foreground leading-relaxed text-center text-lg">
              Democratizar el acceso al mercado para cada artesano ecuatoriano — sin importar
              su provincia, su edad o su experiencia digital. Queremos que el trabajo de sus
              manos llegue a todo el mundo con un solo clic.
            </p>
          </div>
        </section>

        {/* Values */}
        <section className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-heading text-3xl font-bold text-forest text-center mb-10">
              Nuestros Valores
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {VALUES.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="p-6 rounded-xl border border-sand">
                  <div className="h-12 w-12 rounded-lg bg-terracotta/10 flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6 text-terracotta" />
                  </div>
                  <h3 className="font-heading font-semibold text-forest mb-2">{title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
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

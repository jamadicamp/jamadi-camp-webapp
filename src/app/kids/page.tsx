import Link from "next/link";
import routes from "../lib/routes";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Jamädi Kids",
  description:
    "Campamentos y programas diseñados para que los niños descubran la naturaleza, aprendan del campo y vivan aventuras seguras y memorables.",
};

const programas = [
  {
    icon: "🌄",
    name: "Campamento de Verano",
    ages: "7 – 15 años",
    duration: "3, 5 o 7 días",
    desc: "El programa más completo para niños y adolescentes. Una semana en el campo donde aprenden a acampar, cocinar al fuego, identificar plantas, cuidar animales y trabajar en equipo. Guías certificados y ratio 1:8.",
    includes: ["Alojamiento", "Alimentación completa", "Actividades guiadas", "Kit del campista"],
  },
  {
    icon: "🌿",
    name: "Talleres de Naturaleza",
    ages: "5 – 12 años",
    duration: "1 día",
    desc: "Talleres de un día donde los niños aprenden sobre la vida del bosque, los ciclos naturales y la importancia del cuidado del medio ambiente. Con actividades prácticas, juegos y mucho movimiento al aire libre.",
    includes: ["Guía experto", "Material didáctico", "Merienda orgánica", "Certificado participante"],
  },
  {
    icon: "🐓",
    name: "Granja para Niños",
    ages: "3 – 10 años",
    duration: "2 – 4 horas",
    desc: "Los más pequeños descubren de dónde viene la leche, los huevos y las verduras. Alimentan animales, siembran semillas y aprenden con las manos en la tierra. Ideal para visitas familiares.",
    includes: ["Guía de granja", "Actividades prácticas", "Snack de la huerta", "Foto recuerdo"],
  },
  {
    icon: "🎨",
    name: "Arte en la Naturaleza",
    ages: "5 – 14 años",
    duration: "Tarde completa",
    desc: "Taller creativo donde los niños usan elementos naturales como herramientas artísticas: hojas, ramas, piedras, flores. Pintura con pigmentos naturales, escultura con barro, collages y más.",
    includes: ["Materiales naturales", "Guía artístico", "Merienda", "Obra para llevar a casa"],
  },
];

export default function KidsPage() {
  return (
    <main>
      {/* Hero */}
      <section className="bg-[#3a383a] text-white py-20 px-4 md:px-20">
        <p className="text-xs uppercase tracking-widest opacity-60 mb-4">Jamädi</p>
        <h1 className="text-5xl md:text-7xl font-light italic mb-6">Kids</h1>
        <p className="text-lg opacity-80 max-w-2xl leading-relaxed">
          Aventuras pensadas para los más pequeños. Un espacio seguro donde los niños
          descubren la naturaleza, aprenden del campo y crean memorias que duran toda la vida.
        </p>
      </section>

      {/* Filosofía */}
      <section className="bg-orange-50 py-16 px-4 md:px-20">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-light italic text-[#3a383a]">
              Aprender jugando en la naturaleza
            </h2>
            <p className="text-[#3a383a] opacity-80 leading-relaxed">
              Los niños de hoy pasan demasiado tiempo en interiores. En Jamädi Kids
              creamos experiencias que los sacan de las pantallas y los conectan con
              el mundo real: la tierra, los animales, el clima y sus propias capacidades.
            </p>
            <p className="text-[#3a383a] opacity-80 leading-relaxed">
              Todos nuestros programas son diseñados por educadores con experiencia en
              pedagogía al aire libre. Seguridad, respeto y diversión en igual medida.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-6">
            {[
              { icon: "🛡️", label: "Seguridad certificada" },
              { icon: "👥", label: "Grupos pequeños" },
              { icon: "🌱", label: "Enfoque educativo" },
              { icon: "❤️", label: "Ambiente familiar" },
            ].map((item) => (
              <div
                key={item.label}
                className="bg-white p-6 text-center space-y-2 border border-[#3a383a]/10"
              >
                <span className="text-3xl">{item.icon}</span>
                <p className="text-sm font-medium text-[#3a383a]">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Programs */}
      <section className="bg-white py-16 px-4 md:px-20">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-light italic text-[#3a383a] mb-12 text-center">
            Nuestros programas
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
            {programas.map((p) => (
              <div
                key={p.name}
                className="border border-[#3a383a]/10 p-8 space-y-4"
              >
                <span className="text-3xl">{p.icon}</span>
                <div>
                  <h3 className="text-xl font-light italic text-[#3a383a]">{p.name}</h3>
                  <div className="flex gap-3 mt-2">
                    <span className="text-xs uppercase tracking-widest bg-orange-50 px-2 py-1 text-[#3a383a]">
                      {p.ages}
                    </span>
                    <span className="text-xs uppercase tracking-widest bg-orange-50 px-2 py-1 text-[#3a383a]">
                      {p.duration}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-[#3a383a] opacity-70 leading-relaxed">{p.desc}</p>
                <div>
                  <p className="text-xs uppercase tracking-widest text-[#3a383a] opacity-50 mb-2">
                    Incluye
                  </p>
                  <ul className="space-y-1">
                    {p.includes.map((inc) => (
                      <li key={inc} className="flex items-center gap-2 text-sm text-[#3a383a] opacity-70">
                        <span className="w-1 h-1 rounded-full bg-[#3a383a] opacity-40" />
                        {inc}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-orange-50 py-16 px-4 md:px-20 text-center">
        <h2 className="text-3xl md:text-4xl font-light italic text-[#3a383a] mb-4">
          Inscribe a tu hijo
        </h2>
        <p className="max-w-lg mx-auto mb-8 text-[#3a383a] opacity-80">
          Plazas limitadas por programa. Contáctanos para conocer fechas disponibles,
          precios y qué incluye cada paquete para tu familia.
        </p>
        <a
          href="https://wa.me/524464109800?text=Hola%2C%20quiero%20información%20sobre%20Jamädi%20Kids"
          className="inline-block bg-[#3a383a] text-white px-8 py-3 uppercase text-xs tracking-widest hover:opacity-80 transition-opacity"
        >
          Consultar por WhatsApp
        </a>
      </section>
    </main>
  );
}

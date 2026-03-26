import Link from "next/link";
import routes from "../lib/routes";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Jamädi Orgánico",
  description:
    "Restaurante de cocina de campo con ingredientes orgánicos locales. Desayunos, comidas y cenas con los sabores auténticos de Amealco.",
};

const menuDesayunos = [
  { name: "Huevos de rancho", desc: "Huevos frescos de la granja con salsa verde y tortillas de maíz" },
  { name: "Tamales artesanales", desc: "Preparados con masa de maíz criollo y rellenos de temporada" },
  { name: "Atole de guayaba", desc: "Bebida tradicional hecha con fruta de la región" },
  { name: "Café de olla", desc: "Café preparado con canela y piloncillo al estilo tradicional" },
  { name: "Enfrijoladas", desc: "Tortillas bañadas en salsa de frijol negro con queso fresco" },
];

const menuComidas = [
  { name: "Caldo de res", desc: "Caldo nutritivo con verduras de temporada del huerto propio" },
  { name: "Chiles rellenos", desc: "Poblanos rellenos de queso Oaxaca y nuez, en caldillo de jitomate" },
  { name: "Enchiladas verdes", desc: "Con pollo de rancho, crema fresca y queso rallado" },
  { name: "Trucha del arroyo", desc: "Trucha local a la plancha con hierbas del campo" },
  { name: "Pozole rojo", desc: "Los fines de semana, maíz cacahuazintle con carne de cerdo y garniciones" },
];

const menuPostres = [
  { name: "Pan dulce de horno", desc: "Horneado diariamente con receta de la abuela" },
  { name: "Cajeta artesanal", desc: "Elaborada en la región con leche de cabra" },
  { name: "Queso con miel y nuez", desc: "Quesos locales acompañados de miel de abeja y nuez de Castilla" },
];

const eventos = [
  {
    name: "Noches de Fondue",
    desc: "Los viernes por la noche: fondue de queso artesanal al calor de la fogata. Reservaciones previas.",
    icon: "🫕",
  },
  {
    name: "Cenas Especiales",
    desc: "Cenas de degustación con menús de temporada diseñados por nuestros cocineros. Agenda tu mesa.",
    icon: "🕯️",
  },
  {
    name: "Maridaje de Quesos",
    desc: "Tardes de sábado: selección de quesos artesanales de Querétaro con mermeladas y vinos locales.",
    icon: "🧀",
  },
  {
    name: "Desayunos del Campo",
    desc: "Domingos: desayuno comunitario en la terraza con todo incluido. Familias bienvenidas.",
    icon: "🌅",
  },
];

export default function OrganicoPage() {
  return (
    <main>
      {/* Hero */}
      <section className="bg-[#3a383a] text-white py-20 px-4 md:px-20">
        <p className="text-xs uppercase tracking-widest opacity-60 mb-4">Jamädi</p>
        <h1 className="text-5xl md:text-7xl font-light italic mb-6">Orgánico</h1>
        <p className="text-lg opacity-80 max-w-2xl leading-relaxed">
          Sabores del campo, corazón de la naturaleza. Una cocina honesta hecha con
          ingredientes orgánicos de la región, preparada con técnicas tradicionales.
        </p>
      </section>

      {/* About */}
      <section className="bg-orange-50 py-16 px-4 md:px-20">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-light italic text-[#3a383a]">
              Del campo a tu mesa
            </h2>
            <p className="text-[#3a383a] opacity-80 leading-relaxed">
              En Jamädi Orgánico creemos que comer bien comienza por conocer el origen
              de lo que ponemos en el plato. Por eso trabajamos con productores locales
              de Amealco y cultivamos una parte de nuestros ingredientes en el huerto propio.
            </p>
            <p className="text-[#3a383a] opacity-80 leading-relaxed">
              Nuestra cocina es de temporada: lo que ofrece la tierra en cada época del año
              es lo que encontrarás en nuestro menú. Sin artificiales, sin procesos industriales,
              con todo el sabor de lo auténtico.
            </p>
          </div>
          <div className="border border-[#3a383a]/20 p-8 space-y-3 text-[#3a383a]">
            <h3 className="text-sm uppercase tracking-widest opacity-60 mb-4" id="horarios">
              Horarios
            </h3>
            <div className="flex justify-between border-b border-[#3a383a]/10 pb-3">
              <span className="opacity-70">Lunes – Viernes</span>
              <span className="font-medium">8:00 am – 8:00 pm</span>
            </div>
            <div className="flex justify-between border-b border-[#3a383a]/10 pb-3">
              <span className="opacity-70">Sábado</span>
              <span className="font-medium">7:00 am – 9:00 pm</span>
            </div>
            <div className="flex justify-between border-b border-[#3a383a]/10 pb-3">
              <span className="opacity-70">Domingo</span>
              <span className="font-medium">7:00 am – 6:00 pm</span>
            </div>
            <p className="text-xs opacity-50 pt-2">
              Reservaciones recomendadas para grupos de 6 o más personas.
            </p>
          </div>
        </div>
      </section>

      {/* Menu */}
      <section className="bg-white py-16 px-4 md:px-20" id="menu">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-light italic text-[#3a383a] mb-12 text-center">
            Menú
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Desayunos */}
            <div>
              <h3 className="text-xs uppercase tracking-widest text-[#3a383a] opacity-60 mb-6 border-b border-[#3a383a]/20 pb-3">
                Desayunos
              </h3>
              <ul className="space-y-5">
                {menuDesayunos.map((item) => (
                  <li key={item.name}>
                    <p className="font-medium text-[#3a383a]">{item.name}</p>
                    <p className="text-sm text-[#3a383a] opacity-60 mt-1 leading-relaxed">{item.desc}</p>
                  </li>
                ))}
              </ul>
            </div>

            {/* Comidas */}
            <div>
              <h3 className="text-xs uppercase tracking-widest text-[#3a383a] opacity-60 mb-6 border-b border-[#3a383a]/20 pb-3">
                Comidas
              </h3>
              <ul className="space-y-5">
                {menuComidas.map((item) => (
                  <li key={item.name}>
                    <p className="font-medium text-[#3a383a]">{item.name}</p>
                    <p className="text-sm text-[#3a383a] opacity-60 mt-1 leading-relaxed">{item.desc}</p>
                  </li>
                ))}
              </ul>
            </div>

            {/* Postres */}
            <div>
              <h3 className="text-xs uppercase tracking-widest text-[#3a383a] opacity-60 mb-6 border-b border-[#3a383a]/20 pb-3">
                Postres
              </h3>
              <ul className="space-y-5">
                {menuPostres.map((item) => (
                  <li key={item.name}>
                    <p className="font-medium text-[#3a383a]">{item.name}</p>
                    <p className="text-sm text-[#3a383a] opacity-60 mt-1 leading-relaxed">{item.desc}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <p className="text-xs text-center opacity-40 mt-12 italic">
            El menú varía según la temporada y disponibilidad de ingredientes locales.
          </p>
        </div>
      </section>

      {/* Eventos */}
      <section className="bg-orange-50 py-16 px-4 md:px-20" id="eventos">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-light italic text-[#3a383a] mb-4 text-center">
            Eventos especiales
          </h2>
          <p className="text-center text-[#3a383a] opacity-70 mb-12 max-w-xl mx-auto">
            Más allá del menú del día, organizamos experiencias gastronómicas únicas
            a lo largo del año.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {eventos.map((ev) => (
              <div
                key={ev.name}
                className="bg-white p-8 border border-[#3a383a]/10 space-y-3"
              >
                <span className="text-3xl">{ev.icon}</span>
                <h3 className="text-xl font-light italic text-[#3a383a]">{ev.name}</h3>
                <p className="text-sm text-[#3a383a] opacity-70 leading-relaxed">{ev.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white py-16 px-4 md:px-20 text-center">
        <h2 className="text-3xl md:text-4xl font-light italic text-[#3a383a] mb-4">
          Reserva tu mesa
        </h2>
        <p className="max-w-lg mx-auto mb-8 text-[#3a383a] opacity-80">
          Para grupos, eventos especiales o reservaciones con anticipación,
          escríbenos por WhatsApp.
        </p>
        <a
          href="https://wa.me/524464109800?text=Hola%2C%20quiero%20reservar%20una%20mesa%20en%20Jamädi%20Orgánico"
          className="inline-block bg-[#3a383a] text-white px-8 py-3 uppercase text-xs tracking-widest hover:opacity-80 transition-opacity"
        >
          Reservar por WhatsApp
        </a>
      </section>
    </main>
  );
}

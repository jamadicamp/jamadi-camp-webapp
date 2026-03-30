import Image from "next/image";
import { Metadata } from "next";
import { PhotoSlot } from "@/app/components/photo-slot";
import { getPagePhotos } from "@/app/lib/page-photos";

export const revalidate = 0;

export const metadata: Metadata = {
  title: "Jamädi Orgánico",
  description:
    "Restaurante de cocina de campo con ingredientes orgánicos locales. Desayunos, comidas y cenas con los sabores auténticos de Amealco.",
};

const menuSalado = [
  {
    name: "Huevos de Nuestra Granja",
    desc: "Omelette, Rancheros, Motuleños, Estrellados, Revueltos o Divorciados",
  },
  { name: "Chilaquiles", desc: "Rojos ó verdes" },
  { name: "Enchiladas", desc: "Rojas, verdes o enmoladas" },
  { name: "Quesadillas", desc: "Queso ranchero" },
  { name: "Enfrijoladas", desc: "Con queso y crema" },
  { name: "Tamales", desc: "Verdes, rojos o dulces" },
];

const menuCrujiente = [
  { name: "Molletes", desc: "Queso & pico de gallo" },
  {
    name: "Avocado Toast",
    desc: "Pan de masa madre tostado a la leña, cubierto con aguacate de la región, aceite de oliva extra virgen, hojuelas de chile seco, semillas de girasol tostadas y huevo pochado de nuestra granja. Se sirve con brotes orgánicos frescos y sal de grano.",
  },
];

const menuDulce = [
  { name: "Pan Dulce", desc: "" },
  { name: "Fruta del Tiempo", desc: "" },
  { name: "Arroz con Leche", desc: "" },
];

const menuBebidas = [
  { name: "Café", desc: "De Olla o Americano" },
  { name: "Frappe", desc: "" },
  { name: "Licuados", desc: "" },
  { name: "Smoothies", desc: "" },
  { name: "Jugos", desc: "" },
  { name: "Aguas de sabor", desc: "" },
];

export default async function OrganicoPage() {
  const photos = await getPagePhotos("organico");
  return (
    <main>
      {/* Hero */}
      <section className="relative bg-[#3a383a] text-white py-20 px-4 md:px-20 overflow-hidden">
        {photos.hero && (
          <Image fill src={photos.hero} alt="Hero" className="object-cover opacity-40" />
        )}
        <div className="relative z-10">
          <p className="text-xs uppercase tracking-widest opacity-60 mb-4">Jamädi</p>
          <h1 className="text-5xl md:text-7xl font-light italic mb-6">Orgánico</h1>
          <p className="text-lg opacity-80 max-w-2xl leading-relaxed">
            Sabores del campo, corazón de la naturaleza. Una cocina honesta hecha con
            ingredientes orgánicos de la región, preparada con técnicas tradicionales.
          </p>
        </div>
      </section>

      {/* Feature Photo */}
      <section className="bg-white py-16 px-4 md:px-20">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <PhotoSlot url={photos.feature} alt="Foto principal" className="aspect-[4/3] w-full" />
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-light italic text-[#3a383a]">
              Técnica global, sabor local
            </h2>
            <p className="text-[#3a383a] opacity-70 leading-relaxed">
              Donde la experiencia internacional se encuentra con la esencia de la cocina
              de campo mexicana. Ingredientes orgánicos y tradicionales, preparados con
              técnica y cariño.
            </p>
          </div>
        </div>
      </section>

      {/* Chef Bio */}
      <section className="bg-[#3a383a] py-16 px-4 md:px-20">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
          <div className="space-y-5 text-white">
            <p className="text-xs uppercase tracking-widest opacity-50">El Chef</p>
            <h2 className="text-3xl md:text-4xl font-light italic">
              Santiago Zolliker
            </h2>
            <p className="opacity-75 leading-relaxed">
              10 años de experiencia internacional en Suiza, Suecia, Canadá y Australia,
              combinados con la esencia de la cocina de campo mexicana. El menú usa
              ingredientes orgánicos y tradicionales donde la técnica global se encuentra
              con el sabor local.
            </p>
          </div>
          <div className="border border-white/20 p-8 space-y-4 text-white">
            <p className="text-xs uppercase tracking-widest opacity-50 mb-2">Especial del Domingo</p>
            <h3 className="text-2xl font-light italic">Barbacoa de Borrego</h3>
            <p className="opacity-70 leading-relaxed text-sm">
              Un platillo que requiere tiempo, tradición y dedicación. Se prepara bajo pedido
              — contáctanos con anticipación para reservar tu lugar.
            </p>
            <a
              href="https://wa.me/524464109800?text=Hola%2C%20quiero%20ordenar%20Barbacoa%20de%20Borrego%20del%20domingo"
              className="inline-block border border-white/40 text-white px-5 py-2 text-xs uppercase tracking-widest hover:bg-white hover:text-[#3a383a] transition-colors"
            >
              Pedir con anticipación
            </a>
          </div>
        </div>
      </section>

      {/* About / Horarios */}
      <section className="bg-orange-50 py-16 px-4 md:px-20">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-light italic text-[#3a383a]">
              Del campo a tu mesa
            </h2>
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
          <div className="text-center mb-12">
            <p className="text-xs uppercase tracking-widest opacity-50 text-[#3a383a] mb-3">Finde</p>
            <h2 className="text-3xl font-light italic text-[#3a383a]">
              Desayunos y Brunch
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Salado */}
            <div>
              <h3 className="text-xs uppercase tracking-widest text-[#3a383a] opacity-50 mb-6 border-b border-[#3a383a]/15 pb-3">
                Salado
              </h3>
              <ul className="space-y-4">
                {menuSalado.map((item) => (
                  <li key={item.name}>
                    <p className="font-medium text-[#3a383a]">{item.name}</p>
                    {item.desc && (
                      <p className="text-sm text-[#3a383a] opacity-55 mt-0.5 leading-relaxed">{item.desc}</p>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {/* Crujiente */}
            <div>
              <h3 className="text-xs uppercase tracking-widest text-[#3a383a] opacity-50 mb-6 border-b border-[#3a383a]/15 pb-3">
                Crujiente
              </h3>
              <ul className="space-y-4">
                {menuCrujiente.map((item) => (
                  <li key={item.name}>
                    <p className="font-medium text-[#3a383a]">{item.name}</p>
                    {item.desc && (
                      <p className="text-sm text-[#3a383a] opacity-55 mt-0.5 leading-relaxed">{item.desc}</p>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {/* Dulce */}
            <div>
              <h3 className="text-xs uppercase tracking-widest text-[#3a383a] opacity-50 mb-6 border-b border-[#3a383a]/15 pb-3">
                Dulce
              </h3>
              <ul className="space-y-4">
                {menuDulce.map((item) => (
                  <li key={item.name}>
                    <p className="font-medium text-[#3a383a]">{item.name}</p>
                  </li>
                ))}
              </ul>
            </div>

            {/* Bebidas */}
            <div>
              <h3 className="text-xs uppercase tracking-widest text-[#3a383a] opacity-50 mb-6 border-b border-[#3a383a]/15 pb-3">
                Bebidas
              </h3>
              <ul className="space-y-4">
                {menuBebidas.map((item) => (
                  <li key={item.name}>
                    <p className="font-medium text-[#3a383a]">{item.name}</p>
                    {item.desc && (
                      <p className="text-sm text-[#3a383a] opacity-55 mt-0.5">{item.desc}</p>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <p className="text-xs text-center opacity-40 mt-12 italic">
            Menú de fin de semana — disponibilidad sujeta a ingredientes de temporada.
          </p>
        </div>
      </section>

      {/* Gallery */}
      <section className="bg-white py-16 px-4 md:px-20">
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4">
          <PhotoSlot url={photos.gallery_1} alt="Galería 1" className="aspect-[4/3] w-full" />
          <PhotoSlot url={photos.gallery_2} alt="Galería 2" className="aspect-[4/3] w-full" />
          <PhotoSlot url={photos.gallery_3} alt="Galería 3" className="aspect-[4/3] w-full" />
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

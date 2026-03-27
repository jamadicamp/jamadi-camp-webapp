import Image from "next/image";
import Link from "next/link";
import routes from "../lib/routes";
import { Metadata } from "next";
import { PhotoSlot } from "@/app/components/photo-slot";
import { getPagePhotos } from "@/app/lib/page-photos";

export const revalidate = 0;

export const metadata: Metadata = {
  title: "Jamädi Campamentos",
  description:
    "Tres destinos, una misma esencia natural. Elige entre Jamädi Camp, Jamädi Camping y Jamädi San José para vivir la experiencia perfecta en plena naturaleza.",
};

const locations = [
  {
    href: routes.camp.href,
    name: "Jamädi Camp",
    tagline: "Cabañas rústicas con todo el confort",
    description:
      "Nuestro destino insignia. Cabañas totalmente equipadas rodeadas de bosque, con fogatas privadas, vistas panorámicas y acceso a senderos de aventura. La experiencia Jamädi en su máxima expresión.",
    address: "Ave. Puerta de San Juan 3, La Manzana, Amealco",
    highlights: ["Cabañas privadas", "Fogatas", "WiFi", "Estacionamiento gratuito"],
  },
  {
    href: routes.camping.href,
    name: "Jamädi Camping",
    tagline: "Naturaleza en su forma más pura",
    description:
      "Para quienes quieren ir más allá. Duerme bajo las estrellas en nuestra área de campismo, a pasos del bosque. Vivir la naturaleza sin filtros, con la seguridad y atención de siempre.",
    address: "Ave. Puerta de San Juan 3, La Manzana, Amealco",
    highlights: ["Área de acampado", "Fogata comunitaria", "Sanitarios", "Zona natural"],
  },
  {
    href: routes.sanJose.href,
    name: "Jamädi San José",
    tagline: "Tranquilidad en el corazón del campo",
    description:
      "Ubicado en la comunidad de San José Itho, este destino ofrece una conexión más íntima con la vida de campo. Ideal para familias y quienes buscan paz y descanso auténtico.",
    address: "Emiliano Zapata 51, San José Itho, Amealco",
    highlights: ["Ambiente de rancho", "Granja", "Cocina de leña", "Senderos locales"],
  },
];

export default async function CampamentosPage() {
  const photos = await getPagePhotos("campamentos");
  return (
    <main>
      {/* Hero */}
      <section className="relative bg-[#3a383a] text-white py-20 px-4 md:px-20 overflow-hidden">
        {photos.hero && (
          <Image fill src={photos.hero} alt="Hero" className="object-cover opacity-40" />
        )}
        <div className="relative z-10">
          <p className="text-xs uppercase tracking-widest opacity-60 mb-4">Jamädi</p>
          <h1 className="text-5xl md:text-7xl font-light italic mb-6">Campamentos</h1>
          <p className="text-lg opacity-80 max-w-2xl leading-relaxed">
            Tres destinos, una misma esencia natural. Cada lugar tiene su propia personalidad,
            pero todos comparten el espíritu Jamädi: conexión, descanso y aventura.
          </p>
        </div>
      </section>

      {/* Feature Photo */}
      <section className="bg-white py-16 px-4 md:px-20">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <PhotoSlot url={photos.feature} alt="Foto principal" className="aspect-[4/3] w-full" />
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-light italic text-[#3a383a]">
              Tres destinos, una misma esencia
            </h2>
            <p className="text-[#3a383a] opacity-70 leading-relaxed">
              Cada campamento Jamädi tiene su propio carácter, pero todos comparten el mismo
              compromiso: brindarte una conexión auténtica con la naturaleza de Amealco, con
              la atención y el cuidado que nos distinguen.
            </p>
          </div>
        </div>
      </section>

      {/* Locations */}
      <section className="bg-orange-50 py-16 px-4 md:px-20">
        <div className="max-w-5xl mx-auto space-y-12">
          {locations.map((loc, i) => (
            <div
              key={loc.href}
              className={`flex flex-col ${
                i % 2 === 1 ? "md:flex-row-reverse" : "md:flex-row"
              } gap-8 items-start border-t border-[#3a383a]/20 pt-12`}
            >
              <div className="flex-1 space-y-4">
                <p className="text-xs uppercase tracking-widest opacity-50">
                  0{i + 1}
                </p>
                <h2 className="text-3xl md:text-4xl font-light italic text-[#3a383a]">
                  {loc.name}
                </h2>
                <p className="text-lg font-medium text-[#3a383a]">{loc.tagline}</p>
                <p className="text-[#3a383a] opacity-80 leading-relaxed">{loc.description}</p>
                <p className="text-sm opacity-60 italic">{loc.address}</p>
                <ul className="flex flex-wrap gap-2 pt-2">
                  {loc.highlights.map((h) => (
                    <li
                      key={h}
                      className="text-xs uppercase tracking-widest border border-[#3a383a]/40 px-3 py-1 text-[#3a383a]"
                    >
                      {h}
                    </li>
                  ))}
                </ul>
                <Link
                  href={loc.href}
                  className="inline-block mt-4 border border-[#3a383a] bg-orange-50 text-[#3a383a] px-6 py-2 uppercase text-xs tracking-widest hover:bg-[#3a383a] hover:text-white transition-colors"
                >
                  Conocer más
                </Link>
              </div>
            </div>
          ))}
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
      <section className="bg-white text-[#3a383a] py-16 px-4 md:px-20 text-center">
        <h2 className="text-3xl md:text-4xl font-light italic mb-4">
          ¿Listo para escapar?
        </h2>
        <p className="max-w-lg mx-auto mb-8 opacity-80">
          Reserva tu lugar en cualquiera de nuestros tres campamentos y empieza a
          vivir la experiencia Jamädi.
        </p>
        <Link
          href={routes.reservas.href}
          className="inline-block bg-orange-50 text-[#3a383a] px-8 py-3 border border-[#3a383a] uppercase text-xs tracking-widest hover:bg-[#3a383a] hover:text-white transition-colors"
        >
          Ver disponibilidad
        </Link>
      </section>
    </main>
  );
}

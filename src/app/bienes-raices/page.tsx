import Image from "next/image";
import { Metadata } from "next";
import { PhotoSlot } from "@/app/components/photo-slot";
import { getPagePhotos } from "@/app/lib/page-photos";

export const revalidate = 0;

export const metadata: Metadata = {
  title: "Jamädi Bienes Raíces",
  description:
    "Propiedades y terrenos en Amealco, Querétaro. Encuentra tu lugar en la naturaleza con la asesoría del equipo Jamädi.",
};

const tipos = [
  {
    icon: "🌄",
    name: "Terrenos",
    desc: "Lotes y terrenos de distintas superficies en zonas naturales de Amealco. Ideales para construir tu cabaña, retiro o proyecto de vida en el campo. Acceso a servicios básicos y vistas privilegiadas.",
  },
  {
    icon: "🏡",
    name: "Casas de campo",
    desc: "Propiedades ya construidas listas para habitar o rentar. Desde casas rurales tradicionales hasta construcciones modernas integradas al entorno natural.",
  },
  {
    icon: "🪵",
    name: "Cabañas",
    desc: "Cabañas de madera en zonas boscosas, ya equipadas. Perfectas como inversión para renta vacacional o como retiro personal a minutos de Amealco.",
  },
  {
    icon: "🌾",
    name: "Ranchos y predios",
    desc: "Propiedades de mayor superficie para proyectos agropecuarios, ecoturísticos o desarrollo sustentable. Asesoría completa incluida.",
  },
];

const ventajas = [
  "Conocimiento profundo de la región de Amealco",
  "Asesoría legal y notarial sin complicaciones",
  "Filtro previo de propiedades con acceso legal y sin conflictos",
  "Acompañamiento en visitas y negociación",
  "Red de constructores y arquitectos locales",
  "Financiamiento y opciones de pago flexible",
];

export default async function BienesRaicesPage() {
  const photos = await getPagePhotos("bienes-raices");
  return (
    <main>
      {/* Hero */}
      <section className="relative bg-[#3a383a] text-white py-20 px-4 md:px-20 overflow-hidden">
        {photos.hero && (
          <Image fill src={photos.hero} alt="Hero" className="object-cover opacity-40" />
        )}
        <div className="relative z-10">
          <p className="text-xs uppercase tracking-widest opacity-60 mb-4">Jamädi</p>
          <h1 className="text-5xl md:text-7xl font-light italic mb-6">Bienes Raíces</h1>
          <p className="text-lg opacity-80 max-w-2xl leading-relaxed">
            Encuentra tu lugar en la naturaleza. Si quedaste enamorado de Amealco,
            te ayudamos a hacer de este rincón tu hogar, tu inversión o tu refugio.
          </p>
        </div>
      </section>

      {/* Feature Photo */}
      <section className="bg-white py-16 px-4 md:px-20">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <PhotoSlot url={photos.feature} alt="Foto principal" className="aspect-[4/3] w-full" />
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-light italic text-[#3a383a]">
              Amealco, el mejor secreto de Querétaro
            </h2>
            <p className="text-[#3a383a] opacity-70 leading-relaxed">
              A solo 80 km de la ciudad de Querétaro, Amealco ofrece naturaleza
              auténtica, comunidades amigables y un costo de vida incomparable.
              En Jamädi llevamos años en esta tierra y conocemos cada rincón.
            </p>
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="bg-orange-50 py-16 px-4 md:px-20">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-light italic text-[#3a383a]">
              Amealco, el mejor secreto de Querétaro
            </h2>
            <p className="text-[#3a383a] opacity-80 leading-relaxed">
              A solo 80 km de la ciudad de Querétaro, Amealco ofrece naturaleza
              auténtica, comunidades amigables y un costo de vida incomparable.
              Es uno de los municipios con mayor crecimiento en demanda de propiedades
              de retiro y ecoturismo del estado.
            </p>
            <p className="text-[#3a383a] opacity-80 leading-relaxed">
              En Jamädi llevamos años en esta tierra. Conocemos cada camino,
              cada comunidad y cada terreno. Eso nos permite asesorarte de
              forma honesta y efectiva.
            </p>
          </div>
          <div className="space-y-4">
            <h3 className="text-sm uppercase tracking-widest text-[#3a383a] opacity-60 mb-4">
              Por qué Amealco
            </h3>
            {[
              { stat: "2,500+", label: "metros sobre el nivel del mar" },
              { stat: "80 km", label: "de la ciudad de Querétaro" },
              { stat: "12°C", label: "temperatura promedio anual" },
              { stat: "80+", label: "especies de aves registradas" },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-4 border-b border-[#3a383a]/15 pb-4"
              >
                <span className="text-2xl font-light text-[#3a383a] min-w-[80px]">
                  {item.stat}
                </span>
                <span className="text-sm text-[#3a383a] opacity-70">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tipos de propiedad */}
      <section className="bg-white py-16 px-4 md:px-20">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-light italic text-[#3a383a] mb-12 text-center">
            Tipos de propiedad
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {tipos.map((t) => (
              <div
                key={t.name}
                className="border border-[#3a383a]/10 p-8 space-y-4 hover:border-[#3a383a]/40 transition-colors"
              >
                <span className="text-3xl">{t.icon}</span>
                <h3 className="text-xl font-light italic text-[#3a383a]">{t.name}</h3>
                <p className="text-sm text-[#3a383a] opacity-70 leading-relaxed">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ventajas */}
      <section className="bg-orange-50 py-16 px-4 md:px-20">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
          <div className="space-y-6">
            <h2 className="text-2xl md:text-3xl font-light italic text-[#3a383a]">
              La ventaja de comprar con Jamädi
            </h2>
            <p className="text-[#3a383a] opacity-70 leading-relaxed">
              No somos una agencia inmobiliaria genérica. Somos parte de esta comunidad
              y conocemos el valor real de cada propiedad. Te asesoramos con honestidad,
              sin presiones y con toda la información que necesitas.
            </p>
          </div>
          <ul className="space-y-4">
            {ventajas.map((v) => (
              <li key={v} className="flex items-start gap-3 text-[#3a383a]">
                <span className="w-1 h-1 rounded-full bg-[#3a383a] opacity-50 mt-2 flex-shrink-0" />
                <span className="text-sm opacity-80 leading-relaxed">{v}</span>
              </li>
            ))}
          </ul>
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
          Encuentra tu propiedad
        </h2>
        <p className="max-w-lg mx-auto mb-8 text-[#3a383a] opacity-80">
          Cuéntanos qué buscas: superficie, ubicación, presupuesto y uso. Te
          enviamos opciones que realmente se ajusten a lo que necesitas.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="https://wa.me/524464109800?text=Hola%2C%20busco%20una%20propiedad%20en%20Amealco%20a%20través%20de%20Jamädi"
            className="inline-block bg-[#3a383a] text-white px-8 py-3 uppercase text-xs tracking-widest hover:opacity-80 transition-opacity"
          >
            Hablar con un asesor
          </a>
          <a
            href={`mailto:${process.env.NEXT_PUBLIC_TO_EMAIL}`}
            className="inline-block bg-white text-[#3a383a] px-8 py-3 border border-[#3a383a] uppercase text-xs tracking-widest hover:bg-[#3a383a] hover:text-white transition-colors"
          >
            Enviar correo
          </a>
        </div>
      </section>
    </main>
  );
}

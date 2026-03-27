import Image from "next/image";
import Link from "next/link";
import routes from "../lib/routes";
import { Metadata } from "next";
import { PhotoSlot } from "@/app/components/photo-slot";
import { getPagePhotos } from "@/app/lib/page-photos";

export const metadata: Metadata = {
  title: "Jamädi Experiencias",
  description:
    "Senderismo, pesca, ciclismo de montaña y visitas a la granja en Amealco. Vive Jamädi en movimiento con experiencias de aventura para todos los niveles.",
};

const actividades = [
  {
    icon: "🥾",
    name: "Senderismo",
    tagline: "Caminos que llevan a otro ritmo",
    desc: "Rutas de senderismo de distintos niveles de dificultad por los bosques y cerros de Amealco. Algunas terminan en miradores espectaculares; otras te llevan a arroyos y manantiales escondidos. Guías locales disponibles.",
    detalles: [
      { label: "Nivel", value: "Fácil / Moderado / Difícil" },
      { label: "Duración", value: "2 a 6 horas" },
      { label: "Distancia", value: "5 a 18 km" },
      { label: "Guía", value: "Opcional o incluido en paquetes" },
    ],
  },
  {
    icon: "🎣",
    name: "Pesca",
    tagline: "Paciencia y naturaleza en estado puro",
    desc: "Pesca deportiva en los arroyos y bordos de la región. Principalmente trucha y carpa. Puedes traer tu propio equipo o rentar el nuestro. La pesca con práctica de captura y liberación está especialmente alentada.",
    detalles: [
      { label: "Especie", value: "Trucha, carpa y otras" },
      { label: "Modalidad", value: "Captura & liberación / Consumo propio" },
      { label: "Equipo", value: "Propio o renta disponible" },
      { label: "Temporada", value: "Todo el año (mejor: oct–mar)" },
    ],
  },
  {
    icon: "🚵",
    name: "Ciclismo de Montaña",
    tagline: "Adrenalina entre pinos",
    desc: "Rutas de mountain bike diseñadas para distintos niveles. Desde caminos de terracería ideales para principiantes hasta descensos técnicos para ciclistas experimentados. Renta de bicicletas disponible en el lugar.",
    detalles: [
      { label: "Nivel", value: "Principiante a avanzado" },
      { label: "Bicicletas", value: "Renta disponible en Jamädi" },
      { label: "Rutas", value: "3 rutas diferentes" },
      { label: "Duración", value: "2 a 5 horas" },
    ],
  },
  {
    icon: "🌾",
    name: "Visita a la Granja",
    tagline: "Del campo a la mesa, todo en un día",
    desc: "Vive un día en la granja de Jamädi: ordeña, cosecha del huerto, alimentación de animales y preparación de alimentos con lo que recolectas. Una experiencia inmersiva que conecta a las personas con el origen de su comida.",
    detalles: [
      { label: "Duración", value: "Medio día o día completo" },
      { label: "Incluye", value: "Guía, alimentos y materiales" },
      { label: "Grupo", value: "Familiar o pequeño grupo" },
      { label: "Disponibilidad", value: "Miércoles a domingo" },
    ],
  },
];

export default async function ExperienciasPage() {
  const photos = await getPagePhotos("experiencias");
  return (
    <main>
      {/* Hero */}
      <section className="relative bg-[#3a383a] text-white py-20 px-4 md:px-20 overflow-hidden">
        {photos.hero && (
          <Image fill src={photos.hero} alt="Hero" className="object-cover opacity-40" />
        )}
        <div className="relative z-10">
          <p className="text-xs uppercase tracking-widest opacity-60 mb-4">Jamädi</p>
          <h1 className="text-5xl md:text-7xl font-light italic mb-6">Experiencias</h1>
          <p className="text-lg opacity-80 max-w-2xl leading-relaxed">
            Vive Jamädi en movimiento. Senderismo, pesca, ciclismo y granja:
            cuatro formas de conectar con el entorno que no encontrarás en ninguna
            pantalla.
          </p>
        </div>
      </section>

      {/* Feature Photo */}
      <section className="bg-white py-16 px-4 md:px-20">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <PhotoSlot url={photos.feature} alt="Foto principal" className="aspect-[4/3] w-full" />
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-light italic text-[#3a383a]">
              Aventura en cada rincón
            </h2>
            <p className="text-[#3a383a] opacity-70 leading-relaxed">
              Los bosques y cerros de Amealco son el escenario perfecto para vivir
              experiencias que te dejan sin aliento. Desde senderos tranquilos hasta
              descensos emocionantes, hay algo para cada tipo de viajero.
            </p>
          </div>
        </div>
      </section>

      {/* Actividades */}
      <section className="bg-orange-50 py-16 px-4 md:px-20">
        <div className="max-w-5xl mx-auto space-y-20">
          {actividades.map((act, i) => (
            <div
              key={act.name}
              className={`grid grid-cols-1 md:grid-cols-2 gap-12 items-start ${
                i > 0 ? "border-t border-[#3a383a]/15 pt-16" : ""
              }`}
            >
              <div className={`space-y-4 ${i % 2 === 1 ? "md:order-2" : ""}`}>
                <div className="flex items-center gap-4">
                  <span className="text-5xl">{act.icon}</span>
                  <div>
                    <p className="text-xs uppercase tracking-widest opacity-40">0{i + 1}</p>
                    <h2 className="text-3xl font-light italic text-[#3a383a]">{act.name}</h2>
                  </div>
                </div>
                <p className="text-[#3a383a] font-medium">{act.tagline}</p>
                <p className="text-[#3a383a] opacity-70 leading-relaxed">{act.desc}</p>
              </div>
              <div className={`space-y-0 ${i % 2 === 1 ? "md:order-1" : ""}`}>
                {act.detalles.map((d, j) => (
                  <div
                    key={d.label}
                    className={`flex justify-between py-3 ${
                      j < act.detalles.length - 1 ? "border-b border-[#3a383a]/15" : ""
                    }`}
                  >
                    <span className="text-sm text-[#3a383a] opacity-60">{d.label}</span>
                    <span className="text-sm text-[#3a383a] font-medium text-right">{d.value}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Combinaciones */}
      <section className="bg-white py-16 px-4 md:px-20">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-3xl font-light italic text-[#3a383a]">
            Combina experiencias
          </h2>
          <p className="text-[#3a383a] opacity-70 leading-relaxed">
            Las mejores estadías en Jamädi combinan varias experiencias. Un día de
            senderismo por la mañana, pesca al mediodía, cena en Jamädi Orgánico
            y fogata para cerrar: así se vive Amealco.
          </p>
          <p className="text-[#3a383a] opacity-70 leading-relaxed">
            Podemos armar un itinerario personalizado según tus días disponibles
            y lo que más te llame la atención.
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
      <section className="bg-orange-50 py-16 px-4 md:px-20 text-center">
        <h2 className="text-3xl md:text-4xl font-light italic text-[#3a383a] mb-4">
          Planea tu aventura
        </h2>
        <p className="max-w-lg mx-auto mb-8 text-[#3a383a] opacity-80">
          Cuéntanos qué te interesa y armamos el itinerario perfecto para ti
          o tu grupo.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href={routes.reservas.href}
            className="inline-block bg-orange-50 text-[#3a383a] px-8 py-3 border border-[#3a383a] uppercase text-xs tracking-widest hover:bg-[#3a383a] hover:text-white transition-colors"
          >
            Ver disponibilidad
          </Link>
          <a
            href="https://wa.me/524464109800?text=Hola%2C%20quiero%20planear%20una%20experiencia%20en%20Jamädi"
            className="inline-block bg-[#3a383a] text-white px-8 py-3 uppercase text-xs tracking-widest hover:opacity-80 transition-opacity"
          >
            Planear por WhatsApp
          </a>
        </div>
      </section>
    </main>
  );
}

import Image from "next/image";
import { Metadata } from "next";
import { PhotoSlot } from "@/app/components/photo-slot";
import { getPagePhotos } from "@/app/lib/page-photos";

export const revalidate = 0;

export const metadata: Metadata = {
  title: "Jamädi Natura",
  description:
    "Conéctate con la naturaleza en su estado más puro. Avistamiento de aves, observación de estrellas, meditación al aire libre y contacto con la granja en Amealco.",
};

const experiencias = [
  {
    icon: "🦜",
    name: "Avistamiento de Aves",
    desc: "El bosque de Amealco alberga más de 80 especies de aves. Con guía experto o por tu cuenta, los amaneceres en Jamädi son una sinfonía natural. Trae binoculares o renta los nuestros.",
    nivel: "Todos los niveles",
    duracion: "1 – 3 horas",
  },
  {
    icon: "✨",
    name: "Observación de Estrellas",
    desc: "Sin contaminación lumínica y a más de 2,500 metros de altitud, el cielo nocturno en Amealco es excepcional. Organizamos sesiones guiadas de astronomía con telescopio los fines de semana.",
    nivel: "Todos los niveles",
    duracion: "2 horas (noche)",
  },
  {
    icon: "🧘",
    name: "Meditación y Yoga",
    desc: "Clases de yoga al amanecer en la terraza con vista al bosque. También ofrecemos sesiones de meditación guiada entre los árboles. Una forma de empezar el día que cambia todo.",
    nivel: "Principiante a intermedio",
    duracion: "1 hora",
  },
  {
    icon: "🌿",
    name: "Caminatas Guiadas",
    desc: "Recorridos interpretativos por la flora y fauna local. Nuestros guías te enseñan a leer el bosque: identificar plantas medicinales, rastros de animales y la historia de la tierra que pisas.",
    nivel: "Todos los niveles",
    duracion: "2 – 4 horas",
  },
  {
    icon: "🐄",
    name: "Visita a la Granja",
    desc: "Conoce de cerca la vida del campo: ordeña, alimenta a los animales, recoge huevos. Una experiencia especialmente enriquecedora para quienes crecieron en la ciudad.",
    nivel: "Familiar",
    duracion: "1 – 2 horas",
  },
  {
    icon: "🌱",
    name: "Taller de Huerto",
    desc: "Aprende a sembrar, cuidar y cosechar en nuestro huerto orgánico. Regresa a casa con plantas o semillas y el conocimiento para cultivar las tuyas.",
    nivel: "Todos los niveles",
    duracion: "2 horas",
  },
];

export default async function NaturaPage() {
  const photos = await getPagePhotos("natura");
  return (
    <main>
      {/* Hero */}
      <section className="relative bg-[#3a383a] text-white py-20 px-4 md:px-20 overflow-hidden">
        {photos.hero && (
          <Image fill src={photos.hero} alt="Hero" className="object-cover opacity-40" />
        )}
        <div className="relative z-10">
          <p className="text-xs uppercase tracking-widest opacity-60 mb-4">Jamädi</p>
          <h1 className="text-5xl md:text-7xl font-light italic mb-6">Natura</h1>
          <p className="text-lg opacity-80 max-w-2xl leading-relaxed">
            La naturaleza no es el escenario, es la experiencia misma. En Jamädi Natura
            te invitamos a conectar, observar, respirar y descubrir el mundo natural
            que nos rodea.
          </p>
        </div>
      </section>

      {/* Feature Photo */}
      <section className="bg-white py-16 px-4 md:px-20">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <PhotoSlot url={photos.feature} alt="Foto principal" className="aspect-[4/3] w-full" />
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-light italic text-[#3a383a]">
              Más que un paseo, una reconexión
            </h2>
            <p className="text-[#3a383a] opacity-70 leading-relaxed">
              Amealco es uno de los municipios con mayor biodiversidad en Querétaro.
              Su bosque templado, sus arroyos y su cielo sin contaminación lo convierten
              en un laboratorio natural excepcional para redescubrir la relación entre
              el ser humano y su entorno.
            </p>
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="bg-orange-50 py-16 px-4 md:px-20">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-light italic text-[#3a383a]">
            Más que un paseo, una reconexión
          </h2>
          <p className="text-[#3a383a] opacity-80 leading-relaxed">
            Amealco es uno de los municipios con mayor biodiversidad en Querétaro.
            Su bosque templado, sus arroyos y su cielo sin contaminación lo convierten
            en un laboratorio natural excepcional para quienes quieren redescubrir
            la relación entre el ser humano y su entorno.
          </p>
        </div>
      </section>

      {/* Experiencias */}
      <section className="bg-white py-16 px-4 md:px-20">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-light italic text-[#3a383a] mb-12 text-center">
            Experiencias disponibles
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {experiencias.map((exp) => (
              <div key={exp.name} className="space-y-3 border-t border-[#3a383a]/15 pt-6">
                <span className="text-3xl">{exp.icon}</span>
                <h3 className="text-xl font-light italic text-[#3a383a]">{exp.name}</h3>
                <p className="text-sm text-[#3a383a] opacity-70 leading-relaxed">{exp.desc}</p>
                <div className="flex gap-4 pt-2">
                  <span className="text-xs uppercase tracking-widest border border-[#3a383a]/30 px-2 py-1 text-[#3a383a] opacity-70">
                    {exp.nivel}
                  </span>
                  <span className="text-xs uppercase tracking-widest border border-[#3a383a]/30 px-2 py-1 text-[#3a383a] opacity-70">
                    {exp.duracion}
                  </span>
                </div>
              </div>
            ))}
          </div>
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

      {/* Calendario */}
      <section className="bg-orange-50 py-16 px-4 md:px-20">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-2xl font-light italic text-[#3a383a]">
            Calendario de actividades
          </h2>
          <p className="text-[#3a383a] opacity-70 leading-relaxed">
            Muchas de nuestras actividades de natura se realizan según el calendario
            natural: migraciones de aves, floración del bosque, lluvias de meteoros.
            Síguenos para conocer las fechas especiales o escríbenos para planear
            tu visita en el mejor momento.
          </p>
          <a
            href="https://wa.me/524464109800?text=Hola%2C%20quiero%20información%20sobre%20actividades%20de%20Jamädi%20Natura"
            className="inline-block bg-[#3a383a] text-white px-8 py-3 uppercase text-xs tracking-widest hover:opacity-80 transition-opacity"
          >
            Consultar calendario
          </a>
        </div>
      </section>
    </main>
  );
}

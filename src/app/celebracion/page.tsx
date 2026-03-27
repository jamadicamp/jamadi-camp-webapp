import Image from "next/image";
import { Metadata } from "next";
import { PhotoSlot } from "@/app/components/photo-slot";
import { getPagePhotos } from "@/app/lib/page-photos";

export const revalidate = 0;

export const metadata: Metadata = {
  title: "Jamädi Celebración",
  description:
    "Celebra los momentos más importantes de tu vida en un entorno natural único. Bodas, cumpleaños, graduaciones, tablas de quesos y fondue en Jamädi.",
};

const servicios = [
  {
    icon: "💍",
    name: "Bodas",
    tagline: "El día más especial, en el lugar más especial",
    desc: "Celebra tu unión rodeado de naturaleza. Ofrecemos paquetes completos que incluyen decoración, coordinación, menú personalizado y alojamiento para novios e invitados. Bodas civiles, religiosas o simbólicas.",
    details: ["Ceremonia al aire libre", "Banquete personalizado", "Coordinación del evento", "Alojamiento para novios"],
  },
  {
    icon: "🎂",
    name: "Cumpleaños",
    tagline: "Festeja como se merece",
    desc: "Desde cumpleaños infantiles hasta celebraciones de años especiales. Personalizamos cada detalle para hacer que el festejado se sienta único. Espacio exclusivo, decoración y menú a tu medida.",
    details: ["Espacio privado", "Decoración temática", "Pastel artesanal", "Actividades opcionales"],
  },
  {
    icon: "🎓",
    name: "Graduaciones",
    tagline: "Un logro que merece un escenario memorable",
    desc: "Festeja el cierre de una etapa en un entorno diferente. Ya sea una graduación familiar íntima o una reunión de generación, en Jamädi encontramos el espacio y el ambiente perfectos.",
    details: ["Grupo mínimo 10 personas", "Menú de celebración", "Área de fotografía natural", "Música en vivo opcional"],
  },
  {
    icon: "🧀",
    name: "Tabla de Quesos",
    tagline: "El arte de compartir",
    desc: "Selección curada de quesos artesanales de Querétaro acompañados de mermeladas, frutos secos, miel de abeja y panes artesanales. Ideal como entrada, aperitivo o experiencia en sí misma.",
    details: ["Quesos locales y regionales", "Mermeladas artesanales", "Miel de abeja y nueces", "Pan horneado al momento"],
  },
  {
    icon: "🫕",
    name: "Fondue",
    tagline: "Calidez alrededor de la mesa",
    desc: "Una experiencia de convivencia única: fondue de queso suizo y mexicano servida junto a la fogata. También ofrecemos fondue de chocolate para el postre. Perfecta para grupos pequeños y medianos.",
    details: ["Fondue de queso artesanal", "Fondue de chocolate", "Pan, frutas y acompañantes", "Servicio junto a la fogata"],
  },
];

export default async function CelebracionPage() {
  const photos = await getPagePhotos("celebracion");
  return (
    <main>
      {/* Hero */}
      <section className="relative bg-[#3a383a] text-white py-20 px-4 md:px-20 overflow-hidden">
        {photos.hero && (
          <Image fill src={photos.hero} alt="Hero" className="object-cover opacity-40" />
        )}
        <div className="relative z-10">
          <p className="text-xs uppercase tracking-widest opacity-60 mb-4">Jamädi</p>
          <h1 className="text-5xl md:text-7xl font-light italic mb-6">Celebración</h1>
          <p className="text-lg opacity-80 max-w-2xl leading-relaxed">
            Los momentos más importantes de la vida merecen un escenario a la altura.
            En Jamädi, la naturaleza es el mejor telón de fondo para tus celebraciones.
          </p>
        </div>
      </section>

      {/* Intro */}
      <section className="bg-orange-50 py-16 px-4 md:px-20">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-light italic text-[#3a383a]">
            Cada celebración es única
          </h2>
          <p className="text-[#3a383a] opacity-80 leading-relaxed">
            Nos encargamos de que no tengas que preocuparte por nada. Desde la
            planeación hasta el último detalle, nuestro equipo trabaja contigo para
            crear la experiencia exacta que tienes en mente.
          </p>
        </div>
      </section>

      {/* Feature Photo */}
      <section className="bg-white py-16 px-4 md:px-20">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <PhotoSlot url={photos.feature} alt="Foto principal" className="aspect-[4/3] w-full" />
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-light italic text-[#3a383a]">
              El escenario perfecto para cada momento
            </h2>
            <p className="text-[#3a383a] opacity-70 leading-relaxed">
              La naturaleza de Amealco se convierte en el marco ideal para cualquier
              celebración. Bodas al aire libre, cumpleaños íntimos o grandes reuniones:
              en Jamädi cada evento es único y memorable.
            </p>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="bg-white py-16 px-4 md:px-20">
        <div className="max-w-5xl mx-auto space-y-16">
          {servicios.map((s, i) => (
            <div
              key={s.name}
              className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start border-t border-[#3a383a]/10 pt-12"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <span className="text-4xl">{s.icon}</span>
                  <div>
                    <p className="text-xs uppercase tracking-widest opacity-40">0{i + 1}</p>
                    <h3 className="text-2xl md:text-3xl font-light italic text-[#3a383a]">
                      {s.name}
                    </h3>
                  </div>
                </div>
                <p className="text-[#3a383a] font-medium">{s.tagline}</p>
                <p className="text-[#3a383a] opacity-70 leading-relaxed text-sm">{s.desc}</p>
              </div>
              <div className="space-y-3">
                <h4 className="text-xs uppercase tracking-widest text-[#3a383a] opacity-50">
                  Incluye
                </h4>
                <ul className="space-y-2">
                  {s.details.map((d) => (
                    <li key={d} className="flex items-center gap-3 text-[#3a383a]">
                      <span className="w-1 h-1 rounded-full bg-[#3a383a] opacity-40 flex-shrink-0" />
                      <span className="text-sm opacity-80">{d}</span>
                    </li>
                  ))}
                </ul>
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
      <section className="bg-orange-50 py-16 px-4 md:px-20 text-center">
        <h2 className="text-3xl md:text-4xl font-light italic text-[#3a383a] mb-4">
          Cotiza tu celebración
        </h2>
        <p className="max-w-lg mx-auto mb-8 text-[#3a383a] opacity-80">
          Cuéntanos sobre el evento que tienes en mente y te enviamos una propuesta
          personalizada sin costo.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="https://wa.me/524464109800?text=Hola%2C%20quiero%20cotizar%20una%20celebración%20en%20Jamädi"
            className="inline-block bg-[#3a383a] text-white px-8 py-3 uppercase text-xs tracking-widest hover:opacity-80 transition-opacity"
          >
            Cotizar por WhatsApp
          </a>
          <a
            href={`mailto:${process.env.NEXT_PUBLIC_TO_EMAIL}`}
            className="inline-block bg-orange-50 text-[#3a383a] px-8 py-3 border border-[#3a383a] uppercase text-xs tracking-widest hover:bg-[#3a383a] hover:text-white transition-colors"
          >
            Enviar correo
          </a>
        </div>
      </section>
    </main>
  );
}

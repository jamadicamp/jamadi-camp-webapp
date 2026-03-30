import Image from "next/image";
import Link from "next/link";
import routes from "../../lib/routes";
import { Metadata } from "next";
import { PhotoSlot } from "@/app/components/photo-slot";
import { getPagePhotos } from "@/app/lib/page-photos";
import { getPageContent } from "@/app/lib/page-content";

export const revalidate = 0;

export const metadata: Metadata = {
  title: "Jamädi Camping",
  description:
    "Duerme bajo las estrellas en el área de campismo de Jamädi. Naturaleza en su forma más pura, con la seguridad y atención que nos caracteriza.",
};

const includes = [
  { icon: "⛺", name: "Área de campismo", desc: "Espacios delimitados para instalar tu tienda de campaña" },
  { icon: "🔥", name: "Fogata comunitaria", desc: "Un punto de encuentro bajo el cielo abierto" },
  { icon: "🚿", name: "Sanitarios y regaderas", desc: "Instalaciones compartidas limpias y bien equipadas" },
  { icon: "🌲", name: "Entorno natural", desc: "Directamente integrado al bosque de Amealco" },
  { icon: "🌟", name: "Cielos sin contaminación", desc: "Ideal para observación de estrellas" },
  { icon: "🅿️", name: "Estacionamiento", desc: "Gratuito para todos los campistas" },
];

export default async function CampingPage() {
  const photos = await getPagePhotos("campamentos/camping");
  const content = await getPageContent("campamentos/camping");
  return (
    <main>
      {/* Hero */}
      <section className="relative bg-[#3a383a] text-white py-20 px-4 md:px-20 overflow-hidden">
        {photos.hero && (
          <Image fill src={photos.hero} alt="Hero" className="object-cover opacity-40" />
        )}
        <div className="relative z-10">
          <Link
            href={routes.campamentos.href}
            className="text-xs uppercase tracking-widest opacity-50 hover:opacity-80 transition-opacity mb-4 inline-block"
          >
            ← Jamädi Campamentos
          </Link>
          <h1 className="text-5xl md:text-7xl font-light italic mb-6">{content.title || "Jamädi Camping"}</h1>
          <p className="text-lg opacity-80 max-w-2xl leading-relaxed">
            {content.subtitle || "Para quienes quieren ir más allá. Duerme bajo las estrellas, respira aire puro y desconéctate del mundo con la naturaleza como única compañía."}
          </p>
          <p className="mt-4 text-sm opacity-50">
            Ave. Puerta de San Juan 3, La Manzana, Amealco, Querétaro
          </p>
        </div>
      </section>

      {/* Feature Photo */}
      <section className="bg-white py-16 px-4 md:px-20">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <PhotoSlot url={photos.feature} alt="Foto principal" className="aspect-[4/3] w-full" />
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-light italic text-[#3a383a]">
              Acampa en pleno bosque
            </h2>
            <p className="text-[#3a383a] opacity-70 leading-relaxed">
              Nuestra área de camping se ubica dentro de los terrenos de Jamädi, rodeada
              de vegetación nativa y con vistas al cerro. Es la forma más auténtica
              de vivir Jamädi: todo lo esencial, nada superfluo.
            </p>
          </div>
        </div>
      </section>

      {/* About */}
      <section className="bg-orange-50 py-16 px-4 md:px-20">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-light italic text-[#3a383a]">
              Acampa en pleno bosque
            </h2>
            <p className="text-[#3a383a] opacity-80 leading-relaxed">
              Nuestra área de camping se ubica dentro de los terrenos de Jamädi, rodeada
              de vegetación nativa y con vistas al cerro. Trae tu tienda de campaña o
              renta una en el lugar, y vive la experiencia de dormir al aire libre.
            </p>
            <p className="text-[#3a383a] opacity-80 leading-relaxed">
              El área cuenta con espacios marcados, fogata comunitaria, sanitarios y
              regaderas. Todo lo esencial, nada superfluo. Es la forma más auténtica
              de vivir Jamädi.
            </p>
          </div>
          <div className="space-y-4">
            <h3 className="text-sm uppercase tracking-widest text-[#3a383a] opacity-60">
              Lo que debes saber
            </h3>
            <div className="space-y-3 text-[#3a383a]">
              <div className="flex justify-between border-b border-[#3a383a]/20 pb-3">
                <span className="opacity-70">Llegada</span>
                <span className="font-medium">Desde las 2:00 pm</span>
              </div>
              <div className="flex justify-between border-b border-[#3a383a]/20 pb-3">
                <span className="opacity-70">Salida</span>
                <span className="font-medium">Hasta las 12:00 pm</span>
              </div>
              <div className="flex justify-between border-b border-[#3a383a]/20 pb-3">
                <span className="opacity-70">Tienda propia</span>
                <span className="font-medium">Bienvenida</span>
              </div>
              <div className="flex justify-between border-b border-[#3a383a]/20 pb-3">
                <span className="opacity-70">Renta de tienda</span>
                <span className="font-medium">Disponible</span>
              </div>
              <div className="flex justify-between border-b border-[#3a383a]/20 pb-3">
                <span className="opacity-70">Mascotas</span>
                <span className="font-medium">Consultar</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What's included */}
      <section className="bg-white py-16 px-4 md:px-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-light italic text-[#3a383a] mb-12 text-center">
            Qué incluye el área de camping
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {includes.map((item) => (
              <div key={item.name} className="space-y-2">
                <span className="text-2xl">{item.icon}</span>
                <h3 className="text-[#3a383a] font-medium">{item.name}</h3>
                <p className="text-[#3a383a] text-sm opacity-70">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tips */}
      <section className="bg-orange-50 py-16 px-4 md:px-20">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-light italic text-[#3a383a] mb-8">
            Consejos para tu visita
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-[#3a383a]">
            {[
              "Trae ropa abrigadora, especialmente para las noches",
              "Lleva calzado cómodo para caminar en terreno natural",
              "El clima en Amealco puede cambiar, prepárate para lluvia",
              "Trae repelente de insectos y protector solar",
              "Se permiten fogatas solo en las áreas designadas",
              "Respeta la fauna y flora local: deja todo como lo encontraste",
            ].map((tip) => (
              <div key={tip} className="flex gap-3 items-start">
                <span className="opacity-40 text-lg leading-tight">—</span>
                <p className="text-sm opacity-80 leading-relaxed">{tip}</p>
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

      {/* CTA */}
      <section className="bg-white py-16 px-4 md:px-20 text-center">
        <h2 className="text-3xl md:text-4xl font-light italic text-[#3a383a] mb-4">
          ¿Listo para acampar?
        </h2>
        <p className="max-w-lg mx-auto mb-8 text-[#3a383a] opacity-80">
          Contáctanos para reservar tu lugar en el área de camping y prepárate
          para una noche que no olvidarás.
        </p>
        <a
          href="https://wa.me/524464109800?text=Hola%2C%20quiero%20reservar%20en%20el%20área%20de%20camping%20de%20Jamädi"
          className="inline-block bg-[#3a383a] text-white px-8 py-3 uppercase text-xs tracking-widest hover:opacity-80 transition-opacity"
        >
          Reservar por WhatsApp
        </a>
      </section>
    </main>
  );
}

import Image from "next/image";
import Link from "next/link";
import routes from "../../lib/routes";
import { Metadata } from "next";
import { PhotoSlot } from "@/app/components/photo-slot";
import { getPagePhotos } from "@/app/lib/page-photos";

export const metadata: Metadata = {
  title: "Jamädi Camp",
  description:
    "Nuestro destino insignia. Cabañas rústicas totalmente equipadas en plena naturaleza, con fogatas, vistas panorámicas y senderos de aventura.",
};

const amenities = [
  { icon: "🔥", name: "Fogata privada", desc: "Cada cabaña cuenta con su propia área de fogata" },
  { icon: "🌿", name: "Vistas al bosque", desc: "Despierta rodeado de árboles y aire puro" },
  { icon: "📶", name: "WiFi", desc: "Conectividad cuando la necesitas" },
  { icon: "🚗", name: "Estacionamiento", desc: "Gratuito para todos los huéspedes" },
  { icon: "🌙", name: "Cielos estrellados", desc: "Sin contaminación lumínica" },
  { icon: "🥾", name: "Senderos", desc: "Acceso directo a rutas de senderismo" },
];

export default async function CampPage() {
  const photos = await getPagePhotos("campamentos/camp");
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
          <h1 className="text-5xl md:text-7xl font-light italic mb-6">Jamädi Camp</h1>
          <p className="text-lg opacity-80 max-w-2xl leading-relaxed">
            El corazón de Jamädi. Cabañas rústicas con todo el confort moderno, pensadas
            para quienes quieren descansar sin renunciar a la comodidad.
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
              Una experiencia única en la naturaleza
            </h2>
            <p className="text-[#3a383a] opacity-70 leading-relaxed">
              Jamädi Camp es nuestro destino principal, ubicado en La Manzana, Amealco.
              Cada cabaña está diseñada con materiales naturales, integrándose al entorno
              sin perturbarlo. Un lugar donde el tiempo se detiene y lo único que importa
              es el sonido del viento entre los árboles.
            </p>
          </div>
        </div>
      </section>

      {/* About */}
      <section className="bg-orange-50 py-16 px-4 md:px-20">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-light italic text-[#3a383a]">
                Una experiencia única en la naturaleza
              </h2>
              <p className="text-[#3a383a] opacity-80 leading-relaxed">
                Jamädi Camp es nuestro destino principal, ubicado en La Manzana, Amealco.
                Un lugar donde el tiempo se detiene y lo único que importa es el sonido
                del viento entre los árboles y el crepitar de la fogata.
              </p>
              <p className="text-[#3a383a] opacity-80 leading-relaxed">
                Cada cabaña está diseñada con materiales naturales, integrándose al entorno
                sin perturbarlo. Cuenta con todo lo necesario para una estadía cómoda:
                cama, ropa de cama, baño privado y cocina equipada.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-sm uppercase tracking-widest text-[#3a383a] opacity-60">
                Información de llegada
              </h3>
              <div className="space-y-3 text-[#3a383a]">
                <div className="flex justify-between border-b border-[#3a383a]/20 pb-3">
                  <span className="opacity-70">Check-in</span>
                  <span className="font-medium">3:00 pm</span>
                </div>
                <div className="flex justify-between border-b border-[#3a383a]/20 pb-3">
                  <span className="opacity-70">Check-out</span>
                  <span className="font-medium">11:00 am</span>
                </div>
                <div className="flex justify-between border-b border-[#3a383a]/20 pb-3">
                  <span className="opacity-70">Estacionamiento</span>
                  <span className="font-medium">Gratuito</span>
                </div>
                <div className="flex justify-between border-b border-[#3a383a]/20 pb-3">
                  <span className="opacity-70">Mascotas</span>
                  <span className="font-medium">Consultar</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Amenities */}
      <section className="bg-white py-16 px-4 md:px-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-light italic text-[#3a383a] mb-12 text-center">
            Todo lo que necesitas
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {amenities.map((a) => (
              <div key={a.name} className="space-y-2">
                <span className="text-2xl">{a.icon}</span>
                <h3 className="text-[#3a383a] font-medium">{a.name}</h3>
                <p className="text-[#3a383a] text-sm opacity-70">{a.desc}</p>
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
      <section className="bg-orange-50 py-16 px-4 md:px-20 text-center">
        <h2 className="text-3xl md:text-4xl font-light italic text-[#3a383a] mb-4">
          Reserva tu cabaña
        </h2>
        <p className="max-w-lg mx-auto mb-8 text-[#3a383a] opacity-80">
          Consulta disponibilidad y encuentra la cabaña perfecta para tu escapada.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href={routes.reservas.href}
            className="inline-block bg-orange-50 text-[#3a383a] px-8 py-3 border border-[#3a383a] uppercase text-xs tracking-widest hover:bg-[#3a383a] hover:text-white transition-colors"
          >
            Ver disponibilidad
          </Link>
          <a
            href="https://wa.me/524464109800?text=Hola%2C%20quiero%20reservar%20en%20Jamädi%20Camp"
            className="inline-block bg-[#3a383a] text-white px-8 py-3 uppercase text-xs tracking-widest hover:opacity-80 transition-opacity"
          >
            WhatsApp
          </a>
        </div>
      </section>
    </main>
  );
}

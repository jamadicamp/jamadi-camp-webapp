import Image from "next/image";
import Link from "next/link";
import routes from "../../lib/routes";
import { Metadata } from "next";
import { PhotoSlot } from "@/app/components/photo-slot";
import { getPagePhotos } from "@/app/lib/page-photos";

export const metadata: Metadata = {
  title: "Jamädi San José",
  description:
    "Descubre Jamädi San José en San José Itho, Amealco. Un rincón íntimo de campo con ambiente de rancho, cocina de leña y una conexión profunda con la vida rural.",
};

const features = [
  { icon: "🌾", name: "Ambiente de rancho", desc: "Vive la auténtica vida del campo en San José Itho" },
  { icon: "🐄", name: "Granja", desc: "Contacto directo con animales y actividades de granja" },
  { icon: "🪵", name: "Cocina de leña", desc: "Sabores tradicionales preparados a la manera antigua" },
  { icon: "🥾", name: "Senderos locales", desc: "Rutas de caminata por los alrededores de la comunidad" },
  { icon: "🌄", name: "Vistas del cerro", desc: "Panorámicas inigualables del paisaje queretano" },
  { icon: "🌙", name: "Cielos despejados", desc: "Noches tranquilas con cielos llenos de estrellas" },
];

export default async function SanJosePage() {
  const photos = await getPagePhotos("campamentos/san-jose");
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
          <h1 className="text-5xl md:text-7xl font-light italic mb-6">Jamädi San José</h1>
          <p className="text-lg opacity-80 max-w-2xl leading-relaxed">
            Un rincón íntimo en San José Itho. Aquí la naturaleza se mezcla con la
            cultura local, la cocina de leña y el ritmo tranquilo de la vida de campo.
          </p>
          <p className="mt-4 text-sm opacity-50">
            Emiliano Zapata 51, San José Itho, Amealco, Querétaro
          </p>
        </div>
      </section>

      {/* Feature Photo */}
      <section className="bg-white py-16 px-4 md:px-20">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <PhotoSlot url={photos.feature} alt="Foto principal" className="aspect-[4/3] w-full" />
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-light italic text-[#3a383a]">
              Tranquilidad en el corazón del campo
            </h2>
            <p className="text-[#3a383a] opacity-70 leading-relaxed">
              Jamädi San José está ubicado en la comunidad de San José Itho. Este destino
              ofrece una experiencia más íntima y auténtica, con el encanto de la vida
              rural queretana: granja, cocina de leña y senderos entre el campo.
            </p>
          </div>
        </div>
      </section>

      {/* About */}
      <section className="bg-orange-50 py-16 px-4 md:px-20">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-light italic text-[#3a383a]">
              Tranquilidad en el corazón del campo
            </h2>
            <p className="text-[#3a383a] opacity-80 leading-relaxed">
              Jamädi San José está ubicado en la comunidad de San José Itho, a pocos
              kilómetros de La Manzana. Este destino ofrece una experiencia más íntima
              y auténtica, con el encanto de la vida rural queretana.
            </p>
            <p className="text-[#3a383a] opacity-80 leading-relaxed">
              Desde aquí puedes explorar los alrededores a pie, convivir con los
              animales de la granja, probar la cocina preparada en fogón de leña
              y simplemente descansar mientras escuchas el silencio del campo.
            </p>
          </div>
          <div className="space-y-4">
            <h3 className="text-sm uppercase tracking-widest text-[#3a383a] opacity-60">
              Cómo llegar
            </h3>
            <div className="space-y-3 text-[#3a383a]">
              <p className="text-sm opacity-80 leading-relaxed">
                <strong>Dirección:</strong><br />
                Emiliano Zapata 51<br />
                San José Itho, Amealco<br />
                Querétaro, México
              </p>
              <p className="text-sm opacity-70 leading-relaxed mt-4">
                Desde Amealco de Bonfil toma la carretera hacia San José Itho.
                El acceso está señalizado. Para indicaciones precisas contáctanos
                por WhatsApp.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-white py-16 px-4 md:px-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-light italic text-[#3a383a] mb-12 text-center">
            La experiencia San José
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {features.map((f) => (
              <div key={f.name} className="space-y-2">
                <span className="text-2xl">{f.icon}</span>
                <h3 className="text-[#3a383a] font-medium">{f.name}</h3>
                <p className="text-[#3a383a] text-sm opacity-70">{f.desc}</p>
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
          Visita Jamädi San José
        </h2>
        <p className="max-w-lg mx-auto mb-8 text-[#3a383a] opacity-80">
          Contáctanos para conocer disponibilidad, precios y paquetes especiales
          en este destino único.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href={routes.reservas.href}
            className="inline-block bg-orange-50 text-[#3a383a] px-8 py-3 border border-[#3a383a] uppercase text-xs tracking-widest hover:bg-[#3a383a] hover:text-white transition-colors"
          >
            Ver disponibilidad
          </Link>
          <a
            href="https://wa.me/524464109800?text=Hola%2C%20quiero%20información%20sobre%20Jamädi%20San%20José"
            className="inline-block bg-[#3a383a] text-white px-8 py-3 uppercase text-xs tracking-widest hover:opacity-80 transition-opacity"
          >
            WhatsApp
          </a>
        </div>
      </section>
    </main>
  );
}

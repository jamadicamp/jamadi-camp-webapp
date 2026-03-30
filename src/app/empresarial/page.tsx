import Image from "next/image";
import { Metadata } from "next";
import { PhotoSlot } from "@/app/components/photo-slot";
import { getPagePhotos } from "@/app/lib/page-photos";
import { getPageContent } from "@/app/lib/page-content";

export const revalidate = 0;

export const metadata: Metadata = {
  title: "Jamädi Empresarial",
  description:
    "Fortalece tu equipo en la naturaleza. Team building, team camping y eventos empresariales diseñados para inspirar, conectar y motivar a tu organización.",
};

const paquetes = [
  {
    icon: "🤝",
    name: "Team Building",
    tagline: "Equipos más fuertes, resultados mejores",
    desc: "Actividades diseñadas para fortalecer la comunicación, la confianza y la colaboración entre los miembros de tu equipo. Desde retos de aventura hasta dinámicas de grupo al aire libre, nuestros programas sacan lo mejor de cada persona.",
    actividades: [
      "Retos de trabajo en equipo en la naturaleza",
      "Dinámicas de comunicación y confianza",
      "Taller de cocina grupal",
      "Circuitos de aventura y orientación",
      "Sesión de reflexión y cierre",
    ],
    ideal: "Grupos de 8 a 60 personas",
  },
  {
    icon: "⛺",
    name: "Team Camping",
    tagline: "Una noche en la naturaleza transforma equipos",
    desc: "La experiencia más intensa de team building: pasar la noche en el campo. Acampar juntos, preparar la cena alrededor del fuego, compartir el desayuno al amanecer. Situaciones que crean vínculos que ningún salón de juntas puede replicar.",
    actividades: [
      "Instalación de campamento en equipo",
      "Cena alrededor de la fogata",
      "Actividades nocturnas de cohesión",
      "Desayuno comunitario",
      "Caminata de cierre al amanecer",
    ],
    ideal: "Grupos de 8 a 40 personas, paquete 24h",
  },
  {
    icon: "🏢",
    name: "Eventos Empresariales",
    tagline: "Reuniones con un entorno diferente",
    desc: "Retiros estratégicos, presentaciones de resultados, lanzamientos internos, celebraciones de fin de año. Ofrecemos espacios naturales con la infraestructura necesaria para que tus eventos empresariales fluyan sin contratiempos.",
    actividades: [
      "Espacio privado con proyector y sonido",
      "Coffee breaks con productos orgánicos",
      "Comidas y cenas incluidas",
      "Actividades de esparcimiento opcionales",
      "Alojamiento para participantes de otras ciudades",
    ],
    ideal: "Grupos de 10 a 80 personas",
  },
];

export default async function EmpresarialPage() {
  const photos = await getPagePhotos("empresarial");
  const content = await getPageContent("empresarial");
  return (
    <main>
      {/* Hero */}
      <section className="relative bg-[#3a383a] text-white py-20 px-4 md:px-20 overflow-hidden">
        {photos.hero && (
          <Image fill src={photos.hero} alt="Hero" className="object-cover opacity-40" />
        )}
        <div className="relative z-10">
          <p className="text-xs uppercase tracking-widest opacity-60 mb-4">Jamädi</p>
          <h1 className="text-5xl md:text-7xl font-light italic mb-6">{content.title || "Empresarial"}</h1>
          <p className="text-lg opacity-80 max-w-2xl leading-relaxed">
            {content.subtitle || "Fortalece tu equipo en la naturaleza. Cuando cambias el entorno, cambias la conversación. Descubre lo que Jamädi puede hacer por tu organización."}
          </p>
        </div>
      </section>

      {/* Feature Photo */}
      <section className="bg-white py-16 px-4 md:px-20">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <PhotoSlot url={photos.feature} alt="Foto principal" className="aspect-[4/3] w-full" />
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-light italic text-[#3a383a]">
              La naturaleza como catalizador
            </h2>
            <p className="text-[#3a383a] opacity-70 leading-relaxed">
              Cambiar el entorno cambia la conversación. En Jamädi ofrecemos el espacio
              y la experiencia para que tu equipo se conecte, se inspire y regrese
              con energía renovada y vínculos más fuertes.
            </p>
          </div>
        </div>
      </section>

      {/* Por qué Jamädi */}
      <section className="bg-orange-50 py-16 px-4 md:px-20">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
          {[
            { icon: "🌿", title: "Desconexión real", desc: "Sin notificaciones, sin distracciones. La naturaleza favorece la concentración y la creatividad." },
            { icon: "🔗", title: "Vínculos auténticos", desc: "Las situaciones de campo crean conexiones genuinas que las reuniones de oficina no pueden generar." },
            { icon: "💡", title: "Ideas que fluyen", desc: "El contacto con la naturaleza está comprobado como catalizador de pensamiento creativo y solución de problemas." },
          ].map((item) => (
            <div key={item.title} className="space-y-3">
              <span className="text-3xl">{item.icon}</span>
              <h3 className="text-lg font-medium text-[#3a383a]">{item.title}</h3>
              <p className="text-sm text-[#3a383a] opacity-70 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Packages */}
      <section className="bg-white py-16 px-4 md:px-20">
        <div className="max-w-5xl mx-auto space-y-16">
          {paquetes.map((p, i) => (
            <div
              key={p.name}
              className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start border-t border-[#3a383a]/10 pt-12"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <span className="text-4xl">{p.icon}</span>
                  <div>
                    <p className="text-xs uppercase tracking-widest opacity-40">0{i + 1}</p>
                    <h3 className="text-2xl md:text-3xl font-light italic text-[#3a383a]">
                      {p.name}
                    </h3>
                  </div>
                </div>
                <p className="text-[#3a383a] font-medium">{p.tagline}</p>
                <p className="text-[#3a383a] opacity-70 leading-relaxed text-sm">{p.desc}</p>
                <p className="text-xs uppercase tracking-widest text-[#3a383a] opacity-50 pt-2">
                  {p.ideal}
                </p>
              </div>
              <div className="space-y-3">
                <h4 className="text-xs uppercase tracking-widest text-[#3a383a] opacity-50">
                  Actividades incluidas
                </h4>
                <ul className="space-y-2">
                  {p.actividades.map((a) => (
                    <li key={a} className="flex items-center gap-3 text-[#3a383a]">
                      <span className="w-1 h-1 rounded-full bg-[#3a383a] opacity-40 flex-shrink-0" />
                      <span className="text-sm opacity-80">{a}</span>
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
          Solicita una propuesta
        </h2>
        <p className="max-w-lg mx-auto mb-8 text-[#3a383a] opacity-80">
          Cuéntanos el tamaño de tu grupo, fechas y objetivos. Te enviamos una
          propuesta personalizada en menos de 24 horas.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="https://wa.me/524464109800?text=Hola%2C%20quiero%20información%20sobre%20paquetes%20empresariales%20en%20Jamädi"
            className="inline-block bg-[#3a383a] text-white px-8 py-3 uppercase text-xs tracking-widest hover:opacity-80 transition-opacity"
          >
            WhatsApp
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

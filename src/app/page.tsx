/* eslint-disable @next/next/no-img-element */
import { cache } from "react";
import { notFound } from "next/navigation";
import Search from "./components/search";
import RenderPropertiesList from "./components/render-properties-list";
import { getProperties } from "./lib/queries";
import ImageSlider from "./components/image-slider";
import ImageSlides from "./components/image-slides";
import { Metadata } from "next";
import routes from "./lib/routes";

// metadata

export const metadata: Metadata = {
	title: "Jamadi Camp",
	description: "Escapa de la ciudad y sumérgete en la naturaleza. Experimenta aire fresco, fogatas acogedoras y momentos inolvidables en nuestro refugio escénico.",
	robots: {
		index: true,
		follow: true,
	},
	metadataBase: new URL(routes.home.href, process.env.CLIENT_URL),
	alternates: {
		canonical: routes.home.href
	},
};

const getCacheProperty = cache(async () => {
	const properties = await getProperties();

	if (!properties) {
		return notFound();
	}

	return properties;
});

export default async function Home() {

	const properties = await getCacheProperty();

	const images = properties
	// For each property, map to an array of all property images
	.flatMap(property => property.images || []);
	
	return (
		<div className="font-[family-name:var(--font-geist-sans)]">
			{/* Hero Section */}
			<div className="relative w-full h-[620px]">
				<ImageSlider images={images} />
				{/* Overlay */}
				<div className="absolute inset-0 bg-orange-50 opacity-80" />
				{/* Hero Content */}
				<div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
					<h1 className="text-[#3a383a] text-xl font-bold md:text-4xl mb-4">
						Ven y disfruta de la tranquilidad de nuestras <br />
						<span className="italic font-normal">cabañas rústicas en Jamadi</span>.
					</h1>
					<p className="text-gray-800 max-w-xl mb-8">
						Escapa de la ciudad y sumérgete en la naturaleza. Experimenta aire
						fresco, fogatas acogedoras y momentos inolvidables en nuestro refugio escénico.
					</p>
					<a
						href="#highlights"
						className="inline-block bg-orange-50 text-[#3a383a] px-6 py-2 border border-[#3a383a] uppercase transition-colors"
					>
						Conoce Más
					</a>
				</div>
			</div>

			<div id="search">
				<Search properties={properties} />
			</div>
			{/* Highlight / Intro Section */}
			<section
				id="highlights"
				className="bg-white py-12 md:py-16 px-4 md:px-20 text-center"
			>
				<h2 className="text-3xl md:text-4xl font-bold mb-4">¿Por qué Jamadi?</h2>
				<p className="text-gray-600 max-w-3xl mx-auto mb-10">
					Nos esforzamos por hacer que tu estadía sea memorable con encanto rústico y
					comodidad moderna. Descubre nuestras características principales:
				</p>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
					{/* Highlight 1 */}
					<div className="flex flex-col items-center">
						<img
							src="/images/Campfire-cuate.png"
							alt="Icono de Fogata"
							className="h-64 w-64 mb-4"
						/>
						<h3 className="text-xl font-semibold mb-2">Fogatas Acogedoras</h3>
						<p className="text-gray-500">
							Reúnete alrededor de la fogata para historias, malvaviscos y
							noches llenas de estrellas.
						</p>
					</div>
					{/* Highlight 2 */}
					<div className="flex flex-col items-center">
						<img
							src="/images/Mountain biking-bro.png"
							alt="Icono de Montaña"
							className="h-64 w-64 mb-4"
						/>
						<h3 className="text-xl font-semibold mb-2">Vistas Impresionantes</h3>
						<p className="text-gray-500">
							Despierta con vistas panorámicas de montañas, perfectas para
							fotografía de naturaleza.
						</p>
					</div>
					{/* Highlight 3 */}
					<div className="flex flex-col items-center">
						<img
							src="/images/Hiking-bro.png"
							alt="Icono de Senderismo"
							className="h-64 w-64 mb-4"
						/>
						<h3 className="text-xl font-semibold mb-2">Senderos de Aventura</h3>
						<p className="text-gray-500">
							Embárcate en senderos de senderismo cercanos y disfruta de paisajes impresionantes.
						</p>
					</div>
				</div>
			</section>
			<div className="my-8">
				<ImageSlides images={images} />
			</div>

			{/* Cabins Section */}
			<section
				id="cabins"
				className="bg-orange-50 py-12 md:py-16 px-4 md:px-20 text-center"
			>
				<h3 className="text-3xl md:text-5xl font-medium italic mb-16">
					Nuestras Cabañas en Jamadi
				</h3>
				<RenderPropertiesList properties={properties} guests="1" />
			</section>

			{/* Call to Action / Booking Section */}
			<section className="relative bg-white text-[#3a383a] py-12 md:py-16 px-4 md:px-20 text-center">
				<h3 className="text-3xl md:text-4xl font-bold mb-4">
					¿Listo para Reservar tu Escape?
				</h3>
				<p className="text-[#3a383a] max-w-lg mx-auto mb-8">
					No te pierdas la oportunidad de recargar energías en nuestras cabañas tranquilas. Reserva
					tu lugar ahora y experimenta Jamadi en su mejor momento.
				</p>
				<a
					href="#search"
					className="inline-block bg-orange-50 text-black px-6 py-2 border border-[#3a383a] uppercase transition-colors"
				>
					Reservar Ahora
				</a>
			</section>
		</div>
	);
}

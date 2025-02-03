/* eslint-disable @next/next/no-img-element */
import { cache } from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Search from "./components/search";
import RenderPropertiesList from "./components/render-properties-list";
import { getProperties } from "./lib/queries";
import ImageSlider from "./components/image-slides";

const getCacheProperty = cache(async () => {
	const properties = await getProperties();

	if (!properties) {
		return notFound();
	}

	return properties;
});

export default async function Home() {
	const properties = await getCacheProperty();

	const images = properties.items
	// For each property, map to an array of all room images
	.flatMap(property => 
	  (property.rooms || []).flatMap(room => room.images || [])
	);

	console.log(properties?.items?.map(r => r.rooms[0]))

	return (
		<div className="font-[family-name:var(--font-geist-sans)]">
			{/* Hero Section */}
			<div className="relative w-full h-[620px]">
				<Image
					src="/images/cabin.webp"
					fill
					unoptimized
					priority
					alt="Cabin house wallpaper"
					className="object-cover"
				/>
				{/* Overlay */}
				<div className="absolute inset-0 bg-white opacity-80" />
				{/* Hero Content */}
				<div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
					<h1 className="text-[#3a383a] text-xl font-bold md:text-4xl mb-4">
						Come and enjoy the tranquility of our <br />
						<span className="italic font-normal">rustic cabins in Jamadi</span>.
					</h1>
					<p className="text-gray-800 max-w-xl mb-8">
						Escape the city and immerse yourself in nature. Experience fresh
						air, cozy fires, and unforgettable moments in our scenic hideaway.
					</p>
					<a
						href="#highlights"
						className="inline-block bg-orange-50 text-[#3a383a] px-6 py-2 border border-[#3a383a] uppercase transition-colors"
					>
						Learn More
					</a>
				</div>
			</div>

			<div id="search">
				<Search properties={properties.items} />
			</div>
			{/* Highlight / Intro Section */}
			<section
				id="highlights"
				className="bg-white py-12 md:py-16 px-4 md:px-20 text-center"
			>
				<h2 className="text-3xl md:text-4xl font-bold mb-4">Why Jamadi?</h2>
				<p className="text-gray-600 max-w-3xl mx-auto mb-10">
					We strive to make your stay memorable with rustic charm and modern
					comfort. Discover our top features:
				</p>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
					{/* Highlight 1 */}
					<div className="flex flex-col items-center">
						<img
							src="/images/icon-bonfire.png"
							alt="Bonfire Icon"
							className="h-16 w-16 mb-4"
						/>
						<h3 className="text-xl font-semibold mb-2">Cozy Bonfires</h3>
						<p className="text-gray-500">
							Gather around the fire pit for stories, marshmallows, and
							star-filled nights.
						</p>
					</div>
					{/* Highlight 2 */}
					<div className="flex flex-col items-center">
						<img
							src="/images/icon-mountain.png"
							alt="Mountain Icon"
							className="h-16 w-16 mb-4"
						/>
						<h3 className="text-xl font-semibold mb-2">Breathtaking Views</h3>
						<p className="text-gray-500">
							Wake up to panoramic mountain vistas, perfect for nature
							photography.
						</p>
					</div>
					{/* Highlight 3 */}
					<div className="flex flex-col items-center">
						<img
							src="/images/icon-hiking.png"
							alt="Hiking Icon"
							className="h-16 w-16 mb-4"
						/>
						<h3 className="text-xl font-semibold mb-2">Adventure Trails</h3>
						<p className="text-gray-500">
							Embark on nearby hiking trails and enjoy breathtaking landscapes.
						</p>
					</div>
				</div>
			</section>
			<div className="my-8">
				<ImageSlider images={images} />
			</div>

			{/* Cabins Section */}
			<section
				id="cabins"
				className="bg-orange-50 py-12 md:py-16 px-4 md:px-20 text-center"
			>
				<h3 className="text-3xl md:text-5xl font-medium italic mb-16">
					Our Cabins in Jamadi
				</h3>
				<RenderPropertiesList properties={properties.items} />
			</section>

			{/* Call to Action / Booking Section */}
			<section className="relative bg-white text-[#3a383a] py-12 md:py-16 px-4 md:px-20 text-center">
				<h3 className="text-3xl md:text-4xl font-bold mb-4">
					Ready to Book Your Getaway?
				</h3>
				<p className="text-[#3a383a] max-w-lg mx-auto mb-8">
					Don&apos;t miss the chance to recharge in our tranquil cabins. Reserve
					your spot now and experience Jamadi at its best.
				</p>
				<a
					href="#search"
					className="inline-block bg-orange-50 text-black px-6 py-2 border border-[#3a383a] uppercase transition-colors"
				>
					Book Now
				</a>
			</section>
		</div>
	);
}

import { cache } from "react";
import { callApi } from "@/app/lib/api";
import { notFound } from "next/navigation";
import { PropertiesV2Response } from "@/app/types";
import Image from "next/image";
import AvailabilityCalendar from "./components/availability-calendar";

const getCacheProperty = cache(async () => {
	const properties = await callApi(
		"GET",
		"/properties?includeCount=true&page=1&size=50",
		null,
		"v2"
	);

	if (!properties?.response || properties?.status !== 200) {
		return notFound();
	}
	// NOTE: this is where we put the typescript type. So that you get the suggestions.
	return properties?.response as PropertiesV2Response;
});

export default async function Home() {
	const properties = await getCacheProperty();

	return (
		<div className="font-[family-name:var(--font-geist-sans)]">
			{/* Hero Section */}
			<div className="relative w-full h-screen">
				<Image
					src="/images/cabin.webp"
					fill
					unoptimized
					priority
					alt="Cabin house wallpaper"
					className="object-cover"
				/>
				{/* Overlay */}
				<div className="absolute inset-0 bg-black opacity-50" />
				{/* Hero Content */}
				<div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
					<h1 className="text-white text-4xl md:text-6xl italic mb-4">
						Come and enjoy the tranquility of our <br />
						<span className="text-yellow-400">rustic cabins in Jamadi</span>.
					</h1>
					<p className="text-gray-200 max-w-xl mb-8">
						Escape the city and immerse yourself in nature. Experience fresh
						air, cozy fires, and unforgettable moments in our scenic hideaway.
					</p>
					<a
						href="#highlights"
						className="inline-block bg-yellow-400 text-black font-semibold px-6 py-3 rounded-md shadow-md hover:bg-yellow-300 transition-colors"
					>
						Learn More
					</a>
				</div>
			</div>


			<AvailabilityCalendar/>
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

			{/* Cabins Section */}
			<section
				id="cabins"
				className="bg-orange-50 py-12 md:py-16 px-4 md:px-20 text-center"
			>
				<h3 className="text-3xl md:text-5xl font-medium italic mb-8">
					Our Cabins in Jamadi
				</h3>
				<div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
					{properties.items.map((property) => (
						<div key={property.id} className="space-y-6">
							<div
								className="relative w-full"
								style={{ aspectRatio: "377/251" }}
							>
								<Image
									src={"https:" + property.image_url}
									alt={property.name}
									fill
									style={{ objectFit: "cover" }}
								/>
							</div>
							<h2 className="text-2xl md:text-3xl font-semibold">
								{property.name}
							</h2>
							<div className="flex justify-center gap-8 items-center">
								<h6 className="text-lg md:text-xl">
									Hosts: <span className="font-thin">6</span>
								</h6>
								<h6 className="text-lg md:text-xl">
									Bedrooms: <span className="font-thin">3 King-size</span>
								</h6>
							</div>
						</div>
					))}
				</div>
			</section>

			{/* Call to Action / Booking Section */}
			<section className="relative bg-black text-white py-12 md:py-16 px-4 md:px-20 text-center">
				<h3 className="text-3xl md:text-4xl font-bold mb-4">
					Ready to Book Your Getaway?
				</h3>
				<p className="text-gray-300 max-w-2xl mx-auto mb-8">
					Don&apos;t miss the chance to recharge in our tranquil cabins. Reserve
					your spot now and experience Jamadi at its best.
				</p>
				<button className="inline-block bg-yellow-400 text-black font-semibold px-6 py-3 rounded-md shadow-md hover:bg-yellow-300 transition-colors">
					Book Now
				</button>
			</section>
		</div>
	);
}

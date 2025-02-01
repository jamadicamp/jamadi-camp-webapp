/* eslint-disable @typescript-eslint/no-explicit-any */
import { cache } from "react";
import { notFound } from "next/navigation";
import { PageProps } from "../../../../.next/types/app/layout";
import { getProperty } from "@/app/lib/queries";
import Image from "next/image";

const getCacheProperty = cache(async (id: string) => {
	const property = await getProperty(id)
	if (!property) {
		return notFound();
	}
	return property
});

type Props = {
	params: { id: string };
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>
} & PageProps;

export default async function PropertyPage(props: Props) {
	const {
		params: { id },
		searchParams
	} = props;
	const property = await getCacheProperty(id);
	const params = await searchParams;

	console.log(params?.from, params?.to, params?.guests)

	return (
			<div className="font-sans bg-gray-50 min-h-screen">
			  {/* Hero section with main image and name */}
			  <section className="relative w-full h-72 overflow-hidden">
				{/* If you have a large hero image */}
				<Image
				  src={("https:" + property?.image_url) || "/placeholder.jpg"}
				  alt={property?.name || "Property Image"}
				  fill
				  className="object-cover"
				/>
				<div className="absolute inset-0 bg-black bg-opacity-30" />
				<div className="absolute bottom-4 left-4 text-white z-10">
				  <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">
					{property?.name}
				  </h1>
				  <p className="text-sm md:text-base">
					{property?.city}, {property?.state}, {property?.country}
				  </p>
				</div>
			  </section>
		
			  <div className="max-w-7xl mx-auto px-4 py-6">
				{/* Property details */}
				<section className="bg-white p-6 rounded-lg shadow mb-6">
				  <h2 className="text-xl font-semibold mb-4">Property Details</h2>
				  <p className="text-gray-600 mb-4">{property?.description}</p>
		
				  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
					{/* Address */}
					<div className="flex flex-col">
					  <span className="font-medium text-gray-700">Address:</span>
					  <span className="text-gray-600">
						{property?.hide_address
						  ? "Address Hidden"
						  : property?.address || "Not provided"}
					  </span>
					</div>
		
					{/* Rating */}
					<div className="flex flex-col">
					  <span className="font-medium text-gray-700">Rating:</span>
					  <span className="text-gray-600">
						{property?.rating ?? "N/A"}
					  </span>
					</div>
		
					{/* Price Range */}
					<div className="flex flex-col">
					  <span className="font-medium text-gray-700">
						Price Range (per {property?.price_unit_in_days ? "day" : "unit"}):
					  </span>
					  <span className="text-gray-600">
						{property?.min_price} – {property?.max_price}{" "}
						{property?.currency_code || ""}
					  </span>
					</div>
		
					{/* Subscription Plans */}
					<div className="flex flex-col">
					  <span className="font-medium text-gray-700">Subscriptions:</span>
					  <span className="text-gray-600">
						{property?.subscription_plans?.length
						  ? property.subscription_plans.join(", ")
						  : "No subscription plans"}
					  </span>
					</div>
				  </div>
				</section>
		
				{/* Rooms list */}
				<section className="bg-white p-6 rounded-lg shadow mb-6">
				  <h2 className="text-xl font-semibold mb-4">Rooms</h2>
				  {property?.rooms?.length > 0 ? (
					<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
					  {property.rooms.map((room: any) => (
						<div
						  key={room.id}
						  className="border rounded-lg overflow-hidden bg-white shadow-sm"
						>
						  {/* Room image */}
						  {room.image_url ? (
							<img
							  src={"https:" + room.image_url}
							  alt={room.name}
							  className="h-48 w-full object-cover"
							/>
						  ) : (
							<div className="h-48 w-full bg-gray-200 flex items-center justify-center text-gray-400">
							  No image
							</div>
						  )}
		
						  {/* Room details */}
						  <div className="p-4">
							<h3 className="text-lg font-semibold">{room.name}</h3>
							<p className="text-sm text-gray-500 mb-2">
							  {room.description}
							</p>
							<div className="flex flex-col space-y-1 text-sm text-gray-600">
							  <span>
								<strong>Max People:</strong> {room.max_people}
							  </span>
							  <span>
								<strong>Bedrooms:</strong> {room.bedrooms}
							  </span>
							  <span>
								<strong>Bathrooms:</strong> {room.bathrooms}
							  </span>
							  <span>
								<strong>Area:</strong> {room.area}
								{room.area_unit ? ` ${room.area_unit}` : ""}
							  </span>
							</div>
							<div className="mt-4 text-gray-800 font-medium">
							  From {room.min_price} {room?.currency?.symbol || ""}
							</div>
		
							{/* Amenities */}
							{room.amenities && (
							  <div className="mt-4">
								<h4 className="font-semibold text-sm mb-2">
								  Amenities
								</h4>
								{Object.entries(room.amenities).map(([key, value]) => (
								  <div key={key} className="text-sm text-gray-600">
									<strong>{key}: </strong>
									{Array.isArray(value)
									  ? value.map(
										  (amenity: { name: string }, idx: number) => (
											<span key={idx}>
											  {amenity.name}
											  {idx < value.length - 1 ? ", " : ""}
											</span>
										  )
										)
									  : null}
								  </div>
								))}
							  </div>
							)}
						  </div>
						</div>
					  ))}
					</div>
				  ) : (
					<p className="text-gray-500">No rooms available.</p>
				  )}
				</section>
		
				{/* Availability / In-Out Dates */}
				<section className="bg-white p-6 rounded-lg shadow mb-6">
				  <h2 className="text-xl font-semibold mb-4">Availability</h2>
				  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div className="flex flex-col">
					  <span className="font-medium text-gray-700">
						Restricted Booking:
					  </span>
					  <span className="text-gray-600">
						{property?.in_out?.is_restricted ? "Yes" : "No"}
					  </span>
					</div>
					<div className="flex flex-col">
					  <span className="font-medium text-gray-700">
						Not Available On:
					  </span>
					  <span className="text-gray-600">
						{property?.in_out?.not_available?.length
						  ? property.in_out.not_available.map(
							  (entry: any) =>
								new Date(entry.date).toLocaleDateString()
							).join(", ")
						  : "Always available"}
					  </span>
					</div>
				  </div>
		
				  {/* Check-in and Check-out possible dates */}
				  <div className="mt-4 flex flex-col space-y-2">
					<div>
					  <strong className="text-gray-700">Check In:</strong>{" "}
					  {property?.in_out?.check_in?.length
						? property.in_out.check_in.map((entry: any) =>
							new Date(entry.date).toLocaleDateString()
						  ).join(", ")
						: "No specific dates"}
					</div>
					<div>
					  <strong className="text-gray-700">Check Out:</strong>{" "}
					  {property?.in_out?.check_out?.length
						? property.in_out.check_out.map((entry: any) =>
							new Date(entry.date).toLocaleDateString()
						  ).join(", ")
						: "No specific dates"}
					</div>
				  </div>
				</section>
		
				{/* Agreement Section (if needed) */}
				{property.has_agreement && (
				  <section className="bg-white p-6 rounded-lg shadow">
					<h2 className="text-xl font-semibold mb-4">Agreement</h2>
					{property.agreement_text ? (
					  <p className="text-gray-600 mb-2">{property.agreement_text}</p>
					) : null}
					{property.agreement_url ? (
					  <a
						href={property.agreement_url}
						target="_blank"
						rel="noopener noreferrer"
						className="text-blue-600 underline"
					  >
						View Agreement
					  </a>
					) : null}
				  </section>
				)}
			  </div>
			</div>
	);
}

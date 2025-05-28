import Image from "next/image";
import { Property } from "../types/models";
import routes from "../lib/routes";
import Link from "next/link";
import { DateRange } from "react-day-picker";

export default function RenderPropertiesList({
	properties,
	date,
	guests = "1",
}: {
	properties: Property[];
	date?: DateRange;
	guests?: string;
}) {
	return (
		<div className="container mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12 md:gap-16">
			{properties.map((property) => (
				<Link
					href={routes.cabin.href(
						property._id || property.id,
						date?.from?.toISOString(),
						date?.to?.toISOString(),
						guests
					)}
					key={property._id || property.id}
					className="space-y-6"
				>
					<div className="relative w-full" style={{ aspectRatio: "377/251" }}>
						<Image
							src={property.images?.[0]?.url || property.image_url || "/placeholder.jpg"}
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
							Hosts:{" "}
							<span className="font-thin">
								{property.max_people || "N/A"}
							</span>
						</h6>
						<h6 className="text-lg md:text-xl">
							Bedrooms:{" "}
							<span className="font-thin">
								{property.bedrooms || "N/A"}
							</span>
						</h6>
						<h6 className="text-lg md:text-xl">
							FROM:{" "}
							<span className="font-thin">
								{property.currencies[0].symbol}{property.currencies[0].euro_forex || "N/A"} / night
							</span>
						</h6>
					</div>
				</Link>
			))}
		</div>
	);
}

import Image from "next/image";
import { Property } from "../types";
import routes from "../lib/routes";
import Link from "next/link";
import { DateRange } from "react-day-picker";

export default function RenderPropertiesList({
  properties,
  date
}: {
  properties: Property[];
  date?: DateRange
}) {

  return (
    <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
      {properties.map((property) => (
        <Link href={routes.cabin.path} as={routes.cabin.href(property.id, date?.from?.toISOString(), date?.to?.toISOString())} key={property.id} className="space-y-6">
          <div className="relative w-full" style={{ aspectRatio: "377/251" }}>
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
              Hosts: <span className="font-thin">{property.rooms[0]?.max_people || "N/A"}</span>
            </h6>
            <h6 className="text-lg md:text-xl">
              Bedrooms: <span className="font-thin">{property.rooms[0]?.bedrooms || "N/A"}</span>
            </h6>
            <h6 className="text-lg md:text-xl">
              FROM: <span className="font-thin">${property.original_min_price || "N/A"} / night</span>
            </h6>
          </div>
        </Link>
      ))}
    </div>
  );
}

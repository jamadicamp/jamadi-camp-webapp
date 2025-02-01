import Image from "next/image";
import { Property } from "../types";

export default function RenderPropertiesList({
  properties,
}: {
  properties: Property[];
}) {
  return (
    <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
      {properties.map((property) => (
        <div key={property.id} className="space-y-6">
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
              Hosts: <span className="font-thin">6</span>
            </h6>
            <h6 className="text-lg md:text-xl">
              Bedrooms: <span className="font-thin">3 King-size</span>
            </h6>
          </div>
        </div>
      ))}
    </div>
  );
}

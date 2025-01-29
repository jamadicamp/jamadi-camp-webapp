import { cache } from "react";
import { callApi } from "@/app/lib/api";
import { notFound } from "next/navigation";
import { PropertiesV2Response } from "@/app/types";
import Image from "next/image";

const getCacheProperty = cache(async () => {
  const properties = await callApi(
    "GET",
    "/properties?includeCount=true&&page=1&size=50",
    null,
    "v2"
  );

  if (!properties?.response || properties?.status !== 200) {
    return notFound();
  }
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
        {/* Hero Text */}
        <div className="absolute inset-0 flex items-center justify-center px-4 text-center">
          <h1 className="text-white text-3xl md:text-6xl italic">
            Come and enjoy the tranquility of
            our <br />
            <span className="text-yellow-500">rustic cabins in Jamadi</span>.
          </h1>
        </div>
      </div>

      {/* Section Title */}
      <h3 className="bg-orange-50 py-8 md:py-16 text-3xl md:text-5xl font-medium italic text-center">
        Our cabins in Jamadi
      </h3>

      {/* Properties Grid */}
      <div className="container mx-auto px-4 md:px-20 py-8 md:py-12 mt-8 md:mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 gap-y-12 md:gap-y-16">
        {properties.items.map((property) => (
          <div key={property.id} className="space-y-6">
            <div
              className="relative w-full"
              style={{ aspectRatio: "377/251" }} // Ensures consistent height-to-width
            >
              <Image
                src={"https:" + property.image_url}
                alt={property.name}
                fill
                style={{ objectFit: "cover" }}
              />
            </div>
            <h2 className="text-2xl md:text-4xl font-semibold">{property.name}</h2>
            <div className="flex flex-row gap-8 items-center">
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
    </div>
  );
}

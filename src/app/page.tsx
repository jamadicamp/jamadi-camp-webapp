import { cache } from "react";
import { callApi } from "@/app/lib/api";
import { notFound } from "next/navigation";
import { PropertiesV2Response } from "@/app/types";

const getCacheProperty = cache(async () => {
  const properties = await callApi("GET", "/properties?includeCount=true&includeInOut=true&page=1&size=50", null, "v2");

  if (!properties?.response || properties?.status !== 200) {
    return notFound()
  }
  return properties?.response as PropertiesV2Response;
})

export default async function Home() {
  const properties = await getCacheProperty();
  
  return (
    <div className="font-[family-name:var(--font-geist-sans)]">
      {properties.items.map(property => (
        <div key={property.id}>{property.name}</div>
      ))}
    </div>
  );
}

/* eslint-disable @typescript-eslint/no-explicit-any */
import { cache } from "react";
import { notFound } from "next/navigation";
import { getProperty } from "@/app/lib/queries";
import Image from "next/image";
import { PageProps } from "../../../../.next/types/app/cabins/[id]/page";
import { cn } from "@/lib/utils";
import { Metadata } from "next";
import routes from "@/app/lib/routes";
import { BookingModal } from "@/components/BookingModal";

const getCacheProperty = cache(async (id: string) => {
  const property = await getProperty(id);
  if (!property) {
    return notFound();
  }
  return property;
});

export async function generateMetadata(props: Props): Promise<Metadata> {
	const {id} = await props.params;
	const property = await getProperty(id);
	if (!property) {
	  return notFound();
	}


	const pathname = routes.cabin.href(id)

  
	return {
		title: property.name,
		description: property.description,
		openGraph: {
			images: property.images?.[0]?.url || property.image_url,
			siteName: "Jamadi Camp"
		},
		metadataBase: new URL(pathname, process.env.CLIENT_URL),
		alternates: {
			canonical: pathname
		},
		robots: {
			index: true,
			follow: true,
		},
	}
  }
  

type Props = {
  params: { id: string };
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
} & PageProps;

export default async function PropertyPage(props: Props) {

  const {id} = (await props.params)
  const property = await getCacheProperty(id);
  const params = await props.searchParams

  console.log(params?.from, params?.to, params?.guests);

  const amenities = property.amenities?.additionalProp || [];

  // Parse URL parameters for initial booking data
  const initialCheckIn = params?.from ? new Date(params.from as string) : undefined;
  const initialCheckOut = params?.to ? new Date(params.to as string) : undefined;
  const initialGuests = params?.guests ? parseInt(params.guests as string) : 1;

  return (
    <div className="bg-orange-50 pt-8 font-[family-name:var(--font-geist-sans)] space-y-32 pb-20">
      <section className="flex flex-col lg:flex-row max-w-[960px] gap-16 mx-auto px-8 lg:px-0">
        <div className="flex-1">
          <div className="relative w-full aspect-square">
            <Image
              src={property.images?.[0]?.url || property.image_url || "/placeholder.jpg"}
              alt={property?.name || "Property Image"}
              fill
              className="object-cover"
            />
          </div>
        </div>
        <div className="flex-1 mt-12">
          <p className="uppercase">home</p>
          <h1 className="text-4xl font-bold my-1">{property?.name}</h1>
          <p className="text-lg font-extralight">
            FROM {property.currencies[0].symbol}{property.currencies[0].euro_forex || "N/A"} / night
          </p>
          <hr className="w-24 bg-black border-black mt-8 mb-2" />
          <p className="text-lg font-semibold">
            1 to {property.max_people || 2} guests (
            {`${property.bedrooms || 1} bedroom and ${
                property.bathrooms || 1
              } bathroom`}
            )
          </p>
          <p className="text-lg font-light">
            Check in - 3.00pm | Check out - 11.00am
          </p>
          <ul className="p-4 pl-8 grid grid-cols-2 gap-y-2">
            {amenities?.map((item: any, index: number) => (
              <li key={index} className={cn("list-disc")}>
                {item.text || item.name}
              </li>
            ))}
            
            {amenities.length > 0 && (
              <li className="col-span-2 border-t border-gray-300 mt-2 pt-2"></li>
            )}

            <li
              className={cn("list-disc", {
                "line-through": !property.has_wifi,
              })}
            >
              WiFi Available
            </li>
            <li
              className={cn("list-disc", {
                "line-through": !property.pets_allowed,
              })}
            >
              Pet friendly
            </li>
            <li
              className={cn("list-disc", {
                "line-through": !property.adults_only,
              })}
            >
              Adults only
            </li>
            <li
              className={cn("list-disc", {
                "line-through": !property.has_parking,
              })}
            >
              Parking Available
            </li>
            <li
              className={cn("list-disc", {
                "line-through": !property.breakfast_included,
              })}
            >
              Breakfast Included
            </li>
          </ul>
          <BookingModal
            property={{
              id: property.id || id,
              name: property.name,
              image_url: property.image_url,
              images: property.images,
              currencies: property.currencies,
              max_people: property.max_people || 2,
              bedrooms: property.bedrooms || 1,
              bathrooms: property.bathrooms || 1
            }}
            initialCheckIn={initialCheckIn}
            initialCheckOut={initialCheckOut}
            initialGuests={initialGuests}
          />
        </div>
      </section>
      
      {/* Description Section */}
      {property.description && (
        <section className="max-w-[960px] mx-auto px-8 lg:px-0">
          <div className="rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-2 text-center">About this place</h2>
            <p className="text-gray-700 leading-relaxed text-lg text-center">
              {property.description}
            </p>
          </div>
        </section>
      )}
      
	  <section className="max-w-[960px] mx-auto px-8 lg:px-0 mt-12 mb-20">
		<h3 className="text-center text-3xl font-bold mb-2">Gallery</h3>
		<p className="text-center max-w-[600px] mx-auto mb-6">Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum magni autem nisi ut corporis deleniti, odit ipsum, soluta sapiente fugiat vero? Earum vitae libero nostrum incidunt cum quia vel quas!</p>
		<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-12">
			{property.images?.map((image, index) => (
				<div key={index} className="relative aspect-[2/3] w-full">
				<Image 
					src={image?.url || "/placeholder.jpg"}
					alt={property?.name || "Property Image"}
					fill
					className="object-cover"
				/>
			  </div>
			))}
		</div>

	  </section>

	  {/* Location Section */}
	  <section className="max-w-[960px] mx-auto px-8 lg:px-0 mt-12 mb-20">
		<h3 className="text-center text-3xl font-bold mb-2">Location</h3>
		<p className="text-center max-w-[600px] mx-auto mb-6">
		  {property.address}, {property.city}, {property.state} {property.zip}
		</p>
		<div className="w-full h-96 rounded-lg overflow-hidden shadow-lg">
		  <iframe
			src={`https://maps.google.com/maps?q=${property.latitude},${property.longitude}&z=15&output=embed`}
			width="100%"
			height="100%"
			style={{ border: 0 }}
			allowFullScreen={true}
			loading="lazy"
			referrerPolicy="no-referrer-when-downgrade"
			title={`Location of ${property.name}`}
		  />
		</div>
	  </section>
      
    </div>
  );
}

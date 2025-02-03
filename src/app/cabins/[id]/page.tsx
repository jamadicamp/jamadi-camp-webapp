/* eslint-disable @typescript-eslint/no-explicit-any */
import { cache } from "react";
import { notFound } from "next/navigation";
import { getProperty } from "@/app/lib/queries";
import Image from "next/image";
import { PageProps } from "../../../../.next/types/app/cabins/[id]/page";
import { cn } from "@/lib/utils";
import { Metadata } from "next";
import routes from "@/app/lib/routes";

const getCacheProperty = cache(async (id: number) => {
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
			images: "https:" + property.image_url,
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
  params: { id: number };
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
} & PageProps;

// @ts-exoect-error PropertyPage is not a React component
export default async function PropertyPage(props: Props) {

  const {id} = (await props.params)
  const property = await getCacheProperty(id);
  const params = await props.searchParams

  console.log(params?.from, params?.to, params?.guests);

  const room = property.rooms[0];
  const amenities = room.amenities as any as Record<
    string,
    Array<{ text: string; name: string }>
  >;

  return (
    <div className="bg-orange-50 pt-8 font-[family-name:var(--font-geist-sans)] space-y-32 pb-20">
      <section className="flex flex-col lg:flex-row max-w-[960px] gap-16 mx-auto px-8 lg:px-0">
        <div className="flex-1">
          <div className="relative w-full aspect-square">
            <Image
              src={"https:" + property?.image_url || "/placeholder.jpg"}
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
            FROM ${property?.original_max_price?.toLocaleString()} / night
          </p>
          <hr className="w-24 bg-black border-black mt-8 mb-2" />
          <p className="text-lg font-semibold">
            1 to {room.max_people || 2} guests (
            {amenities?.sleeping?.[0]?.text ||
              `${room.bedrooms || 1} bedroom and ${
                room.bathrooms || 1
              } bathroom`}
            )
          </p>
          <p className="text-lg font-light">
            Check in - 3.00pm | Check out - 11.00am
          </p>
          <ul className="p-4 pl-8 grid grid-cols-2 gap-y-2">
            <li
              className={cn("list-disc", {
                "line-through": !amenities?.room?.find(
                  (e) => e.name === "RoomsKitchen"
                ),
              })}
            >
              Kitchen Available
            </li>

            {[
              ...amenities?.parking,
              ...amenities?.cooking,
              ...amenities?.entertainment,
              ...amenities?.outside,
            ]?.map((item: any) => (
              <li key={item.text} className={cn("list-disc")}>
                {item.text}
              </li>
            ))}

            <li
              className={cn("list-disc", {
                "line-through": !room.pets_allowed,
              })}
            >
              Pet friendly
            </li>
            <li
              className={cn("list-disc", {
                "line-through": !room.adults_only,
              })}
            >
              Adults only
            </li>
          </ul>
          <a
            href="#search"
            className="inline-block bg-orange-50 text-black px-6 py-2 mt-8 border border-[#3a383a] uppercase transition-colors"
          >
            Book Now
          </a>
        </div>
      </section>
	  <section className="max-w-[960px] mx-auto px-8 lg:px-0 mt-12 mb-20">
		<h3 className="text-center text-3xl font-bold mb-2">Gallery</h3>
		<p className="text-center max-w-[600px] mx-auto mb-6">Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum magni autem nisi ut corporis deleniti, odit ipsum, soluta sapiente fugiat vero? Earum vitae libero nostrum incidunt cum quia vel quas!</p>
		<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-12">
			{room.images?.map((image, index) => (
				<div key={index} className="relative aspect-[2/3] w-full">
				<Image 
					src={"https:" + (image?.src || image?.url) || "/placeholder.jpg"}
					alt={property?.name || "Property Image"}
					fill
					className="object-cover"
				/>
			  </div>
			))}
		</div>

	  </section>
      
    </div>
  );
}

import { cache } from "react";
import { callApi } from "@/app/lib/api";
import { notFound } from "next/navigation";
import { Property } from "@/app/types";
import { PageProps } from "../../../../.next/types/app/layout";

const getCacheProperty = cache(async (id: string) => {
	const response = await callApi(
		"GET",
		`/properties/${id}?includeInOut=true`,
		null,
		"v2"
	);

	if (!response?.response || response?.status !== 200) {
		return notFound();
	}
	const property = response?.response as Property;
	const room = await callApi("GET", `/properties/${property.id}/rooms/${property.rooms[0].id}`);

	property.rooms[0] = room?.response;
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
		<div className="font-[family-name:var(--font-geist-sans)]">
			{property.address}
			{property.rooms[0].description}
		</div>
	);
}

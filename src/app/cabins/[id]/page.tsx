import { cache } from "react";
import { callApi } from "@/app/lib/api";
import { notFound } from "next/navigation";
import { Property } from "@/app/types";
import { PageProps } from "../../../../.next/types/app/layout";

const getCacheProperties = cache(async (id: string) => {
	const property = await callApi(
		"GET",
		`/properties/${id}?includeInOut=true`,
		null,
		"v2"
	);

	if (!property?.response || property?.status !== 200) {
		return notFound();
	}
	return property?.response as Property;
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
	const property = await getCacheProperties(id);
	const params = await searchParams;

	console.log(params?.from, params?.to, params?.guests)

	return (
		<div className="font-[family-name:var(--font-geist-sans)]">
			{property.address}
		</div>
	);
}

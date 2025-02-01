import { cache } from "react";
import { notFound } from "next/navigation";
import { PageProps } from "../../../../.next/types/app/layout";
import { getProperty } from "@/app/lib/queries";

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
		<div className="font-[family-name:var(--font-geist-sans)]">
			{property.address}
			{property.rooms[0].description}
		</div>
	);
}

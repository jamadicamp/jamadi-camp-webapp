import { cache } from "react";
import { callApi } from "@/app/lib/api";
import { notFound } from "next/navigation";
import {  Property } from "@/app/types";

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
};

export default async function PropertyPage(props: Props) {
  const {
    params: { id },
  } = props;
  const property = await getCacheProperties(id);

  return (
    <div className="font-[family-name:var(--font-geist-sans)]">
      {property.address}
    </div>
  );
}

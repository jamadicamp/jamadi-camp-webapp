"use client"

import { useState } from "react";
import AvailabilityCalendar from "./availability-calendar";
import { Property } from "../types";
import RenderPropertiesList from "./render-properties-list";

type Props = {
    properties: Property[]
}

export default function Search({properties}: Props) {
    const [availableProperties, setProperties] = useState<Array<{ property_id: number; room_type_id: number }>>([])

    // for each available property, we are going to find the property data
    const data: Property[] = []
    availableProperties.forEach(value => {

        const info = properties.find((e) => e.id === value.property_id && e.rooms[0].id === value.room_type_id)
        if (info) data.push(info);
    })

    console.log(data, availableProperties)

    return (
        <div className="flex flex-col items-center gap-4 mt-8">
        <h3 className="text-2xl font-bold">Search for a date</h3>
            <AvailabilityCalendar onSearch={setProperties} />
            {availableProperties?.length > 0 ? (
                <div className="mt-4 text-sm text-green-600">
                {availableProperties.length} properties are available for all
                days in the selected range.
                </div>
            ) : (
                null
            )}
            <RenderPropertiesList properties={data} />
        </div>
    )
}
"use client";

import { useState } from "react";
import MainAvailabilityCalendar from "./main-availability-calendar";
import { Property } from "../types/models";
import RenderPropertiesList from "./render-properties-list";
import { DateRange } from "react-day-picker";

type Props = {
	properties: Property[];
};

export default function Search({ properties }: Props) {
	const [availableProperties, setAvailableProperties] = useState<Property[]>([]);
	const [date, setDate] = useState<DateRange>();
	const [guests, setGuests] = useState<number>(1);

	function callbackSearch(
		availableProps: Property[],
		selectedDate: DateRange,
		guestCount: number
	) {
		setAvailableProperties(availableProps);
		setDate(selectedDate);
		setGuests(guestCount);
	}

	return (
		<div className="flex flex-col items-center gap-4 mt-16">
			<h3 className="text-2xl font-semibold uppercase">make a reservation</h3>
			<MainAvailabilityCalendar 
				onSearch={callbackSearch} 
				allProperties={properties}
			/>
			{availableProperties?.length > 0 ? (
				<div className="mt-4 text-sm text-green-600">
					{availableProperties.length} properties are available for all days in
					the selected range for {guests} {guests === 1 ? 'guest' : 'guests'}.
				</div>
			) : date?.from && date?.to ? (
				<div className="mt-4 text-sm text-red-600">
					No properties are available for the selected date range and guest count.
				</div>
			) : null}
			<RenderPropertiesList 
				properties={availableProperties} 
				date={date} 
				guests={guests.toString()}
			/>
		</div>
	);
}

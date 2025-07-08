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
			<h3 className="text-2xl font-semibold uppercase">hacer una reservación</h3>
			<MainAvailabilityCalendar 
				onSearch={callbackSearch} 
				allProperties={properties}
			/>
			{availableProperties?.length > 0 ? (
				<div className="mt-4 text-sm text-green-600">
					{availableProperties.length} propiedades están disponibles para todos los días en
					el rango seleccionado para {guests} {guests === 1 ? 'huésped' : 'huéspedes'}.
				</div>
			) : date?.from && date?.to ? (
				<div className="mt-4 text-sm text-red-600">
					No hay propiedades disponibles para el rango de fechas y número de huéspedes seleccionados.
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

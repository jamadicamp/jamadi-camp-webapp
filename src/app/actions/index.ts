"use server"

import { Property } from "../types/models";

// all the server code here

export async function getAvailablities(start: Date, end: Date) {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/properties/available?from=${start.toISOString()}&to=${end.toISOString()}`, {
            cache: 'no-store'
        });

        if (!response.ok) {
            return null;
        }

        const properties = await response.json() as Property[];
        
        // Transform the internal data structure to match what the calendar expects
        const availabilityData = properties.map((property: Property) => ({
            property_id: property._id,
            room_type_id: 1, // Since we merged room data into property, we use a default room type id
            period_start: start.toISOString().split('T')[0],
            period_end: end.toISOString().split('T')[0],
            available: 1,
            total_units: property.units || 1,
            total_overbooked: 0,
            is_available: true,
            booking_ids: [],
            closed_period_id: null
        }));

        return { response: availabilityData };
    } catch (error) {
        console.error('Error fetching availabilities:', error);
        return null;
    }
}
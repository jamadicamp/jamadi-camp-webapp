import { Property } from "../types/models";

export async function getProperty(id: string) {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/properties/${id}`, {
            cache: 'no-store'
        });

        if (!response.ok) {
            return null;
        }

        const property = await response.json() as Property;
        return property;
    } catch (error) {
        console.error('Error fetching property:', error);
        return null;
    }
}

export async function getProperties() {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/properties`, {
            cache: 'no-store'
        });

        if (!response.ok) {
            return null;
        }

        const properties = await response.json() as Property[];
        return properties;
    } catch (error) {
        console.error('Error fetching properties:', error);
        return null;
    }
}
  
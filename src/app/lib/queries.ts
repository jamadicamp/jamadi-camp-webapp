import { PropertiesV2Response, Property } from "../types";
import { Room } from "../types/Room";
import { callApi } from "./api";

export async function getProperty(id: string) {
    const response = await callApi(
        "GET",
        `/properties/${id}?includeInOut=true`,
        null,
        "v2"
    );

    if (!response?.response || response?.status !== 200) {
        return null;
    }
    const property = response?.response as Property;
    const room = await callApi("GET", `/properties/${property.id}/rooms/${property.rooms[0].id}`);

    property.rooms[0] = room?.response;
    return property
}

export async function getProperties() {
    const now = Date.now()
    const response = await callApi(
        "GET",
        "/properties?includeCount=true&page=1&size=50",
        null,
        "v2"
    );

    if (!response?.response || response?.status !== 200) {
        return null
    }

    // for each property, we get the information about the house. We store the data as dictionary Record<room_id, Room>
    const properties = response?.response as PropertiesV2Response
    const propertyRoomIds: Array<{property_id: number, room_id: number}> = []
    properties?.items?.forEach(property => {
        propertyRoomIds.push({property_id: property.id, room_id: property.rooms[0]?.id as number})
    })

    // send a promise request to the server for all the data
    const rooms = await Promise.all(propertyRoomIds.map(async (value) => {
        const response = await callApi("GET", `/properties/${value.property_id}/rooms/${value.room_id}`);
        return {...value, room: response?.response}
    }))

    // merge the rooms inside the properties and change the type
    for (let i = 0; i < properties.items.length; i++) {
        properties.items[0].rooms[0] = rooms.find((e) => e.room_id === properties.items[0].rooms[0].id)?.room as Room;
    }

    // NOTE: this is where we put the typescript type. So that you get the suggestions.
    console.log(Date.now() - now)
    return properties;
}
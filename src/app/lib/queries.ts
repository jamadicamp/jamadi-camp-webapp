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
    const now = Date.now();
  
    const response = await callApi(
      "GET",
      "/properties?includeCount=true&page=1&size=50",
      null,
      "v2"
    );
  
    if (!response?.response || response?.status !== 200) {
      return null;
    }
  
    // Type cast the response to our expected type.
    const properties = response.response as PropertiesV2Response;
    const propertyRoomIds: Array<{ property_id: number; room_id: number }> = [];
  
    // For each property, get the first room's ID (if available).
    properties.items.forEach(property => {
      if (property.rooms && property.rooms.length > 0) {
        propertyRoomIds.push({ property_id: property.id, room_id: property.rooms[0].id as number });
      }
    });
  
    // Send parallel requests for each room.
    const rooms = await Promise.all(
      propertyRoomIds.map(async value => {
        const roomResponse = await callApi("GET", `/properties/${value.property_id}/rooms/${value.room_id}`);
        return { ...value, room: roomResponse?.response };
      })
    );
  
  
    // Merge the fetched room data back into the properties.
    for (let i = 0; i < properties.items.length; i++) {
      // Check if the property has at least one room.
      if (properties.items[i].rooms && properties.items[i].rooms.length > 0) {
        const roomId = properties.items[i].rooms[0].id;
        const updatedRoom = rooms.find(e => e.room_id === roomId)?.room;
        if (updatedRoom) {
          properties.items[i].rooms[0] = updatedRoom as Room;
        }
      }
    }
  
    console.log(Date.now() - now);
    return properties;
  }
  
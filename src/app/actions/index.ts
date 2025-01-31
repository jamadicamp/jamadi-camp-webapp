"use server"

import { callApi } from "../lib/api"

// all the server code here

export async function getAvailablities(start: Date, end: Date) {
    const response = await callApi("GET", `/availability?periodStart=${start.toISOString()}&periodEnd=${end.toISOString()}`);

    return response;
}
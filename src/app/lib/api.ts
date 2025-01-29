/* eslint-disable @typescript-eslint/no-explicit-any */
export const token = process.env.LODGIFY_API_KEY;
export const baseUrl = process.env.SERVER_API_URL

type RequestMethod = "GET" | "POST" | "PUT"

export const callApi = async (
  method: RequestMethod,
  endpoint: string,
  params?: {
    body?: Record<string, unknown>;
    next?: {
      tags: string[];
    };
  } | null,
  version: "v1" | "v2" = "v1"
) => {
  const heads: any = {};

  if (token) {
    heads["X-apikey"] = `${token}`;
  }

  heads["Content-Type"] = "application/json";
  heads["Accept"] = "application/json";

  const options: any = {
    method: method,
    headers: heads,
    ...(params?.["body"] && { body: JSON.stringify(params["body"]) }),
    ...(params?.["next"] && { next: params["next"] }),
  };

  const url = `${baseUrl}/${version}${endpoint}`;

  try {
    const response = await fetch(url, options);
    let res;

    try {
      res = await response.json?.();
    } catch (error) {
      console.log(error);
    }

    return {
      response: res,
      status: response.status,
    };
  } catch (error: any) {
    console.log(error.message);
  }
};

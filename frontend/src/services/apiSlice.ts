import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query/react";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

const baseQueryWithLogging: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const baseQuery = fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers, { getState }: any) => {
      const token = getState()?.auth?.token;
      if (token) headers.set("authorization", `Bearer ${token}`);
      headers.set("accept", "application/json");
      return headers;
    },
  });

  // Log request
  const requestInfo = typeof args === 'string' ? { url: args, method: 'GET' } : args;
  console.log('[API Request]:', {
    url: requestInfo.url,
    method: requestInfo.method || 'GET',
    body: typeof args !== 'string' ? args.body : undefined,
    timestamp: new Date().toISOString(),
  });

  const result = await baseQuery(args, api, extraOptions);

  // Log response
  if (result.error) {
    console.error('[API Error]:', {
      url: requestInfo.url,
      status: result.error.status,
      error: result.error.data,
      timestamp: new Date().toISOString(),
    });
  } else {
    console.log('[API Success]:', {
      url: requestInfo.url,
      status: result.meta?.response?.status || 200,
      timestamp: new Date().toISOString(),
    });
  }

  return result;
};

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithLogging,
  tagTypes: ["Auth", "user", "Issue", "Employee"],
  endpoints: () => ({}), // extended via injectEndpoints()
});
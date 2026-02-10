import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";
export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = getState()?.auth?.token;
      if (token) headers.set("authorization", `Bearer ${token}`);
      headers.set("accept", "application/json");
      return headers;
    },
  }),
  tagTypes: ["Auth", "user", "Issue"],
  endpoints: () => ({}), // extended via injectEndpoints()
});

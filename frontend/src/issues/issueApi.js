import { apiSlice } from "../services/apiSlice";

export const issueApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createIssue: builder.mutation({
      query: (payload) => ({
        url: "/issues",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Issue"],
    }),
  }),
});

export const { useCreateIssueMutation } = issueApi;

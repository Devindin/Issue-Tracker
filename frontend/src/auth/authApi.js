import { apiSlice } from "../services/apiSlice";
export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    registerCompany: builder.mutation({
      query: (payload) => ({
        url: "/auth/register-company",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Auth"],
    }),
    login: builder.mutation({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["Auth"],
    }),
    getProfile: builder.query({
      query: () => "/auth/me",
      providesTags: ["Auth"],
    }),
  }),
});
export const {
  useRegisterCompanyMutation,
  useLoginMutation,
  useGetProfileQuery,
} = authApi;

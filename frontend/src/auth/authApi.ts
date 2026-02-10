import { apiSlice } from "../services/apiSlice";

interface RegisterCompanyPayload {
  companyName: string;
  companyDescription?: string;
  name: string;
  email: string;
  password: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface AuthResponse {
  message: string;
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    company: {
      id: string;
      name: string;
      description?: string;
    };
  };
}

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  company: string;
}

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    registerCompany: builder.mutation<AuthResponse, RegisterCompanyPayload>({
      query: (payload) => ({
        url: "/auth/register-company",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Auth"],
    }),
    login: builder.mutation<AuthResponse, LoginCredentials>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["Auth"],
    }),
    getProfile: builder.query<UserProfile, void>({
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

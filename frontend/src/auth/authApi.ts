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
      query: (payload) => {
        console.log('[API] REGISTER Company - Request:', {
          companyName: payload.companyName,
          name: payload.name,
          email: payload.email,
          hasPassword: !!payload.password,
          timestamp: new Date().toISOString()
        });
        return {
          url: "/auth/register-company",
          method: "POST",
          body: payload,
        };
      },
      transformResponse: (response: AuthResponse) => {
        console.log('[API] REGISTER Company - Success:', {
          userId: response.user?.id,
          userName: response.user?.name,
          companyId: response.user?.company?.id,
          companyName: response.user?.company?.name,
          role: response.user?.role,
          hasToken: !!response.token,
          timestamp: new Date().toISOString()
        });
        return response;
      },
      transformErrorResponse: (error: any) => {
        console.error('[API] REGISTER Company - Error:', {
          status: error.status,
          data: error.data,
          timestamp: new Date().toISOString()
        });
        return error;
      },
      invalidatesTags: ["Auth"],
    }),
    login: builder.mutation<AuthResponse, LoginCredentials>({
      query: (credentials) => {
        console.log('[API] LOGIN - Request:', {
          email: credentials.email,
          hasPassword: !!credentials.password,
          timestamp: new Date().toISOString()
        });
        return {
          url: "/auth/login",
          method: "POST",
          body: credentials,
        };
      },
      transformResponse: (response: AuthResponse) => {
        console.log('[API] LOGIN - Success:', {
          userId: response.user?.id,
          userName: response.user?.name,
          email: response.user?.email,
          companyId: response.user?.company?.id,
          companyName: response.user?.company?.name,
          role: response.user?.role,
          hasToken: !!response.token,
          timestamp: new Date().toISOString()
        });
        return response;
      },
      transformErrorResponse: (error: any) => {
        console.error('[API] LOGIN - Error:', {
          status: error.status,
          data: error.data,
          timestamp: new Date().toISOString()
        });
        return error;
      },
      invalidatesTags: ["Auth"],
    }),
    getProfile: builder.query<UserProfile, void>({
      query: () => {
        console.log('[API] GET Profile - Request:', {
          url: '/auth/me',
          timestamp: new Date().toISOString()
        });
        return "/auth/me";
      },
      transformResponse: (response: UserProfile) => {
        console.log('[API] GET Profile - Success:', {
          userId: response.id,
          userName: response.name,
          email: response.email,
          role: response.role,
          company: response.company,
          timestamp: new Date().toISOString()
        });
        return response;
      },
      transformErrorResponse: (error: any) => {
        console.error('[API] GET Profile - Error:', {
          status: error.status,
          data: error.data,
          timestamp: new Date().toISOString()
        });
        return error;
      },
      providesTags: ["Auth"],
    }),
  }),
});

export const {
  useRegisterCompanyMutation,
  useLoginMutation,
  useGetProfileQuery,
} = authApi;

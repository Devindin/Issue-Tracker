import { apiSlice } from "../../services/apiSlice";

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

interface VerifyEmailPayload {
  email: string;
}

interface VerifyEmailResponse {
  message: string;
  exists: boolean;
  userId?: string;
}

interface ResetPasswordPayload {
  email: string;
  newPassword: string;
}

interface ResetPasswordResponse {
  message: string;
  success: boolean;
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
    verifyEmail: builder.mutation<VerifyEmailResponse, VerifyEmailPayload>({
      query: (payload) => {
        console.log('[API] VERIFY Email - Request:', {
          email: payload.email,
          timestamp: new Date().toISOString()
        });
        return {
          url: "/auth/verify-email",
          method: "POST",
          body: payload,
        };
      },
      transformResponse: (response: VerifyEmailResponse) => {
        console.log('[API] VERIFY Email - Success:', {
          exists: response.exists,
          userId: response.userId,
          message: response.message,
          timestamp: new Date().toISOString()
        });
        return response;
      },
      transformErrorResponse: (error: any) => {
        console.error('[API] VERIFY Email - Error:', {
          status: error.status,
          data: error.data,
          timestamp: new Date().toISOString()
        });
        return error;
      },
    }),
    resetPassword: builder.mutation<ResetPasswordResponse, ResetPasswordPayload>({
      query: (payload) => {
        console.log('[API] RESET Password - Request:', {
          email: payload.email,
          hasNewPassword: !!payload.newPassword,
          timestamp: new Date().toISOString()
        });
        return {
          url: "/auth/reset-password",
          method: "POST",
          body: payload,
        };
      },
      transformResponse: (response: ResetPasswordResponse) => {
        console.log('[API] RESET Password - Success:', {
          success: response.success,
          message: response.message,
          timestamp: new Date().toISOString()
        });
        return response;
      },
      transformErrorResponse: (error: any) => {
        console.error('[API] RESET Password - Error:', {
          status: error.status,
          data: error.data,
          timestamp: new Date().toISOString()
        });
        return error;
      },
    }),
  }),
});

export const {
  useRegisterCompanyMutation,
  useLoginMutation,
  useVerifyEmailMutation,
  useResetPasswordMutation,
} = authApi;

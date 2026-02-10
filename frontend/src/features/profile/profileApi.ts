import { apiSlice } from '../../services/apiSlice';
import type { UserProfile } from '../../types/user';

interface ProfileResponse {
  message: string;
  profile: UserProfile & {
    id: string;
    role: string;
    company?: {
      id: string;
      name: string;
      description: string;
    };
  };
}

interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

interface ChangePasswordResponse {
  message: string;
  success: boolean;
}

export const profileApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get current user's profile
    getProfile: builder.query<UserProfile, void>({
      query: () => '/users/profile',
      providesTags: ['Profile'],
      transformResponse: (response: ProfileResponse) => {
        console.log('🌐 GET /users/profile response:', response);
        return response.profile;
      },
      transformErrorResponse: (error: any) => {
        console.error('🔴 GET /users/profile error:', error);
        return error;
      },
    }),

    // Update current user's profile
    updateProfile: builder.mutation<UserProfile, Partial<UserProfile>>({
      query: (profileData) => {
        console.log('🌐 PUT /users/profile request:', profileData);
        return {
          url: '/users/profile',
          method: 'PUT',
          body: profileData,
        };
      },
      invalidatesTags: ['Profile'],
      transformResponse: (response: ProfileResponse) => {
        console.log('🟢 PUT /users/profile success:', response);
        return response.profile;
      },
      transformErrorResponse: (error: any) => {
        console.error('🔴 PUT /users/profile error:', error);
        return error;
      },
      // Optimistic update
      async onQueryStarted(profileData, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          profileApi.util.updateQueryData('getProfile', undefined, (draft) => {
            Object.assign(draft, profileData);
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),

    // Change password
    changePassword: builder.mutation<ChangePasswordResponse, ChangePasswordPayload>({
      query: (passwordData) => {
        console.log('🌐 PUT /auth/change-password request');
        return {
          url: '/auth/change-password',
          method: 'PUT',
          body: passwordData,
        };
      },
      transformResponse: (response: ChangePasswordResponse) => {
        console.log('🟢 PUT /auth/change-password success:', response);
        return response;
      },
      transformErrorResponse: (error: any) => {
        console.error('🔴 PUT /auth/change-password error:', error);
        return error;
      },
    }),
  }),
});

export const {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
} = profileApi;

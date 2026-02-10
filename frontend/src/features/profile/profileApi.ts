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
  }),
});

export const {
  useGetProfileQuery,
  useUpdateProfileMutation,
} = profileApi;

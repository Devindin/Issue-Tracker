import { apiSlice } from '../../services/apiSlice';
import type { ManagedUser, CreateUserData } from '../../types/settings';

export const userApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all users in the company
    getUsers: builder.query<ManagedUser[], void>({
      query: () => '/users',
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: 'user' as const, id })), { type: 'user', id: 'LIST' }]
          : [{ type: 'user', id: 'LIST' }],
      transformResponse: (response: any) => {
        console.log('🌐 GET /users response:', response);
        return response.users || [];
      },
      transformErrorResponse: (error: any) => {
        console.error('🔴 GET /users error:', error);
        return error;
      },
    }),

    // Get user by ID
    getUserById: builder.query<ManagedUser, string>({
      query: (id) => `/users/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'user', id }],
      transformResponse: (response: any) => {
        console.log('🌐 GET /users/:id response:', response);
        return response.user;
      },
      transformErrorResponse: (error: any) => {
        console.error('🔴 GET /users/:id error:', error);
        return error;
      },
    }),

    // Create new user
    createUser: builder.mutation<ManagedUser, CreateUserData>({
      query: (userData) => {
        const dataToSend = { ...userData };
        console.log('🌐 POST /users request:', {
          ...dataToSend,
          password: '[HIDDEN]'
        });
        return {
          url: '/users',
          method: 'POST',
          body: dataToSend,
        };
      },
      invalidatesTags: [{ type: 'user', id: 'LIST' }],
      transformResponse: (response: any) => {
        console.log('🟢 POST /users success:', response);
        return response.user;
      },
      transformErrorResponse: (error: any) => {
        console.error('🔴 POST /users error:', error);
        return error;
      },
    }),

    // Update user
    updateUser: builder.mutation<ManagedUser, { id: string; data: Partial<CreateUserData> }>({
      query: ({ id, data }) => {
        console.log('🌐 PUT /users/:id request:', { id, data });
        return {
          url: `/users/${id}`,
          method: 'PUT',
          body: data,
        };
      },
      invalidatesTags: (_result, _error, { id }) => [{ type: 'user', id }, { type: 'user', id: 'LIST' }],
      transformResponse: (response: any) => {
        console.log('🟢 PUT /users/:id success:', response);
        return response.user;
      },
      transformErrorResponse: (error: any) => {
        console.error('🔴 PUT /users/:id error:', error);
        return error;
      },
    }),

    // Delete user
    deleteUser: builder.mutation<{ message: string }, string>({
      query: (id) => {
        console.log('🌐 DELETE /users/:id request:', { id });
        return {
          url: `/users/${id}`,
          method: 'DELETE',
        };
      },
      invalidatesTags: [{ type: 'user', id: 'LIST' }],
      transformResponse: (response: any) => {
        console.log('🟢 DELETE /users/:id success:', response);
        return response;
      },
      transformErrorResponse: (error: any) => {
        console.error('🔴 DELETE /users/:id error:', error);
        return error;
      },
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = userApi;

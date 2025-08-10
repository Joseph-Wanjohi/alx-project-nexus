import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { User, UserCreateData, AdminPoll, AdminPollCreateData, Vote } from '../types/AdminType';

const baseQuery = fetchBaseQuery({
    baseUrl: 'http://localhost:8000/',
    credentials: 'include',
    prepareHeaders: (headers) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            headers.set('Authorization', `Bearer ${token}`);
        }
        return headers;
    },
});

export const adminApi = createApi({
    reducerPath: 'adminApi',
    baseQuery,
    tagTypes: ['User', 'AdminPoll', 'Vote'],
    endpoints: (builder) => ({
        // User endpoints
        getUsers: builder.query<User[], void>({
            query: () => 'api/admin/users/',
            providesTags: ['User'],
        }),
        getUser: builder.query<User, number>({
            query: (id) => `api/admin/users/${id}/`,
            providesTags: (result, error, id) => [{ type: 'User', id }],
        }),
        createUser: builder.mutation<User, UserCreateData>({
            query: (user) => ({
                url: 'api/admin/users/',
                method: 'POST',
                body: user,
            }),
            invalidatesTags: ['User'],
        }),
        updateUser: builder.mutation<User, { id: number; data: Partial<User> }>({
            query: ({ id, data }) => ({
                url: `api/admin/users/${id}/`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: (result, error, { id }) => [{ type: 'User', id }, 'User'],
        }),
        deleteUser: builder.mutation<void, number>({
            query: (id) => ({
                url: `api/admin/users/${id}/`,
                method: 'DELETE',
            }),
            invalidatesTags: ['User'],
        }),

        // Poll endpoints
        getAdminPolls: builder.query<AdminPoll[], void>({
            query: () => 'api/admin/polls/',
            providesTags: ['AdminPoll'],
        }),
        getAdminPoll: builder.query<AdminPoll, number>({
            query: (id) => `api/admin/polls/${id}/`,
            providesTags: (result, error, id) => [{ type: 'AdminPoll', id }],
        }),
        createAdminPoll: builder.mutation<AdminPoll, AdminPollCreateData>({
            query: (poll) => ({
                url: 'api/admin/polls/',
                method: 'POST',
                body: poll,
            }),
            invalidatesTags: ['AdminPoll'],
        }),
        updateAdminPoll: builder.mutation<AdminPoll, { id: number; data: Partial<AdminPoll> }>({
            query: ({ id, data }) => ({
                url: `api/admin/polls/${id}/`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: (result, error, { id }) => [{ type: 'AdminPoll', id }, 'AdminPoll'],
        }),
        deleteAdminPoll: builder.mutation<void, number>({
            query: (id) => ({
                url: `api/admin/polls/${id}/`,
                method: 'DELETE',
            }),
            invalidatesTags: ['AdminPoll'],
        }),
        
        // Vote endpoints
        getVotes: builder.query<Vote[], void>({
            query: () => 'api/admin/votes/',
            providesTags: ['Vote'],
        }),
        deleteVote: builder.mutation<void, number>({
            query: (id) => ({
                url: `api/admin/votes/${id}/`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Vote'],
        }),
    }),
});

export const {
    useGetUsersQuery,
    useGetUserQuery,
    useCreateUserMutation,
    useUpdateUserMutation,
    useDeleteUserMutation,
    useGetAdminPollsQuery,
    useGetAdminPollQuery,
    useCreateAdminPollMutation,
    useUpdateAdminPollMutation,
    useDeleteAdminPollMutation,
    useGetVotesQuery,
    useDeleteVoteMutation,
} = adminApi;

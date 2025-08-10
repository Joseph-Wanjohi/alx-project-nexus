// src/api/userApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RegisterUser, User, AuthResponse } from '../types/UsersTypes';

const baseQueryWithAuth = fetchBaseQuery({
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

// Enhanced base query with automatic token refresh
const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {
    let result = await baseQueryWithAuth(args, api, extraOptions);
    
    // If we get a 401, try to refresh the token
    if (result?.error && result.error.status === 401) {
        const refreshToken = localStorage.getItem('refreshToken');
        
        if (refreshToken) {
            // Try to get a new token
            const refreshResult = await baseQueryWithAuth(
                {
                    url: 'api/users/token/refresh/',
                    method: 'POST',
                    body: { refresh: refreshToken },
                },
                api,
                extraOptions
            );
            
            if (refreshResult?.data) {
                const newTokens = refreshResult.data as AuthResponse;
                localStorage.setItem('accessToken', newTokens.access);
                
                // Retry the original query with new token
                result = await baseQueryWithAuth(args, api, extraOptions);
            } else {
                // Refresh failed, clear tokens
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
            }
        }
    }
    
    return result;
};

export const userApi = createApi({
    reducerPath: 'userApi',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['User'],
    endpoints: (builder) => ({
        register: builder.mutation<User, RegisterUser>({
            query: (user) => ({
                url: 'api/users/register/',
                method: 'POST',
                body: user,
            }),
            invalidatesTags: ['User'],
        }),
        login: builder.mutation<AuthResponse, { username: string; password: string }>({
            query: (credentials) => ({
                url: 'api/users/login/',
                method: 'POST',
                body: credentials,
            }),
            invalidatesTags: ['User'],
        }),
        getUser: builder.query<User, void>({
            query: () => 'api/users/me/',
            providesTags: ['User'],
        }),
        refreshToken: builder.mutation<AuthResponse, { refresh: string }>({
            query: (tokens) => ({
                url: 'api/users/token/refresh/',
                method: 'POST',
                body: tokens,
            }),
        }),
        getAdminUsers: builder.query<User[], void>({
            query: () => 'pollpro_admin/users/',
            providesTags: ['User'],
        }),
        updateAdminUser: builder.mutation<User, { id: number; data: Partial<User> }>({
            query: ({ id, data }) => ({
                url: `pollpro_admin/users/${id}/`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['User'],
        }),
        deleteAdminUser: builder.mutation<void, number>({
            query: (id) => ({
                url: `pollpro_admin/users/${id}/`,
                method: 'DELETE',
            }),
            invalidatesTags: ['User'],
        }),
        updateUser: builder.mutation<User, Partial<User>>({
            query: (userData) => ({
                url: 'api/users/me/',
                method: 'PATCH',
                body: userData,
            }),
            invalidatesTags: ['User'],
        }),
    }),
});

export const {
    useRegisterMutation,
    useLoginMutation,
    useGetUserQuery,
    useRefreshTokenMutation,
    useGetAdminUsersQuery,
    useUpdateAdminUserMutation,
    useDeleteAdminUserMutation,
    useUpdateUserMutation,
} = userApi;
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Poll, PollCreateData, VoteData, PollResult } from '../types/PollsTypes';

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

export interface CategoryChoice {
    value: string;
    label: string;
}

export interface PollsQueryParams {
    category?: string;
}

export const pollsApi = createApi({
    reducerPath: 'pollsApi',
    baseQuery,
    tagTypes: ['Poll', 'Vote'],
    endpoints: (builder) => ({
        // Get polls with optional category filter
        getPolls: builder.query<Poll[], PollsQueryParams>({
            query: (params = {}) => {
                const searchParams = new URLSearchParams();
                if (params.category && params.category !== 'All') {
                    // Convert frontend category names to backend values
                    const categoryMap: { [key: string]: string } = {
                        'Technology': 'TECH',
                        'Entertainment': 'ENT',
                        'Sports': 'SPRT',
                        'Politics': 'POL',
                        'Lifestyle': 'LIFE',
                        'Education': 'EDU'
                    };
                    const backendCategory = categoryMap[params.category] || params.category;
                    searchParams.append('category', backendCategory);
                }
                
                const queryString = searchParams.toString();
                return `api/polls/${queryString ? `?${queryString}` : ''}`;
            },
            providesTags: ['Poll'],
        }),

        // Get all active polls (for backward compatibility)
        getActivePolls: builder.query<Poll[], PollsQueryParams>({
            query: (params = {}) => {
                const searchParams = new URLSearchParams();
                if (params.category && params.category !== 'All') {
                    // Convert frontend category names to backend values
                    const categoryMap: { [key: string]: string } = {
                        'Technology': 'TECH',
                        'Entertainment': 'ENT',
                        'Sports': 'SPRT',
                        'Politics': 'POL',
                        'Lifestyle': 'LIFE',
                        'Education': 'EDU'
                    };
                    const backendCategory = categoryMap[params.category] || params.category;
                    searchParams.append('category', backendCategory);
                }
                
                const queryString = searchParams.toString();
                return `api/polls/${queryString ? `?${queryString}` : ''}`;
            },
            providesTags: ['Poll'],
        }),

        // Get available categories
        getCategories: builder.query<CategoryChoice[], void>({
            query: () => 'api/polls/categories/',
            transformResponse: (response: CategoryChoice[]) => response,
        }),

        // Create a new poll
        createPoll: builder.mutation<Poll, PollCreateData>({
            query: (poll) => ({
                url: 'api/polls/create/',
                method: 'POST',
                body: poll,
            }),
            invalidatesTags: ['Poll'],
        }),

        // Get poll details
        getPoll: builder.query<Poll, number>({
            query: (id) => `api/polls/${id}/`,
            providesTags: (result, error, id) => [{ type: 'Poll', id }],
        }),

        // Vote on a poll
        vote: builder.mutation<{ detail: string }, { pollId: number; voteData: VoteData }>({
            query: ({ pollId, voteData }) => ({
                url: `api/polls/${pollId}/vote/`,
                method: 'POST',
                body: voteData,
            }),
            invalidatesTags: (result, error, { pollId }) => [
                { type: 'Poll', id: pollId },
                'Poll', // Invalidate all polls to update vote counts
            ],
        }),

        // Retract vote
        retractVote: builder.mutation<{ detail: string }, number>({
            query: (pollId) => ({
                url: `api/polls/${pollId}/retract/`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, pollId) => [
                { type: 'Poll', id: pollId },
                'Poll', // Invalidate all polls to update vote counts
            ],
        }),

        // Get poll results
        getPollResults: builder.query<PollResult, number>({
            query: (id) => `api/polls/${id}/results/`,
            providesTags: (result, error, id) => [{ type: 'Poll', id }],
        }),

        // Delete poll (admin/creator only)
        deletePoll: builder.mutation<void, number>({
            query: (id) => ({
                url: `api/polls/${id}/`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Poll'],
        }),

        // Get user's poll history
        getUserPollHistory: builder.query<Poll[], void>({
            query: () => 'api/polls/user-history/',
            providesTags: ['Poll'],
        }),

        // Get user's polls
        getUserPolls: builder.query<Poll[], void>({
            query: () => 'api/polls/user-polls/',
            providesTags: ['Poll'],
        }),

        // Create a new poll for the user
        createUserPoll: builder.mutation<Poll, PollCreateData>({
            query: (poll) => ({
                url: 'api/polls/user-polls/',
                method: 'POST',
                body: poll,
            }),
            invalidatesTags: ['Poll'],
        }),

        // Get details of a specific user poll
        getUserPoll: builder.query<Poll, number>({
            query: (id) => `api/polls/user-polls/${id}/`,
            providesTags: (result, error, id) => [{ type: 'Poll', id }],
        }),

        // Update a specific user poll
        updateUserPoll: builder.mutation<Poll, { id: number; data: Partial<PollCreateData> }>({
            query: ({ id, data }) => ({
                url: `api/polls/user-polls/${id}/`,
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: (result, error, { id }) => [{ type: 'Poll', id }, 'Poll'],
        }),

        // Delete a specific user poll
        deleteUserPoll: builder.mutation<void, number>({
            query: (id) => ({
                url: `api/polls/user-polls/${id}/`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, id) => [{ type: 'Poll', id }, 'Poll'],
        }),
    }),
});

export const {
    useGetPollsQuery,
    useGetActivePollsQuery,
    useGetCategoriesQuery,
    useCreatePollMutation,
    useGetPollQuery,
    useVoteMutation,
    useRetractVoteMutation,
    useGetPollResultsQuery,
    useDeletePollMutation,
    useGetUserPollHistoryQuery,
    useGetUserPollsQuery, 
    useCreateUserPollMutation, 
    useGetUserPollQuery, 
    useUpdateUserPollMutation, 
    useDeleteUserPollMutation, 
} = pollsApi;
import gamerParadiseApiSlice from '../../../redux/api/gamerParadiseApiSlice'

export const requestsEndpoints = gamerParadiseApiSlice.injectEndpoints({
    tagTypes: ['featureRequest', 'bugReport', 'supportRequest', 'gameRequest'],
    endpoints: builder => ({
        // Get APIs
        getFeatureRequests: builder.query({
            query: ({ requester, featureRequestId }) => ({
                url: '/feature-request',
                param: {
                    requester: requester || '',
                    featureRequestId,
                },
                method: 'GET',
            }),
            providesTags: ['featureRequest'],
        }),
        getBugReports: builder.query({
            query: ({ requester, requestId }) => ({
                url: '/bug-report',
                param: {
                    requester: requester || '',
                    requestId,
                },
                method: 'GET',
            }),
            providesTags: ['bugReport'],
        }),
        getSupportRequests: builder.query({
            providesTags: ['Request'],
            query: ({ requester, requestId }) => ({
                url: '/support-request',
                param: {
                    requester: requester || '',
                    requestId,
                },
                method: 'GET',
            }),
            providesTags: ['supportRequest'],
        }),
        getGameRequests: builder.query({
            query: ({ requester, requestId }) => ({
                url: '/game-request',
                param: {
                    requester: requester || '',
                    requestId,
                },
                method: 'GET',
            }),
            providesTags: ['gameRequest'],
        }),
        getPurchasedGames: builder.query({
            query: ({ requester, requestId }) => ({
                url: '/purchase-game',
                param: {
                    requester: requester || '',
                    requestId,
                },
                method: 'GET',
            }),
            providesTags: ['gameRequest'],
        }),
        // Post APIs
        submitFeatureRequest: builder.mutation({
            query: ({ type, requester, requestId }) => ({
                url: '/feature-request',
                param: {
                    requester: requester || '',
                    requestId,
                },
                method: 'POST',
            }),
            invalidateTags: ['featureRequest'],
        }),
        submitBugReport: builder.mutation({
            query: ({ requester, requestId }) => ({
                url: '/bug-report',
                param: {
                    requester: requester || '',
                    requestId,
                },
                method: 'POST',
            }),
            invalidateTags: ['bugReport'],
        }),
        submitSupportRequest: builder.mutation({
            query: ({ requester, requestId }) => ({
                url: '/support-request',
                param: {
                    type,
                    requester: requester || '',
                    requestId,
                },
                method: 'POST',
            }),
            invalidateTags: ['supportRequest'],
        }),
        submitGameRequest: builder.mutation({
            query: ({ type, requester, requestId }) => ({
                url: '/game-request',
                param: {
                    type,
                    requester: requester || '',
                    requestId,
                },
                method: 'POST',
            }),
            invalidateTags: ['gameRequest'],
        }),
    }),
})

export const {
    useGetFeatureRequestsQuery,
    useGetBugReportsQuery,
    useGetSupportRequestsQuery,
    useGetGameRequestsQuery,
    useSubmitFeatureRequestMutation,
    useSubmitBugReportMutation,
    useSubmitSupportRequestMutation,
    useSubmitGameRequestMutation,
} = requestsEndpoints

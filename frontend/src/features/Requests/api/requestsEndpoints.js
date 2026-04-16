import gamerParadiseApiSlice from '../../../redux/api/gamerParadiseApiSlice'

export const requestsEndpoints = gamerParadiseApiSlice.injectEndpoints({
    tagTypes: ['featureRequest', 'bugReport', 'supportRequest', 'gameRequest'],
    endpoints: builder => ({
        // Get APIs
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
        // Post APIs
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
    }),
})

export const {
    useLazyGetFeatureRequestsQuery,
    useLazyGetBugReportsQuery,
    useLazyGetSupportRequestsQuery,
    useLazyGetGameRequestsQuery,
    useSubmitFeatureRequestMutation,
    useSubmitBugReportMutation,
    useSubmitSupportRequestMutation,
    useSubmitGameRequestMutation,
} = requestsEndpoints

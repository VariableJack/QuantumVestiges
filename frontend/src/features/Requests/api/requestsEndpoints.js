import gamerParadiseApiSlice from '../../../redux/api/gamerParadiseApiSlice'

export const requestsEndpoints = gamerParadiseApiSlice.injectEndpoints({
    tagTypes: [
        'bugReports',
        'supportRequests',
        'discussionThreads',
        'bugReport',
        'supportRequest',
        'discussionThread',
    ],
    endpoints: builder => ({
        // Get APIs
        getSupportRequests: builder.query({
            query: () => ({
                url: '/support-requests',
                method: 'GET',
            }),
            providesTags: ['supportRequests'],
        }),
        getBugReports: builder.query({
            query: () => ({
                url: '/bug-reports',
                method: 'GET',
            }),
            providesTags: ['bugReports'],
        }),
        getDiscussionThreads: builder.query({
            query: () => ({
                url: '/discussions',
                method: 'GET',
            }),
            providesTags: ['discussionThreads'],
        }),
        getDetailedSupportRequest: builder.query({
            query: ({ threadId }) => ({
                url: `/support-request?threadId=${threadId}`,
                method: 'GET',
            }),
            providesTags: ['supportRequest'],
        }),
        getDetailedBugReport: builder.query({
            query: ({ threadId }) => ({
                url: `/bug-report?threadId=${threadId}`,
                method: 'GET',
            }),
            providesTags: ['bugReport'],
        }),
        getDetailedDiscussionThread: builder.query({
            query: ({ threadId }) => ({
                url: `/discussion?threadId=${threadId}`,
                method: 'GET',
            }),
            providesTags: ['discussionThread'],
        }),
        // Post APIs
        submitSupportRequest: builder.mutation({
            query: ({ title, description }) => ({
                url: '/support-request/create',
                body: { title, description },
                method: 'POST',
            }),
            invalidateTags: ['supportRequests'],
        }),
        submitBugReport: builder.mutation({
            query: ({ title, description }) => ({
                url: '/bug-report/create',
                body: { title, description },
                method: 'POST',
            }),
            invalidateTags: ['bugReports'],
        }),
        submitDiscussionThread: builder.mutation({
            query: ({ title, description }) => ({
                url: '/discussion/create',
                body: { title, description },
                method: 'POST',
            }),
            invalidateTags: ['discussionThreads'],
        }),
        submitSupportRequestComment: builder.mutation({
            query: ({ threadId, description }) => ({
                url: '/support-request/comment',
                body: { threadId, description },
                method: 'POST',
            }),
            invalidateTags: ['supportRequest'],
        }),
        submitBugReportComment: builder.mutation({
            query: ({ threadId, description }) => ({
                url: '/bug-report/comment',
                body: { threadId, description },
                method: 'POST',
            }),
            invalidateTags: ['bugReport'],
        }),
        submitDiscussionThreadComment: builder.mutation({
            query: ({ threadId, description }) => ({
                url: '/discussion/comment',
                body: { threadId, description },
                method: 'POST',
            }),
            invalidateTags: ['discussionThread'],
        }),

        closeSupportRequest: builder.mutation({
            query: ({ threadId, description }) => ({
                url: '/support-request/close',
                body: { threadId, description },
                method: 'POST',
            }),
            invalidateTags: ['supportRequests', 'supportRequest'],
        }),
        reopenSupportRequest: builder.mutation({
            query: ({ threadId, description }) => ({
                url: '/support-request/reopen',
                body: { threadId, description },
                method: 'POST',
            }),
            invalidateTags: ['supportRequests', 'supportRequest'],
        }),
        closeBugReport: builder.mutation({
            query: ({ threadId, description }) => ({
                url: '/bug-report/close',
                body: { threadId, description },
                method: 'POST',
            }),
            invalidateTags: ['bugReports', 'bugReport'],
        }),
        reopenBugReport: builder.mutation({
            query: ({ threadId, description }) => ({
                url: '/bug-report/reopen',
                body: { threadId, description },
                method: 'POST',
            }),
            invalidateTags: ['bugReports', 'bugReport'],
        }),
    }),
})

export const {
    useLazyGetSupportRequestsQuery,
    useLazyGetBugReportsQuery,
    useLazyGetDiscussionThreadsQuery,
    useLazyGetDetailedSupportRequestQuery,
    useLazyGetDetailedBugReportQuery,
    useLazyGetDetailedDiscussionThreadQuery,
    useSubmitSupportRequestMutation,
    useSubmitBugReportMutation,
    useSubmitDiscussionThreadMutation,
    useSubmitSupportRequestCommentMutation,
    useSubmitBugReportCommentMutation,
    useSubmitDiscussionThreadCommentMutation,
    useCloseSupportRequestMutation,
    useReopenSupportRequestMutation,
    useCloseBugReportMutation,
    useReopenBugReportMutation,
} = requestsEndpoints

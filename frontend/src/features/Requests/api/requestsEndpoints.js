import gamerParadiseApiSlice from '../../../redux/api/gamerParadiseApiSlice'

export const requestsEndpoints = gamerParadiseApiSlice.injectEndpoints({
    tagTypes: ['bugReport', 'supportRequest', 'discussionThreads', 'comments'],
    endpoints: builder => ({
        // Get APIs
        getBugReports: builder.query({
            query: ({ requestId }) => ({
                url: '/bug-report',
                param: {
                    requestId,
                },
                method: 'GET',
            }),
            providesTags: ['bugReport'],
        }),
        getSupportRequests: builder.query({
            query: ({ requestId }) => ({
                url: '/support-request',
                param: {
                    requestId,
                },
                method: 'GET',
            }),
            providesTags: ['supportRequest'],
        }),
        getDiscussionThreads: builder.query({
            query: ({ requestId }) => ({
                url: '/discussion-threads',
                param: {
                    requestId,
                },
                method: 'GET',
            }),
            providesTags: ['discussionThreads'],
        }),
		getComments: builder.query({
            query: ({ type, requestId }) => ({
                url: '/comments',
                param: {
					type,
                    requestId,
                },
                method: 'GET',
            }),
            providesTags: ['comments'],
        }),
        // Post APIs
        submitBugReport: builder.mutation({
            query: ({ title, body, subject }) => ({
                url: '/bug-report',
                bod: {title, body, subject
                },
                method: 'POST',
            }),
            invalidateTags: ['bugReport'],
        }),
        submitSupportRequest: builder.mutation({
            query: ({ title, body, subject }) => ({
                url: '/support-request',
                bod: {title, body, subject
                },
                method: 'POST',
            }),
            invalidateTags: ['supportRequest'],
        }),
        submitDiscussionThread: builder.mutation({
            query: ({ title, body, subject }) => ({
                url: '/discussion-threads',
                bod: {title, body, subject
                },
                method: 'POST',
            }),
            invalidateTags: ['discussionThreads'],
        }),
		postComment: builder.query({
            query: ({ type, requestId, comment }) => ({
                url: '/post-comment',
                bod: {
					type,
                    requestId,
					comment
                },
                method: 'POST',
            }),
            invalidateTags: ['comments'],
        }),
		editComment: builder.query({
            query: ({ type, requestId, commentId, comment }) => ({
                url: '/edit-comment',
                bod: {
					type,
                    requestId,
					commentId,
					comment
                },
                method: 'POST',
            }),
            invalidateTags: ['comments'],
        }),
    }),
})

export const {
    useLazyGetBugReportsQuery,
    useLazyGetSupportRequestsQuery,
    useLazyGetDiscussionThreadsQuery,
	useLazyGetCommentsQuery,
    useSubmitBugReportMutation,
    useSubmitSupportRequestMutation,
    useSubmitDiscussionThreadMutation,
	usePostCommentMutation,
} = requestsEndpoints

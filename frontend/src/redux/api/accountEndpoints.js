import gamerParadiseApiSlice from './gamerParadiseApiSlice'

export const accountEndpoints = gamerParadiseApiSlice.injectEndpoints({
    endpoints: builder => ({
        getAccountDetails: builder.query({
            query: () => ({
                url: '/account-details',
                method: 'GET',
            }),
        }),
        getOrderHistory: builder.query({
            query: () => ({
                url: '/order-history',
                method: 'GET',
            }),
        }),
        updateNotificationPreferences: builder.mutation({
            query: ({ notifications }) => ({
                url: '/notification-preferences',
                method: 'POST',
                body: {
                    notifications,
                },
            }),
        }),
    }),
})

export const {
    useLazyGetAccountDetailsQuery,
    useLazyGetOrderHistoryQuery,
    useUpdateNotificationPreferencesMutation,
} = accountEndpoints

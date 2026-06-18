import gamerParadiseApiSlice from './gamerParadiseApiSlice'

export const accountEndpoints = gamerParadiseApiSlice.injectEndpoints({
    endpoints: builder => ({
        getSettings: builder.query({
            query: () => ({
                url: '/settings',
                method: 'GET',
            }),
        }),
        updateNotificationPreferences: builder.mutation({
            query: ({ notifications }) => ({
                url: '/notification-preferences',
                method: 'POST',
                body: notifications,
            }),
        }),
    }),
})

export const { useLazyGetSettingsQuery, useUpdateNotificationPreferencesMutation } =
    accountEndpoints

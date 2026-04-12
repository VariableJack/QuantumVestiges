import gamerParadiseApiSlice from './gamerParadiseApiSlice'

export const mediaEndpoints = gamerParadiseApiSlice.injectEndpoints({
    tagTypes: ['account-details', 'cart'],
    endpoints: builder => ({
        getFranchises: builder.query({
            query: ({ franchise }) => ({
                url: `/franchises${(franchise && `?gameId=${franchise}`) || ''}`,
                method: 'GET',
            }),
        }),
        getGames: builder.query({
            query: ({ franchise, game }) => ({
                url: `/games?franchiseId=${franchise}${game && `&gameId=${game}`}`,
                method: 'GET',
            }),
        }),
        getPurchasedGames: builder.query({
            query: ({ accessToken }) => ({
                url: `/purchase-games`,
                method: 'GET',
                headers: { Authorization: accessToken },
            }),
            providesTags: ['account-details'],
        }),
        getCart: builder.query({
            query: () => ({
                url: `/cart`,
                method: 'GET',
            }),
            providesTags: ['cart'],
        }),
        updateCart: builder.mutation({
            query: ({ action, gameId }) => ({
                url: `/update-cart`,
                method: 'POST',
                body: {
                    action,
                    gameId,
                },
            }),
            invalidateTags: ['cart'],
        }),
        checkoutCart: builder.mutation({
            query: () => ({
                url: `/checkout-cart`,
                method: 'POST',
            }),
            invalidateTags: ['account-details', 'cart'],
        }),
    }),
})

export const {
    useGetFranchisesQuery,
    useLazyGetFranchisesQuery,
    useGetGamesQuery,
    useLazyGetGamesQuery,

    useLazyGetPurchasedGamesQuery,
    useLazyGetCartQuery,
    useUpdateCartMutation,
    useCheckoutCartMutation,
} = mediaEndpoints

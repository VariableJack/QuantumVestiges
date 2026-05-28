import gamerParadiseApiSlice from './gamerParadiseApiSlice'

export const mediaEndpoints = gamerParadiseApiSlice.injectEndpoints({
    tagTypes: ['account-details', 'cart'],
    endpoints: builder => ({
        getFranchises: builder.query({
            query: () => ({
                url: `/franchises`,
                method: 'GET',
            }),
        }),
        getFranchiseById: builder.query({
            query: ({ franchise }) => ({
                url: `/franchise?franchiseId=${franchise}`,
                method: 'GET',
            }),
        }),
        getGames: builder.query({
            query: ({ franchise }) => ({
                url: `/games?franchiseId=${franchise}${game && `&gameId=${game}`}`,
                method: 'GET',
            }),
        }),
        getGameById: builder.query({
            query: ({ game }) => ({
                url: `/game?gameId=${game}}`,
                method: 'GET',
            }),
        }),
        getPurchasedItems: builder.query({
            query: ({ accessToken }) => ({
                url: `/purchased-games`,
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
    useGetFranchiseByIdQuery,
    useLazyGetFranchiseByIdQuery,
    useGetGamesQuery,
    useLazyGetGamesQuery,
    useGetGameByIdQuery,
    useLazyGetGameByIdQuery,

    useLazyGetPurchasedItemsQuery,
    useLazyGetCartQuery,
    useUpdateCartMutation,
    useCheckoutCartMutation,
} = mediaEndpoints

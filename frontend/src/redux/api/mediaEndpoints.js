import gamerParadiseApiSlice from './gamerParadiseApiSlice'

export const mediaEndpoints = gamerParadiseApiSlice.injectEndpoints({
    tagTypes: ['account-details', 'cart', 'games', 'franchises'],
    endpoints: builder => ({
        getFranchises: builder.query({
            query: () => ({
                url: `/franchises`,
                method: 'GET',
            }),
            providesTags: ['franchises'],
        }),
        getFranchiseById: builder.query({
            query: ({ franchise }) => ({
                url: `/franchise?franchiseId=${franchise}`,
                method: 'GET',
            }),
        }),
        getGames: builder.query({
            query: ({ franchise }) => ({
                url: `/games?franchiseId=${franchise}}`,
                method: 'GET',
            }),
            providesTags: ['games'],
        }),
        getGameById: builder.query({
            query: ({ game }) => ({
                url: `/game?gameId=${game}}`,
                method: 'GET',
            }),
        }),
        getPurchasedItems: builder.query({
            query: ({ accessToken }) => ({
                url: '/purchased-games',
                method: 'GET',
                headers: { Authorization: accessToken },
            }),
            providesTags: ['account-details'],
        }),
        getCart: builder.query({
            query: () => ({
                url: '/cart',
                method: 'GET',
            }),
            providesTags: ['cart'],
        }),
        updateCart: builder.mutation({
            query: ({ action, gameId }) => ({
                url: '/update-cart',
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
                url: '/checkout-cart',
                method: 'POST',
            }),
            invalidateTags: ['account-details', 'cart'],
        }),
        // Admin
        createFranchise: builder.mutation({
            query: ({ franchiseName }) => ({
                url: '/franchises',
                method: 'POST',
                body: {
                    franchiseName,
                },
            }),
            invalidateTags: ['franchises'],
        }),
        getGamePresignedUrls: builder.query({
            query: ({ fileNames, method }) => ({
                url: '/presigned-urls',
                method: 'POST',
                body: {
                    fileNames,
                    method,
                    type: 'GAME',
                },
            }),
        }),
        getInstaller: builder.query({
            query: () => ({
                url: '/installer',
                method: 'GET',
            }),
        }),
        createGame: builder.mutation({
            query: ({ gameName, franchiseId, fileNames }) => ({
                url: '/games',
                method: 'POST',
                body: {
                    productName,
                    type: 'GAME',
                    franchiseId,
                    price,
                },
            }),
            invalidateTags: ['games'],
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
    useLazyGetGamePresignedUrlsQuery,
    useLazyGetInstallerQuery,

    useLazyGetPurchasedItemsQuery,
    useLazyGetCartQuery,
    useUpdateCartMutation,
    useCheckoutCartMutation,
    useCreateFranchiseMutation,
    useCreateGameMutation,
} = mediaEndpoints

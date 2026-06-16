import gamerParadiseApiSlice from './gamerParadiseApiSlice'

export const mediaEndpoints = gamerParadiseApiSlice.injectEndpoints({
    tagTypes: ['account-details', 'cart', 'products', 'franchises'],
    endpoints: builder => ({
        getFranchises: builder.query({
            query: () => ({
                url: `/franchises`,
                method: 'GET',
            }),
            providesTags: ['franchises'],
        }),
        getFranchiseById: builder.query({
            query: ({ franchiseId }) => ({
                url: `/franchise?franchiseId=${franchiseId}`,
                method: 'GET',
            }),
        }),
        getProducts: builder.query({
            query: ({ franchiseId }) => ({
                url: `/products?franchiseId=${franchiseId}`,
                method: 'GET',
            }),
            providesTags: ['products'],
        }),
        getProductById: builder.query({
            query: ({ productId }) => ({
                url: `/product?productId=${productId}`,
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
        getProductPresignedUrls: builder.query({
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
            query: ({ productName, franchiseId, price }) => ({
                url: '/products',
                method: 'POST',
                body: {
                    productName,
                    productType: 'GAME',
                    franchiseId,
                    price,
                },
            }),
            invalidateTags: ['products'],
        }),
    }),
})

export const {
    useGetFranchisesQuery,
    useLazyGetFranchisesQuery,
    useGetFranchiseByIdQuery,
    useLazyGetFranchiseByIdQuery,
    useGetProductsQuery,
    useLazyGetProductsQuery,
    useGetProductByIdQuery,
    useLazyGetProductByIdQuery,
    useLazyGetProductPresignedUrlsQuery,
    useLazyGetInstallerQuery,

    useLazyGetPurchasedItemsQuery,
    useLazyGetCartQuery,
    useUpdateCartMutation,
    useCheckoutCartMutation,
    useCreateFranchiseMutation,
    useCreateGameMutation,
} = mediaEndpoints

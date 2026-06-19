import gamerParadiseApiSlice from './gamerParadiseApiSlice'

export const mediaEndpoints = gamerParadiseApiSlice.injectEndpoints({
    tagTypes: ['account-details', 'order', 'products', 'franchises'],
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
                url: '/order',
                method: 'GET',
            }),
            providesTags: ['order'],
        }),
        updateOrder: builder.mutation({
            query: ({ action, productId, quantity }) => ({
                url: '/update-order',
                method: 'POST',
                body: {
                    action,
                    productId,
                    quantity,
                },
            }),
            invalidateTags: ['order'],
        }),
        checkoutCart: builder.mutation({
            query: () => ({
                url: '/checkout-order',
                method: 'POST',
            }),
            invalidateTags: ['account-details', 'order'],
        }),
        // Admin
        createFranchise: builder.mutation({
            query: ({ franchiseName }) => ({
                url: '/franchise/create',
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
                url: '/product/create',
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

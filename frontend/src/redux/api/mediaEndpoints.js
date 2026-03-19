import gamerParadiseApiSlice from './gamerParadiseApiSlice'

export const mediaEndpoints = gamerParadiseApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getFranchises: builder.query({
      query: () => ({
          url: '/franchises',
          method: 'GET',
      }),
    }),
    getGamesInFranchise: builder.query({
      query: ({
        franchise,
      }) => ({
          url: `/games?franchise=${franchise}`,
          method: 'GET',
      }),
    })
  })
})

export const { useGetFranchisesQuery, useLazyGetFranchisesQuery, useGetGamesInFranchiseQuery, useLazyGetGamesInFranchiseQuery } = mediaEndpoints
import gamerParadiseApiSlice from '../../../redux/api/gamerParadiseApiSlice'

export const requestsEndpoints = gamerParadiseApiSlice.injectEndpoints({
  tagTypes: ['Request'],
  endpoints: (builder) => ({
    getRequests: builder.query({
      providesTags: ['Request'],
      query: ({
        type,
        requester,
      }) => ({
          url: '/requests',
          param: {
              type,
              requester: requester || ''
          },
          method: 'GET'
      }),
    }),
    submitRequest: builder.mutation({
      query: ({
        type,
        requester,
      }) => ({
        url: '/requests',
        body,
          method: 'POST'
      }),
      invalidateTags: ['Request'],
    })
  })
})

export const { useGetRequestsQuery, useSubmitRequestMutation } = requestsEndpoints
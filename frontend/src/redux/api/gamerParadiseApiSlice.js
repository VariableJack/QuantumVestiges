import { createApi } from '@reduxjs/toolkit/query/react'
import { fetchBaseQuery } from '@reduxjs/toolkit/query'

export default createApi({
    reducerPath: 'gamerParadiseReducer',
    baseQuery: fetchBaseQuery({
        baseUrl: '/api',
        credentials: 'include',
        prepareHeaders: headers => {
            const token = localStorage.getItem('accessToken')
            if (token) {
                headers.set('Authorization', token)
            }
            return headers
        },
    }),
    endpoints: () => ({}),
})

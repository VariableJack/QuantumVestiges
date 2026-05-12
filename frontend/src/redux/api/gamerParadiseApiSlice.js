import { createApi } from '@reduxjs/toolkit/query/react'
import { fetchBaseQuery } from '@reduxjs/toolkit/query'

export default createApi({
    reducerPath: 'gamerParadiseReducer',
    baseQuery: fetchBaseQuery({
        //baseUrl: 'https://62oc9e5357.execute-api.us-west-1.amazonaws.com/devo',
		baseUrl: 'http://localhost:8080',
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

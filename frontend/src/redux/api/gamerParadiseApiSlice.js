import { createApi } from '@reduxjs/toolkit/query/react'
import { fetchBaseQuery } from '@reduxjs/toolkit/query'

export default createApi({
  reducerPath: 'gamerParadiseReducer',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NODE_ENV === 'prod' ? 'localhost' : 'https://nkzm8lae6c.execute-api.us-west-1.amazonaws.com/devo'
  }),
  endpoints: () => ({})
})
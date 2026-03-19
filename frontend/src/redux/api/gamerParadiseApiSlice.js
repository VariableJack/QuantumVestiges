import { createApi } from '@reduxjs/toolkit/query/react'
import { fetchBaseQuery } from '@reduxjs/toolkit/query'


export default createApi({
  reducerPath: 'gamerParadiseReducer',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://g5h5nfv4fa.execute-api.us-west-1.amazonaws.com/devo'
  }),
  endpoints: () => ({})
})
import { configureStore } from '@reduxjs/toolkit'
import gamerParadiseApiSlice from './gamerParadiseApiSlice'
import userReducer from './userSlice'
import globalReducer from './globalSlice'
import requestsReducer from '../../features/Requests/api/requestsSlice'

export const store = configureStore({
    reducer: {
        [gamerParadiseApiSlice.reducerPath]: gamerParadiseApiSlice.reducer,
        [globalReducer.name]: globalReducer.reducer,
        [userReducer.name]: userReducer.reducer,
        [requestsReducer.name]: requestsReducer.reducer,
    },
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware().concat(gamerParadiseApiSlice.middleware),
})

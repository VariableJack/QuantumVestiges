import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import gamerParadiseApiSlice from './gamerParadiseApiSlice'
import userReducer from './userSlice'
import globalReducer from './globalSlice'

export const store = configureStore({
    reducer: {
        [gamerParadiseApiSlice.reducerPath]: gamerParadiseApiSlice.reducer,
        [globalReducer.name]: globalReducer.reducer,
        userReducer: userReducer,
    },
    middleware:
        (getDefaultMiddleware) =>
            getDefaultMiddleware().concat(gamerParadiseApiSlice.middleware)
})
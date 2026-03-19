import { useDispatch } from 'react-redux'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

const initialState = {
    username: undefined,
    error: null,
}

const mediaSlice = createSlice({
    name: 'mediaReducer',
    initialState,
    reducers: {
        setUsername: (state, action: PayloadAction<string>) => {
            state.username = action.username
        },
        clearUsername: state => {
            state.username = undefined
        },
        setError: (state, action: PayloadAction<any>) => {
            state.error = error
        },
        clearError: state => {
            state.error = null
        },
    },
})

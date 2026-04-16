import { createSlice, PayloadAction } from '@reduxjs/toolkit'

const initialState = {
    supportRequests: [],
    bugReports: [],
    threads: [],
}

const requestsSlice = createSlice({
    name: 'requestsReducer',
    initialState,
    reducers: {
        setSupportRequests: (state, action) => {
            state.supportRequests = [...action.payload]
        },
        setBugRequests: (state, action) => {
            state.supportRequests = [...action.payload]
        },
    },
})

const { setSupportRequests, setBugRequests } = requestsSlice.actions
export { setSupportRequests, setBugRequests }
export default requestsSlice

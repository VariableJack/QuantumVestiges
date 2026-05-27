import { createSlice, PayloadAction } from '@reduxjs/toolkit'

const initialState = {
    supportRequests: [],
    bugReports: [],
    discussionThreads: [],
}

const requestsSlice = createSlice({
    name: 'requestsReducer',
    initialState,
    reducers: {
        setSupportRequests: (state, action) => {
            state.supportRequests = [...action.payload]
        },
        setBugReports: (state, action) => {
            state.supportRequests = [...action.payload]
        },
        setDiscussionThreads: (state, action) => {
            state.discussionThreads = [...action.payload]
        },
    },
})

const { setSupportRequests, setBugReports, setDiscussionThreads } = requestsSlice.actions
export { setSupportRequests, setBugReports, setDiscussionThreads }
export default requestsSlice

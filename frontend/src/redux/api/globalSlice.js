import { createSlice, PayloadAction } from '@reduxjs/toolkit'

const initialState = {
    franchises: [],
    successMessages: [],
    infoMessages: [],
    errorMessages: [],
}

const globalSlice = createSlice({
    name: 'globalReducer',
    reducerPath: 'globalReducer',
    initialState,
    reducers: {
        setFranchises: (state, action) => {
            state.franchises = [...action.payload]
        },
        addSuccessMessage: (state, action) => {
            state.successMessages.push({ ...action.payload })
        },
        removeSuccessMessage: (state, action) => {
            state.successMessages = state.successMessages.filter(
                successMessage => successMessage.id === action.payload.id,
            )
        },
        addInfoMessage: (state, action) => {
            state.infoMessages.push({ ...action.payload })
        },
        removeInfoMessage: (state, action) => {
            state.infoMessages = state.infoMessages.filter(
                infoMessage => infoMessage.id === action.payload.id,
            )
        },
        addErrorMessage: (state, action) => {
            state.errorMessages.push({ ...action.payload })
        },
        removeErrorMessage: (state, action) => {
            state.errorMessages = state.errorMessages.filter(
                errorMessage => errorMessage.id === action.payload.id,
            )
        },
        clearAllMessages: state => {
            state.successMessages = []
            state.infoMessages = []
            state.errorMessages = []
        },
    },
})

const {
    setFranchises,
    addSuccessMessage,
    removeSuccessMessage,
    addInfoMessage,
    removeInfoMessage,
    addErrorMessage,
    removeErrorMessage,
    clearAllMessages,
} = globalSlice.actions
export {
    setFranchises,
    addSuccessMessage,
    removeSuccessMessage,
    addInfoMessage,
    removeInfoMessage,
    addErrorMessage,
    removeErrorMessage,
    clearAllMessages,
}
export default globalSlice

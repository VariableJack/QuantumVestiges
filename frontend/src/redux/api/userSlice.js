import {
    CognitoIdentityProviderClient,
    InitiateAuthCommand,
    SignUpCommand,
    ConfirmSignUpCommand,
} from '@aws-sdk/client-cognito-identity-provider'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import config from '../../configurations/config.json'
import { getUserPoolId } from '../../shared/utils'

const initialState = {
    username: undefined,
    group: '',
    order: {
        items: [],
    },
    purchasedItems: [],
    error: null,
    preferences: [],
    subscriptions: [],
}

const userSlice = createSlice({
    name: 'userReducer',
    initialState,
    reducers: {
        setUsername: (state, action) => {
            state.username = action.payload
        },
        clearUsername: state => {
            state.username = undefined
        },
        setGroup: (state, action) => {
            state.group = action.payload
        },
        clearGroup: state => {
            state.group = ''
        },
        setOrder: (state, action) => {
            state.order = { ...action.payload }
        },
        clearOrder: state => {
            state.order = {}
        },
        setPurchasedItems: (state, action) => {
            state.purchasedItems = [...action.payload]
        },
        clearPurchasedGames: state => {
            state.purchasedItems = []
        },
        setError: (state, action) => {
            state.error = action.payload
        },
        clearError: state => {
            state.error = null
        },
        setPreferences: (state, action) => {
            state.preferences = [...action.payload]
        },
        setSubscriptions: (state, action) => {
            state.subscriptions = [...action.payload]
        },
        clearPreferences: state => {
            state.preferences = []
        },
        clearSubscriptions: state => {
            state.subscriptions = []
        },
    },
})

const {
    setUsername,
    clearUsername,
    setGroup,
    clearGroup,
    setOrder,
    clearOrder,
    setPurchasedItems,
    clearPurchasedGames,
    setError,
    clearError,
    setPreferences,
    setSubscriptions,
    clearPreferences,
    clearSubscriptions,
} = userSlice.actions
export {
    setUsername,
    clearUsername,
    setGroup,
    clearGroup,
    setOrder,
    clearOrder,
    setPurchasedItems,
    clearPurchasedGames,
    setError,
    clearError,
    setPreferences,
    setSubscriptions,
    clearPreferences,
    clearSubscriptions,
}
export default userSlice

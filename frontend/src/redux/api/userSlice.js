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
    orderHistory: [],
    purchasedItems: [],
    preferences: { notifications: [] },
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
            state.order = { items: [] }
        },
        setOrderHistory: (state, action) => {
            state.orderHistory = [...action.payload]
        },
        clearOrderHistory: state => {
            state.orderHistory = []
        },
        setPurchasedItems: (state, action) => {
            state.purchasedItems = [...action.payload]
        },
        clearPurchasedItems: state => {
            state.purchasedItems = []
        },
        setPreferences: (state, action) => {
            state.preferences = { ...action.payload }
        },
        clearPreferences: state => {
            state.preferences = { notifications: [] }
        },
        setSubscriptions: (state, action) => {
            state.subscriptions = [...action.payload]
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
    setOrderHistory,
    clearOrderHistory,
    setPurchasedItems,
    clearPurchasedItems,
    setPreferences,
    clearPreferences,
    setSubscriptions,
    clearSubscriptions,
} = userSlice.actions
export {
    setUsername,
    clearUsername,
    setGroup,
    clearGroup,
    setOrder,
    clearOrder,
    setOrderHistory,
    clearOrderHistory,
    setPurchasedItems,
    clearPurchasedItems,
    setPreferences,
    setSubscriptions,
    clearPreferences,
    clearSubscriptions,
}
export default userSlice

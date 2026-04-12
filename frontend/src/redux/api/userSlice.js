import {
    CognitoIdentityProviderClient,
    InitiateAuthCommand,
    SignUpCommand,
    ConfirmSignUpCommand,
} from '@aws-sdk/client-cognito-identity-provider'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import config from '../../configurations/config.json'
import { getUserPoolId } from '../../shared/utils/getConfiguration'

const initialState = {
    username: undefined,
    group: undefined,
    cart: [],
    purchasedGames: [],
    error: null,
}

const userViewSlice = createSlice({
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
            state.group = undefined
        },
        setCart: (state, action) => {
            state.cart = [...action.payload]
        },
        clearCart: state => {
            state.cart = []
        },
        setPurchasedGames: (state, action) => {
            state.purchasedGames = [...action.payload]
        },
        clearPurchasedGames: state => {
            state.purchasedGames = []
        },
        setError: (state, action) => {
            state.error = action.payload
        },
        clearError: state => {
            state.error = null
        },
    },
})

const {
    setUsername,
    clearUsername,
    setGroup,
    clearGroup,
    setCart,
    clearCart,
    setPurchasedGames,
    clearPurchasedGames,
    setError,
    clearError,
} = userViewSlice.actions
export {
    setUsername,
    clearUsername,
    setGroup,
    clearGroup,
    setCart,
    clearCart,
    setPurchasedGames,
    clearPurchasedGames,
    setError,
    clearError,
}
export default userViewSlice.reducer

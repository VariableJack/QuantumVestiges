import { CognitoIdentityProviderClient, InitiateAuthCommand, SignUpCommand, ConfirmSignUpCommand } from '@aws-sdk/client-cognito-identity-provider'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import config from '../../configurations/config.json'
import {
    getUserPoolId
} from '../../shared/utils/getConfiguration'

const initialState = {
  username: undefined,
  error: null,
}

const userViewSlice = createSlice({
    name: 'userReducer',
    initialState,
    reducers: {
      setUsername: (state, action: PayloadAction<string>) => {
          state.username = action.payload;
      },
      clearUsername: (state) => {
          state.username = undefined;
      },
      setError: (state, action: PayloadAction<any>) => {
          state.error = action.payload;
      },
      clearError: (state) => {
          state.error = null;
      },
    }
})

const {
    setUsername,
    clearUsername,
    setError,
    clearError,
} = userViewSlice.actions
export {
    setUsername,
    clearUsername,
    setError,
    clearError,
}
export default userViewSlice.reducer
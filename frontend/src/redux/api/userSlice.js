import { CognitoIdentityProviderClient, InitiateAuthCommand, SignUpCommand, ConfirmSignUpCommand } from '@aws-sdk/client-cognito-identity-provider'
import { useDispatch } from 'react-redux'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import gamerParadiseApiSlice from './gamerParadiseApiSlice'

const configFile = process.env.NODE_ENV === 'prod' ? 'prod-config.json' : 'devo-config.json'

import config from '../../configurations/devo-config.json'

const initialState = {
  username: undefined,
  error: null,
}

const userViewSlice = createSlice({
    name: 'userReducer',
    initialState,
    reducers: {
      setUsername: (state, action: PayloadAction<string>) => {
          state.username = action.username;
      },
      clearUsername: (state) => {
          state.username = undefined;
      },
      setError: (state, action: PayloadAction<any>) => {
          state.error = error;
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

// Integration with Cognito to log in and out
const cognitoClient = new CognitoIdentityProviderClient({
  region: config.region,
});
const login = async (username: string, password: string) => {
    const dispatch = useDispatch();
    dispatch(clearError());
    try {
	    const command = new InitiateAuthCommand({
            AuthFlow: 'USER_PASSWORD_AUTH',
            ClientId: config.clientId,
            AuthParameters: {
                USERNAME: username,
                PASSWORD: password,
            },
        });
        const { AuthenticationResult } = await cognitoClient.send(command);
        if (AuthenticationResult) {
            sessionStorage.setItem('idToken', AuthenticationResult.IdToken || '');
            sessionStorage.setItem('accessToken', AuthenticationResult.AccessToken || '');
            sessionStorage.setItem('refreshToken', AuthenticationResult.RefreshToken || '');
            dispatch(setUsername(username));
            return AuthenticationResult;
        }
    } catch (error) {
        dispatch(setError(error));
    }
}

const logout = () => {
    sessionStorage.setItem('idToken', '');
    sessionStorage.setItem('accessToken', '');
    sessionStorage.setItem('refreshToken', '');
}

const signup = async (email: string, username: string, password: string) => {
    const dispatch = useDispatch();
    dispatch(clearError());
    try {
        const command = new SignUpCommand({
            Username: username,
            Password: password,
            UserAttributes: [
                {
                    Name: 'email',
                    Value: email,
                },
            ],
        });
        const response = await cognitoClient.send(command);
        dispatch(setUsername(username));
        return response;
    } catch (error) {
        dispatch(setError(error));
    }
}

export {
    setUsername,
    clearUsername,
    setError,
    clearError,
    login,
	logout,
	signup,
}
export default userViewSlice.reducer
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { get } from 'lodash'
import {
    setUsername,
    clearUsername,
} from '../../redux/api/userSlice'


import { useAuth } from "react-oidc-context";

const Login = () => {
    const { username } = useSelector((state) => state.userReducer)
    const dispatch = useDispatch()
    const auth = useAuth();
    useEffect(() => {
        if (auth.isAuthenticated) {
            dispatch(setUsername(auth.user?.profile['cognito:username']))
        }
    }, [auth])

    if (auth.isLoading) {
        return <div>Loading...</div>;
    }

    if (auth.error) {
        return <div>Encountering error... {auth.error.message}</div>;
    }

    if (username) {
        return (
            <div>
            <pre> Hello: {username} </pre>
            <button onClick={() => {
                auth.removeUser()
                dispatch(clearUsername())
            }}>Sign out</button>
            </div>
        );
    } else {
        return (
            <div>
                <button onClick={() => auth.signinRedirect()}>Sign in</button>
            </div>
        )
    }
}

export default Login;
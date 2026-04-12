import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { get } from 'lodash'
import {
    clearUsername,
    clearGroup,
    clearPurchasedGames,
    clearCart,
} from '../../redux/api/userSlice'

import { useUpdateCartMutation, useCheckoutCartMutation } from '../../redux/api/mediaEndpoints'
const Account = props => {
    const { username, cart, purchasedGames } = useSelector(state => state.userReducer)
    const { auth } = props

    const [updateCart, { isLoading: isUpdating }] = useUpdateCartMutation()
    const [checkoutCart, { isLoading: isCheckingOut }] = useCheckoutCartMutation()
    if (auth.isLoading) {
        return <div>Loading...</div>
    }

    if (auth.error) {
        return <div>Encountering error... {auth.error.message}</div>
    }
    if (username) {
        return (
            <div>
                <pre> Hello: {username} </pre>
                Cart
                {cart.map(item => (
                    <div>
                        {item.franchiseName} || {item.gameName}
                        <br />
                        {(!isUpdating && (
                            <button
                                onClick={() => {
                                    updateCart({ action: 'remove', gameId: item.gameId })
                                }}
                            >
                                Remove from Cart
                            </button>
                        )) || <b>Removing from cart...</b>}
                    </div>
                ))}
                <br />
                {
                    (!isCheckingOut && <button onClick={checkoutCart}>Checkout cart</button>) || (
                        <b>Checking out...</b>
                    )
                    // TODO - integrate payment processing here
                }
                <br />
                Games you own
                <br />
                {purchasedGames.map(item => (
                    <div>
                        {item.franchiseName} || {item.gameName}
                        <br />
                    </div>
                ))}
                <button
                    onClick={() => {
                        auth.removeUser()
                        dispatch(clearUsername())
                        dispatch(clearGroup())
                        localStorage.setItem('accessToken', '')
                        dispatch(clearPurchasedGames())
                        dispatch(clearCart())
                    }}
                >
                    Sign out
                </button>
            </div>
        )
    }
    return (
        <div>
            <button onClick={() => auth.signinRedirect()}>Sign in</button>
        </div>
    )
}

export default Account

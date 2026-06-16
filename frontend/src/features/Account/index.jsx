import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { get, set } from 'lodash'
import {
    clearUsername,
    clearGroup,
    clearPurchasedGames,
    clearCart,
} from '../../redux/api/userSlice'

import { useUpdateCartMutation, useCheckoutCartMutation } from '../../redux/api/mediaEndpoints'
import { EULA, Modal, Toggle, TOS } from '../../shared/components'
import { getConfig } from '../../shared/utils'

import '../../styles/App.css'

const Account = props => {
    const { username, cart, purchasedGames } = useSelector(state => state.userReducer)
    const { auth } = props
    const dispatch = useDispatch()

    const [updateCart, { isLoading: isUpdating }] = useUpdateCartMutation()
    const [checkoutCart, { isLoading: isCheckingOut }] = useCheckoutCartMutation()
    const [areCheckboxesChecked, setAreCheckboxesChecked] = useState({
        privacyPolicy: false,
        tos: false,
    })
    const [showModal, setShowModal] = useState({
        privacyPolicy: false,
        tos: false,
    })
    const [submitAgreement, setSubmitAgreement] = useState(false)
    const [pageState, setPageState] = useState({
        id: 'login',
        title: 'Logging in?',
        disabled: false,
    })

    useEffect(() => {
        if (submitAgreement && areCheckboxesChecked.privacyPolicy && areCheckboxesChecked.tos)
            auth.signinRedirect()
    }, [submitAgreement])
    const handleTabChange = item => {
        set(
            auth,
            ['settings', 'metadata', 'authorization_endpoint'],
            `https://${getConfig('cognitoDomain')}/${item.id}`,
        )
        setAreCheckboxesChecked({
            privacyPolicy: false,
            tos: false,
        })
        setSubmitAgreement(false)
        setPageState(item)
    }
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
    const generateSpecificCheckbox = type => {
        return
    }
    return (
        <div>
            {(pageState.id === 'login' && (
                <div>
                    <h2>Welcome! Please sign in to view your account</h2>
                    <button className="account" onClick={() => auth.signinRedirect()}>
                        Sign in
                    </button>
                </div>
            )) || (
                <div>
                    <h2>
                        By creating an account with us, you agree to our Privacy Policy and our TOS.
                        Please review and confirm
                    </h2>
                    <span
                        onClick={() => {
                            const setValue = !(
                                areCheckboxesChecked.privacyPolicy && areCheckboxesChecked.tos
                            )
                            setAreCheckboxesChecked({
                                privacyPolicy: setValue,
                                tos: setValue,
                            })
                            setSubmitAgreement(false)
                        }}
                    >
                        <div className="checkbox-border p-n mh-xs mv-n d-i">
                            <input
                                className="p-n m-n"
                                type="checkbox"
                                checked={
                                    areCheckboxesChecked.privacyPolicy && areCheckboxesChecked.tos
                                }
                                onChange={() => {
                                    //No-op, onChange only provided to stop console warnings for type="checkbox"
                                }}
                            />
                        </div>
                        <label>Agree to all</label>
                    </span>
                    <span
                        onClick={() => {
                            setAreCheckboxesChecked({
                                ...areCheckboxesChecked,
                                privacyPolicy: !get(areCheckboxesChecked, 'privacyPolicy'),
                            })
                            setSubmitAgreement(false)
                        }}
                    >
                        <div
                            className={`checkbox-border${(!get(areCheckboxesChecked, 'privacyPolicy') && submitAgreement && '-error') || ''} p-n mh-xs mv-n d-i`}
                        >
                            <input
                                className="p-n m-n"
                                type="checkbox"
                                checked={get(areCheckboxesChecked, 'privacyPolicy')}
                                onChange={() => {
                                    //No-op, onChange only provided to stop console warnings for type="checkbox"
                                }}
                            />
                        </div>
                        <b className="required">*</b>
                        <label>Agree to Privacy Policy</label>
                    </span>
                    <span
                        onClick={() => {
                            setAreCheckboxesChecked({
                                ...areCheckboxesChecked,
                                tos: !get(areCheckboxesChecked, 'tos'),
                            })
                            setSubmitAgreement(false)
                        }}
                    >
                        <div
                            className={`checkbox-border${(!get(areCheckboxesChecked, 'tos') && submitAgreement && '-error') || ''} p-n mh-xs mv-n d-i`}
                        >
                            <input
                                className="p-n m-n"
                                type="checkbox"
                                checked={get(areCheckboxesChecked, 'tos')}
                                onChange={() => {
                                    //No-op, onChange only provided to stop console warnings for type="checkbox"
                                }}
                            />
                        </div>
                        <b className="required">*</b>
                        <label>Agree to ToS</label>
                    </span>
                    <br />
                    <button
                        onClick={() => {
                            setSubmitAgreement(true)
                        }}
                        className="account"
                    >
                        Go to account creation
                    </button>
                </div>
            )}
            <Toggle
                items={[
                    { id: 'login', title: 'Logging in?', disabled: false },
                    { id: 'signup', title: 'Creating an account?', disabled: false },
                ]}
                selectedItem={pageState}
                onChange={item => handleTabChange(item)}
            />
        </div>
    )
}

export default Account

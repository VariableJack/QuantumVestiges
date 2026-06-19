import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { get, set } from 'lodash'
import {
    clearUsername,
    clearGroup,
    clearPurchasedGames,
    clearCart,
    setPreferences,
    setSubscriptions,
    clearPreferences,
    clearSubscriptions,
} from '../../redux/api/userSlice'
import {
    addSuccessMessage,
    addInfoMessage,
    removeInfoMessage,
    addErrorMessage,
} from '../../redux/api/globalSlice'

import { useUpdateCartMutation, useCheckoutCartMutation } from '../../redux/api/mediaEndpoints'
import {
    useLazyGetSettingsQuery,
    useUpdateNotificationPreferencesMutation,
} from '../../redux/api/accountEndpoints'

import { Toggle } from '../../shared/components'
import { CONNECTION_ERROR_MESSAGE } from '../../shared/constants'
import { getConfig } from '../../shared/utils'

import '../../styles/App.css'

const Login = props => {
    const { auth, submitAgreement, setSubmitAgreement, pageState, setPageState, handleTabChange } =
        props
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

const Account = props => {
    const { username, cart, purchasedGames } = useSelector(state => state.userReducer)
    const { auth } = props
    const dispatch = useDispatch()

    const [
        updateOrder,
        {
            isLoading: updateOrderIsUpdating,
            isSuccess: updateOrderIsSuccess,
            isError: updateOrderIsError,
            error: updateOrderError,
        },
    ] = useUpdateCartMutation()
    const [
        checkoutCart,
        {
            isLoading: checkoutCartIsLoading,
            isSuccess: checkoutCartIsSuccess,
            isError: checkoutCartIsError,
            error: checkoutCartError,
        },
    ] = useCheckoutCartMutation()
    const [
        triggerGetSettings,
        { isLoading: getSettingsIsLoading, isError: getSettingsIsError, error: getSettingsError },
    ] = useLazyGetSettingsQuery()
    const [
        updateNotificationPreferences,
        {
            isLoading: updateNotificationPreferencesIsUpdating,
            isSuccess: updateNotificationPreferencesIsSuccess,
            isError: updateNotificationPreferencesIsError,
            error: updateNotificationPreferencesError,
        },
    ] = useUpdateNotificationPreferencesMutation()
    const [areCheckboxesChecked, setAreCheckboxesChecked] = useState({
        privacyPolicy: false,
        tos: false,
    })
    const [submitAgreement, setSubmitAgreement] = useState(false)
    const [pageState, setPageState] = useState({
        id: 'login',
        title: 'Logging in?',
        disabled: false,
    })

    const [lastProductRemoved, setLastProductRemoved] = useState({
        productId: -1,
        productName: '',
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
    useEffect(() => {
        if (auth.isAuthenticated) {
            triggerGetSettings()
        }
    }, [auth])
    useEffect(() => {
        const messageId = `updateOrderInfo-remove-${lastProductRemoved.productId}`
        if (updateOrderIsUpdating) {
            dispatch(
                addInfoMessage({
                    title: 'Updating cart...',
                    description: 'Please wait as the system removes the item from your cart',
                    id: messageId,
                }),
            )
        } else {
            dispatch(removeInfoMessage(messageId))
        }
    }, [updateOrderIsUpdating])
    useEffect(() => {
        if (updateOrderIsError) {
            dispatch(
                addErrorMessage({
                    title: 'Failed to remove item from your cart',
                    description: get(
                        updateNotificationPreferencesError,
                        'data.error',
                        CONNECTION_ERROR_MESSAGE,
                    ),
                    id: `updateOrderError-remove-${lastProductRemoved.productId}`,
                }),
            )
        }
    }, [updateOrderIsError])
    useEffect(() => {
        if (updateOrderIsSuccess) {
            dispatch(
                addSuccessMessage({
                    title: 'Item successfully removed',
                    description: 'The system has successfully removed the item from your cart',
                    id: `updateOrderError-remove-${lastProductRemoved.productId}`,
                }),
            )
        }
    }, [updateOrderIsSuccess])

    useEffect(() => {
        const messageId = 'checkoutCartInfo'
        if (updateOrderIsUpdating) {
            dispatch(
                addInfoMessage({
                    title: 'Checking out cart...',
                    description: 'Please wait as the system checks out your cart',
                    id: messageId,
                }),
            )
        } else {
            dispatch(removeInfoMessage(messageId))
        }
    }, [updateOrderIsUpdating])
    useEffect(() => {
        if (updateOrderIsError) {
            dispatch(
                addErrorMessage({
                    title: 'Failed to check out your cart',
                    description: get(
                        updateNotificationPreferencesError,
                        'data.error',
                        CONNECTION_ERROR_MESSAGE,
                    ),
                    id: 'checkoutCartError',
                }),
            )
        }
    }, [updateOrderIsError])
    useEffect(() => {
        if (updateOrderIsSuccess) {
            dispatch(
                addSuccessMessage({
                    title: 'Successfully checked out your cart',
                    description:
                        'Your cart has been successfully checked out and all items should now be added to your account',
                    id: 'checkoutCartSuccess',
                }),
            )
        }
    }, [updateOrderIsSuccess])

    useEffect(() => {
        const messageId = 'updateNotificationPreferencesInfo'
        if (updateOrderIsUpdating) {
            dispatch(
                addInfoMessage({
                    title: 'Updating Notification Preferences',
                    description: 'Please wait as the system updates your notification preferences',
                    id: messageId,
                }),
            )
        } else {
            dispatch(removeInfoMessage(messageId))
        }
    }, [updateNotificationPreferencesIsUpdating])
    useEffect(() => {
        if (updateNotificationPreferencesIsError) {
            dispatch(
                addErrorMessage({
                    title: 'Failed to update Notification Preferences',
                    description: get(
                        updateNotificationPreferencesError,
                        'data.error',
                        CONNECTION_ERROR_MESSAGE,
                    ),
                    id: 'updateNotificationPreferencesError',
                }),
            )
        }
    }, [updateNotificationPreferencesIsError])
    useEffect(() => {
        if (updateNotificationPreferencesIsSuccess) {
            dispatch(
                addSuccessMessage({
                    title: 'Successfully updated Notification Preferences',
                    description: 'Your Notification Preferences have been successfully updated',
                    id: 'updateNotificationPreferencesSuccess',
                }),
            )
        }
    }, [updateNotificationPreferencesIsSuccess])

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
                        {(!updateOrderIsUpdating && (
                            <button
                                onClick={() => {
                                    updateOrder({ action: 'remove', productId: item.productId })
                                    setLastProductRemoved({
                                        productId: item.productId,
                                        productName: item.productName,
                                    })
                                }}
                            >
                                Remove from Cart
                            </button>
                        )) || <b>Removing from cart...</b>}
                    </div>
                ))}
                <br />
                {
                    (!checkoutCartIsLoading && (
                        <button onClick={checkoutCart}>Checkout cart</button>
                    )) || <b>Checking out...</b>
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
                        dispatch(clearPreferences())
                        dispatch(clearSubscriptions())
                    }}
                >
                    Sign out
                </button>
            </div>
        )
    }

    return (
        <Login
            auth={auth}
            areCheckboxesChecked={areCheckboxesChecked}
            setAreCheckboxesChecked={setAreCheckboxesChecked}
            submitAgreement={submitAgreement}
            setSubmitAgreement={setSubmitAgreement}
            pageState={pageState}
            setPageState={setPageState}
            handleTabChange={handleTabChange}
        />
    )
}

export default Account

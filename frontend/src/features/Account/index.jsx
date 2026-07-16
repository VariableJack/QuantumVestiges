import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { get, set } from 'lodash'
import {
    clearUsername,
    clearGroup,
    clearPurchasedGames,
    clearOrder,
    setPurchasedItems,
    setOrder,
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

import { useUpdateOrderMutation, useCheckoutOrderMutation } from '../../redux/api/mediaEndpoints'
import {
    useLazyGetSettingsQuery,
    useUpdateNotificationPreferencesMutation,
} from '../../redux/api/accountEndpoints'

import { Toggle } from '../../shared/components'
import { ACCOUNT_MESSAGE_TYPES, ACCOUNT_MESSAGES } from '../../shared/constants'
import { getConfig, createFlashbarMessages } from '../../shared/utils'

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
    const { username, order, purchasedItems } = useSelector(state => state.userReducer)
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
    ] = useUpdateOrderMutation()
    const [
        checkoutOrder,
        {
            isLoading: checkoutOrderIsLoading,
            isSuccess: checkoutOrderIsSuccess,
            isError: checkoutOrderIsError,
            error: checkoutOrderError,
        },
    ] = useCheckoutOrderMutation()
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
            triggerGetOrderHistory()
        }
    }, [auth])

    const isLoadingArray = [
        {
            isLoading: updateOrderIsUpdating,
            ...ACCOUNT_MESSAGES[ACCOUNT_MESSAGE_TYPES.REMOVE_FROM_LOADING],
            id: `updateOrder-remove-${lastProductRemoved.productId}`,
        },
        {
            isLoading: checkoutOrderIsLoading,
            ...ACCOUNT_MESSAGES[ACCOUNT_MESSAGE_TYPES.CHECKOUT_CART_LOADING],
            id: 'checkoutOrderFetch',
        },
        {
            isLoading: updateNotificationPreferencesIsUpdating,
            ...ACCOUNT_MESSAGES[ACCOUNT_MESSAGE_TYPES.NOTIFICATION_UPDATE_LOADING],
            id: 'updateNotificationPreferences',
        },
        {
            isLoading: getSettingsIsLoading,
            ...ACCOUNT_MESSAGES[ACCOUNT_MESSAGE_TYPES.ACCOUNT_LOADING],
            id: 'getAccountDetailsFetch',
        },
    ]
    const isErrorArray = [
        {
            isError: updateOrderIsError,
            title: ACCOUNT_MESSAGES[ACCOUNT_MESSAGE_TYPES.REMOVE_FROM_ERROR].title,
            error: updateOrderError,
            id: `updateOrderError-remove-${lastProductRemoved.productId}`,
        },
        {
            isError: checkoutOrderIsError,
            title: ACCOUNT_MESSAGES[ACCOUNT_MESSAGE_TYPES.CHECKOUT_CART_ERROR].title,
            error: checkoutOrderError,
            id: 'checkoutOrderError',
        },
        {
            isError: updateNotificationPreferencesIsError,
            title: ACCOUNT_MESSAGES[ACCOUNT_MESSAGE_TYPES.NOTIFICATION_UPDATE_ERROR].title,
            error: updateNotificationPreferencesError,
            id: 'updateNotificationPreferencesError',
        },
        {
            isError: getSettingsIsError,
            title: ACCOUNT_MESSAGES[ACCOUNT_MESSAGE_TYPES.ACCOUNT_LOADING_ERROR].title,
            error: getSettingsError,
            id: 'getAccountDetailsError',
        },
    ]
    const isSuccessArray = [
        {
            isSuccess: updateOrderIsSuccess,
            ...ACCOUNT_MESSAGES[ACCOUNT_MESSAGE_TYPES.REMOVE_FROM_SUCCESS],
            id: `updateOrderSuccess-remove-${lastProductRemoved.productId}`,
        },
        {
            isSuccess: checkoutOrderIsSuccess,
            ...ACCOUNT_MESSAGES[ACCOUNT_MESSAGE_TYPES.CHECKOUT_CART_SUCCESS],
            id: 'checkoutOrderSuccess',
        },
        {
            isSuccess: updateNotificationPreferencesIsSuccess,
            ...ACCOUNT_MESSAGES[ACCOUNT_MESSAGE_TYPES.NOTIFICATION_UPDATE_SUCCESS],
            id: 'updateNotificationPreferencesSuccess',
        },
    ]
    createFlashbarMessages({ isLoadingArray, isErrorArray, isSuccessArray, dispatch })
    useEffect(() => {
        if (checkoutOrderIsSuccess) {
            dispatch(
                setPurchasedItems([
                    ...purchasedItems,
                    ...order.items.map(({ franchiseName, productId, productName }) => ({
                        franchiseName,
                        productId,
                        productName,
                    })),
                ]),
            )
            dispatch(setOrder({ items: [] }))
        }
    }, [checkoutOrderIsSuccess])

    const removeItem = async input => {
        try {
            await updateOrder(input)
            setLastProductRemoved({
                productId: item.productId,
                productName: item.productName,
            })
            dispatch(
                setOrder({
                    ...order,
                    items: order.items.filter(orderItem => orderItem.productId !== item.productId),
                }),
            )
        } catch (e) {}
    }
    const handleRemove = input => {
        removeItem(input)
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
                Order
                {get(order, 'items', []).map(item => (
                    <div>
                        {item.franchiseName} || {item.productName}
                        <br />
                        {(!updateOrderIsUpdating && (
                            <button
                                onClick={() => {
                                    handleRemove({ action: 'remove', productId: item.productId })
                                }}
                            >
                                Remove from Order
                            </button>
                        )) || <b>Removing from order...</b>}
                    </div>
                ))}
                <br />
                {
                    (!order.items.length && <></>) ||
                        (!checkoutOrderIsLoading && (
                            <button onClick={checkoutOrder}>Checkout order</button>
                        )) || <b>Checking out...</b>
                    // TODO - integrate payment processing here
                }
                <br />
                Games you own
                <br />
                {purchasedItems.map(item => (
                    <div>
                        <a href={`/franchise?franchiseId=${item.franchiseId}`}>
                            {item.franchiseName}
                        </a>{' '}
                        || <a href={`/product?productId=${item.productId}`}>{item.productName}</a>
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
                        dispatch(clearOrder())
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

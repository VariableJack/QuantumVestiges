import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { get, set } from 'lodash'
import {
    clearUsername,
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
} from '../../redux/api/userSlice'

import { useUpdateOrderMutation, useCheckoutOrderMutation } from '../../redux/api/mediaEndpoints'
import {
    useLazyGetAccountDetailsQuery,
    useLazyGetOrderHistoryQuery,
    useUpdateNotificationPreferencesMutation,
} from '../../redux/api/accountEndpoints'

import { RadioGroup, Toggle } from '../../shared/components'
import { ACCOUNT_MESSAGE_TYPES, ACCOUNT_MESSAGES } from '../../shared/constants'
import { getConfig, createFlashbarMessages, formatTimestamp } from '../../shared/utils'

import '../../styles/App.css'

const Login = props => {
    const {
        auth,
        areCheckboxesChecked,
        setAreCheckboxesChecked,
        submitAgreement,
        setSubmitAgreement,
        pageState,
        setPageState,
        handleTabChange,
    } = props
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
                        By creating an account with us, you agree to our{' '}
                        <a href={`${getConfig('assetsS3Bucket')}PrivacyPolicy.pdf`}>
                            Privacy Policy
                        </a>{' '}
                        and our <a href={`${getConfig('assetsS3Bucket')}ToS.pdf`}>TOS</a>. Please
                        review and confirm
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
    const { username, order, orderHistory, purchasedItems, preferences } = useSelector(
        state => state.userReducer,
    )
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
        triggerGetAccountDetails,
        {
            isLoading: getAccountDetailsIsLoading,
            isError: getAccountDetailsIsError,
            error: getAccountDetailsError,
        },
    ] = useLazyGetAccountDetailsQuery()
    const [
        triggerGetOrderHistory,
        {
            isLoading: getOrderHistoryIsLoading,
            isError: getOrderHistoryIsError,
            error: getOrderHistoryError,
        },
    ] = useLazyGetOrderHistoryQuery()
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
    const getAccountDetails = async () => {
        try {
            const accountDetails = await triggerGetAccountDetails().unwrap()
            dispatch(
                setPreferences({ ...preferences, notifications: accountDetails.notifications }),
            )
            dispatch(setSubscriptions(accountDetails.subscriptions))
        } catch (e) {}
    }
    const getOrderHistory = async () => {
        try {
            const orderHistory = await triggerGetOrderHistory().unwrap()
            dispatch(setOrderHistory(orderHistory))
        } catch (e) {}
    }
    const handlePreferenceChange = item => {
        dispatch(
            setPreferences({
                ...preferences,
                notifications: preferences.notifications.map(notificationPreference => {
                    if (notificationPreference.notificationType === item.subId)
                        return {
                            ...notificationPreference,
                            isEnabled: !notificationPreference.isEnabled,
                        }
                    else return notificationPreference
                }),
            }),
        )
    }
    const handlePreferenceSave = async () => {
        updateNotificationPreferences({
            notifications: preferences.notifications,
        })
    }
    useEffect(() => {
        if (auth.isAuthenticated) {
            getAccountDetails()
            getOrderHistory()
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
            isLoading: getAccountDetailsIsLoading || getOrderHistoryIsLoading,
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
            isError: getAccountDetailsIsError || getOrderHistoryIsError,
            title: ACCOUNT_MESSAGES[ACCOUNT_MESSAGE_TYPES.ACCOUNT_LOADING_ERROR].title,
            error: getAccountDetailsIsError ? getAccountDetailsError : getOrderHistoryError,
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
            dispatch(clearOrder())
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
                <h1> Welcome back, {username} !</h1>
                <span style={{ width: '50%' }} className="f-l">
                    <h2>Your library</h2>
                    {(!purchasedItems.length &&
                        '...is empty! Please consider shopping around at your leisure.') ||
                        ''}
                    {purchasedItems.map(item => (
                        <div>
                            <a href={`/franchise?franchiseId=${item.franchiseId}`}>
                                {item.franchiseName}
                            </a>{' '}
                            ||{' '}
                            <a href={`/product?productId=${item.productId}`}>{item.productName}</a>
                            <br />
                        </div>
                    ))}
                    {(order.items.length && (
                        <>
                            <h2>Your current Order</h2>
                            {order.items.map(item => (
                                <div>
                                    <>
                                        <span style={{ width: '50%' }} className="f-l">
                                            <a href={`/franchise?franchiseId=${item.franchiseId}`}>
                                                {item.franchiseName}
                                            </a>{' '}
                                            ||{' '}
                                            <a href={`/product?productId=${item.productId}`}>
                                                {item.productName}
                                            </a>
                                            {(item.quantity > 1 &&
                                                ` - quantity ${item.quantity}`) ||
                                                ''}
                                        </span>
                                        <span style={{ width: '50%' }} className="f-r">
                                            ${item.purchasePrice}
                                        </span>
                                    </>
                                    <br />
                                    {(!updateOrderIsUpdating && (
                                        <button
                                            onClick={() => {
                                                handleRemove({
                                                    action: 'remove',
                                                    productId: item.productId,
                                                })
                                            }}
                                        >
                                            Remove from Order
                                        </button>
                                    )) || <b>Removing from order...</b>}
                                </div>
                            ))}
                            Total price: ${order.totalPurchasePrice}
                            <br />
                            {(!checkoutOrderIsLoading && (
                                <button
                                    onClick={() => {
                                        checkoutOrder()
                                        // TODO - integrate payment processing here
                                    }}
                                >
                                    Checkout order
                                </button>
                            )) || <b>Checking out...</b> || <></>}
                        </>
                    )) || <></>}
                </span>
                <span style={{ width: '50%' }} className="f-r">
                    <h2>Your notification preferences</h2>
                    <RadioGroup
                        options={[{ label: 'Disabled' }, { label: 'Enabled' }]}
                        items={preferences.notifications.map(notificationPreference => ({
                            subId: notificationPreference.notificationType,
                            label: `${notificationPreference.notificationType} (${notificationPreference.frequency})`,
                            isEnabled: notificationPreference.isEnabled,
                        }))}
                        onChange={handlePreferenceChange}
                    />
                    <button className="notification-button" onClick={handlePreferenceSave}>
                        Update notification preferences
                    </button>
                    <br />
                    <hr
                        style={{
                            width: '95%',
                            height: '10px',
                            color: 'black',
                            backgroundColor: 'black',
                        }}
                    />
                    <h2>Order history</h2>
                    {(!orderHistory.length &&
                        '...is empty! Not to worry, this will fill up as you make orders') ||
                        ''}
                    {orderHistory.map(order => {
                        return (
                            <>
                                <div>
                                    <span style={{ width: '50%' }} className="m-n p-n f-l">
                                        <h3 className="m-n p-n">{order.orderStatus}</h3>
                                    </span>
                                    <span style={{ width: '50%' }} className="f-r">
                                        {(order.orderStatus === 'COMPLETED' &&
                                            `Checked out at ${formatTimestamp(order.checkoutTime)}`) ||
                                            `Refunded at ${formatTimestamp(order.refundTime)}`}
                                    </span>
                                    <br />
                                </div>
                                <br />
                                <br />
                                {order.items.map(item => {
                                    return (
                                        <>
                                            <span style={{ width: '50%' }} className="f-l">
                                                <a
                                                    href={`/franchise?franchiseId=${item.franchiseId}`}
                                                >
                                                    {item.franchiseName}
                                                </a>{' '}
                                                ||{' '}
                                                <a href={`/product?productId=${item.productId}`}>
                                                    {item.productName}
                                                </a>
                                                {(item.quantity > 1 &&
                                                    ` - quantity ${item.quantity}`) ||
                                                    ''}
                                            </span>
                                            <span style={{ width: '50%' }} className="f-r">
                                                ${item.purchasePrice}
                                            </span>
                                        </>
                                    )
                                })}
                                Total price: ${order.totalPurchasePrice}
                                <hr
                                    style={{
                                        width: '95%',
                                        height: '6px',
                                        color: 'black',
                                        backgroundColor: 'black',
                                    }}
                                />
                            </>
                        )
                    })}
                </span>
                <br />
                <button
                    onClick={() => {
                        auth.removeUser()
                        dispatch(clearUsername())
                        dispatch(clearGroup())
                        localStorage.setItem('accessToken', '')
                        dispatch(clearOrder())
                        dispatch(clearOrderHistory())
                        dispatch(clearPurchasedItems())
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

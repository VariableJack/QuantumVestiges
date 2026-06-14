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
        eula: false,
        tos: false,
    })
    const [showModal, setShowModal] = useState({
        eula: false,
        tos: false,
    })
    const [submitAgreement, setSubmitAgreement] = useState(false)
    const [pageState, setPageState] = useState({
        id: 'login',
        title: 'Logging in?',
        disabled: false,
    })

    useEffect(() => {
        if (submitAgreement && areCheckboxesChecked.eula && areCheckboxesChecked.tos)
            auth.signinRedirect()
    }, [submitAgreement])
    const handleTabChange = item => {
        set(
            auth,
            ['settings', 'metadata', 'authorization_endpoint'],
            `https://${getConfig('cognitoDomain')}/${item.id}`,
        )
        setAreCheckboxesChecked({
            eula: false,
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
    const generateSpecificModal = type => {
        return (
            <div>
                <button onClick={() => setShowModal({ ...showModal, [type]: true })}>
                    View {type.toUpperCase()}
                </button>
                {(get(showModal, type) && (
                    <Modal
                        header={<h1>End User License Agreement</h1>}
                        footer={
                            <button
                                className="primary f-r"
                                onClick={() => setShowModal({ ...showModal, [type]: false })}
                            >
                                Close
                            </button>
                        }
                    >
                        {type.toUpperCase()}
                    </Modal>
                )) || <></>}

                <br />
            </div>
        )
    }
    const generateSpecificCheckbox = type => {
        return (
            <span>
                <span
                    className={`${(!get(areCheckboxesChecked, type) && submitAgreement && 'error-text') || ''} checkbox-border p-n s-n`}
                >
                    <input
                        type="checkbox"
                        checked={get(areCheckboxesChecked, type)}
                        onChange={() => {
                            //No-op, onChange only provided to stop console warnings for type="checkbox"
                        }}
                        onClick={() => {
                            setAreCheckboxesChecked({
                                ...areCheckboxesChecked,
                                [type]: !get(areCheckboxesChecked, type),
                            })
                            setSubmitAgreement(false)
                        }}
                    />
                </span>
                <b className="required">*</b>
                <label>Agree to {type.toUpperCase()}</label>
            </span>
        )
    }
    return (
        <div>
            {(pageState.id === 'login' && (
                <button onClick={() => auth.signinRedirect()}>Sign in</button>
            )) || (
                <div>
                    <h2>
                        By creating an account with us, you agree to our EULA and our TOS. Please
                        review and confirm
                    </h2>
                    {generateSpecificModal('eula')}
                    {generateSpecificModal('tos')}
                    <input
                        type="checkbox"
                        checked={areCheckboxesChecked.eula && areCheckboxesChecked.tos}
                        onChange={() => {
                            //No-op, onChange only provided to stop console warnings for type="checkbox"
                        }}
                        onClick={() => {
                            const setValue = !(
                                areCheckboxesChecked.eula && areCheckboxesChecked.tos
                            )
                            setAreCheckboxesChecked({
                                eula: setValue,
                                tos: setValue,
                            })
                            setSubmitAgreement(false)
                        }}
                    />
                    <label>Agree to all</label>
                    {generateSpecificCheckbox('eula')}
                    {generateSpecificCheckbox('tos')}
                    <br />
                    <button
                        onClick={() => {
                            setSubmitAgreement(true)
                        }}
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

import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useSelector, useDispatch, Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import { get } from 'lodash'

import { store } from './redux/api'
import {
    useLazyGetFranchisesQuery,
    useLazyGetPurchasedItemsQuery,
    useLazyGetCartQuery,
    useCheckoutCartMutation,
} from './redux/api/mediaEndpoints'
import { setFranchises, addErrorMessage } from './redux/api/globalSlice'
import {
    setUsername,
    setAccessToken,
    setGroup,
    setCart,
    setPurchasedGames,
} from './redux/api/userSlice'

// Support components
import { Flashbar, Menubar } from './shared/components'

// Constants
import {
    menubarItems,
    ADMINISTRATOR_ITEMS,
    FORUM_PAGES,
    CONNECTION_ERROR_MESSAGE,
} from './shared/constants'

import { getConfig } from './shared/utils'
// Base pages
import Home from './features/Home'
import ContactUs from './features/ContactUs'
import AboutUs from './features/AboutUs'
import NoPage from './features/NoPage'
import Account from './features/Account'

// Forum pages
import ForumPage from './features/Requests/ForumPage'
import DiscussionWrapper from './features/Requests/DiscussionWrapper'
import DiscussionWrapperCreate from './features/Requests/DiscussionWrapper/Create'
import DiscussionWrapperDetailed from './features/Requests/DiscussionWrapper/Detailed'

// Game Pages
import FranchisePage from './features/FranchisePage'
import FranchisePageCreate from './features/FranchisePage/Create'
import GamePage from './features/GamePage'
import GamePageCreate from './features/GamePage/Create'
import DownloadInstaller from './features/DownloadInstaller'

// Auth
import { AuthProvider } from 'react-oidc-context'

const cognitoAuthConfig = {
    authority: `https://cognito-idp.${getConfig('region')}.amazonaws.com/${getConfig('userPoolId')}`,
    client_id: getConfig('clientId'),
    response_type: 'code',
    redirect_uri: getConfig('hostname'),
    scope: 'aws.cognito.signin.user.admin email openid profile',
    metadata: {
        issuer: `https://cognito-idp.${getConfig('region')}.amazonaws.com/${getConfig('userPoolId')}`,
        authorization_endpoint: `https://${getConfig('cognitoDomain')}/oauth2/authorize`,
        token_endpoint: `https://${getConfig('cognitoDomain')}/oauth2/token`,
        userinfo_endpoint: `https://${getConfig('cognitoDomain')}/oauth2/userInfo`,
        end_session_endpoint: `https://${getConfig('cognitoDomain')}/logout`,
        jwks_uri: `https://cognito-idp.${getConfig('region')}.amazonaws.com/${getConfig('userPoolId')}/.well-known/jwks.json`,
    },
}

import { useAuth } from 'react-oidc-context'

const RouterWrapper = props => {
    const auth = useAuth()
    const dispatch = useDispatch()

    const [
        triggerGetCart,
        { isLoading: isGetCartLoading, isError: getCartIsError, error: getCartError },
    ] = useLazyGetCartQuery()
    const [
        triggerGetPurchasedItems,
        {
            isLoading: isPurchasedGamesLoading,
            isError: getPurchasedItemsIsError,
            error: getPurchasedItemsError,
        },
    ] = useLazyGetPurchasedItemsQuery()
    const getDetails = async auth => {
        try {
            const cartResults = await triggerGetCart({
                accessToken: auth.user.accessToken,
            }).unwrap()
            const purchasedGamesResults = await triggerGetPurchasedItems({
                accessToken: auth.user.accessToken,
            }).unwrap()
            dispatch(setCart([...cartResults]))
            dispatch(setPurchasedGames([...purchasedGamesResults]))
        } catch (e) {}
    }
    useEffect(() => {
        if (getCartIsError) {
            dispatch(
                addErrorMessage({
                    title: 'Failed to fetch your cart',
                    description: get(getCartError, 'data.error', CONNECTION_ERROR_MESSAGE),
                    id: 'cartFetch',
                }),
            )
        }
    }, [getCartIsError])
    useEffect(() => {
        if (getPurchasedItemsIsError) {
            dispatch(
                addErrorMessage({
                    title: 'Failed to fetch your list of purchased items',
                    description: get(
                        getPurchasedItemsError,
                        'data.error',
                        CONNECTION_ERROR_MESSAGE,
                    ),
                    id: 'purchasedItemsFetch',
                }),
            )
        }
    }, [getPurchasedItemsIsError])
    useEffect(() => {
        if (auth.isAuthenticated) {
            const username = auth.user.profile['cognito:username']
            const accessToken = auth.user.access_token
            const groups = auth.user.profile['cognito:groups']
            dispatch(setUsername(username))
            if (groups && groups.length) {
                dispatch(setGroup(groups[0]))
            } else {
                dispatch(setGroup('user'))
            }
            localStorage.setItem('accessToken', accessToken)

            getDetails(auth)
        }
    }, [auth])
    return (
        <Router>
            <Routes>
                <Route path="/about-us" element={<AboutUs />} />
                <Route path="/contact-us" element={<ContactUs />} />
                <Route path="/account" element={<Account auth={auth} />} />
                <Route path="/franchise" element={<FranchisePage />} />
                <Route path="/game" element={<GamePage />} />
                <Route path="/forums" element={<ForumPage />} />
                <Route path="/franchise/create" element={<FranchisePageCreate />} />
                <Route path="/game/create" element={<GamePageCreate />} />
                <Route path="/download" element={<DownloadInstaller />} />

                <Route
                    path="/bug-report/:requestId"
                    element={<DiscussionWrapperDetailed type={FORUM_PAGES.BUG_REPORT} />}
                />
                <Route
                    path="/support/:requestId"
                    element={<DiscussionWrapperDetailed type={FORUM_PAGES.SUPPORT} />}
                />
                <Route
                    path="/discussion/:requestId"
                    element={<DiscussionWrapperDetailed type={FORUM_PAGES.DISCUSSION} />}
                />

                <Route path="/support" element={<DiscussionWrapper type={FORUM_PAGES.SUPPORT} />} />
                <Route
                    path="/bug-report"
                    element={<DiscussionWrapper type={FORUM_PAGES.BUG_REPORT} />}
                />
                <Route
                    path="/discussion"
                    element={<DiscussionWrapper type={FORUM_PAGES.DISCUSSION} />}
                />

                <Route
                    path="/support/create"
                    element={<DiscussionWrapperCreate type={FORUM_PAGES.SUPPORT} />}
                />
                <Route
                    path="/bug-report/create"
                    element={<DiscussionWrapperCreate type={FORUM_PAGES.BUG_REPORT} />}
                />
                <Route
                    path="/discussion/create"
                    element={<DiscussionWrapperCreate type={FORUM_PAGES.DISCUSSION} />}
                />

                <Route path="/*" element={<NoPage />} />
                <Route path="/" element={<Home />} />
            </Routes>
        </Router>
    )
}

const root = ReactDOM.createRoot(document.getElementById('root'))
const App = () => {
    const dispatch = useDispatch()

    const [triggerGetFranchises, { isError, error }] = useLazyGetFranchisesQuery()
    const [finalItemsToDisplay, setFinalItemsToDisplay] = useState([
        ...menubarItems,
        {
            title: 'Franchise',
            elements: [],
        },
    ])
    const { group } = useSelector(state => state.userReducer)
    const { successMessages, infoMessages, errorMessages } = useSelector(
        state => state.globalReducer,
    )

    const getFranchises = async () => {
        try {
            const response = await triggerGetFranchises().unwrap()
            setFinalItemsToDisplay([
                ...menubarItems,
                {
                    title: 'Franchise',
                    elements: response.map(({ franchiseName, franchiseId }) => {
                        return {
                            menubarHeader: franchiseName,
                            path: `/franchise?franchiseId=${franchiseId}`,
                        }
                    }),
                },
            ])
            dispatch(setFranchises(response))
        } catch (e) {}
    }
    useEffect(() => {
        getFranchises()
    }, [])
    useEffect(() => {
        if (isError) {
            dispatch(
                addErrorMessage({
                    title: 'Failed to fetch franchises',
                    description: get(error, 'data.error', CONNECTION_ERROR_MESSAGE),
                    id: 'franchiseFetchError',
                }),
            )
        }
    }, [isError])
    useEffect(() => {
        if (group === 'admin') {
            setFinalItemsToDisplay([...finalItemsToDisplay, ...ADMINISTRATOR_ITEMS])
        }
    }, [group])
    return (
        <div>
            <React.StrictMode>
                <AuthProvider {...cognitoAuthConfig}>
                    <div>
                        <Flashbar
                            successMessages={successMessages}
                            infoMessages={infoMessages}
                            errorMessages={errorMessages}
                            dispatch={dispatch}
                        />
                        <Menubar
                            url={getConfig('hostname')}
                            items={finalItemsToDisplay}
                            actionButtons={[
                                {
                                    label: 'Download now',
                                    onClick: () => {
                                        window.location.href = '/download'
                                    },
                                    type: 'download',
                                },
                            ]}
                        />
                    </div>
                    <RouterWrapper />
                </AuthProvider>
            </React.StrictMode>
        </div>
    )
}
root.render(
    <Provider store={store}>
        <App />
    </Provider>,
)

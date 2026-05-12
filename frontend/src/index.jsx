import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useSelector, useDispatch, Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import { store } from './redux/api'
import {
    useLazyGetFranchisesQuery,
    useLazyGetPurchasedGamesQuery,
    useLazyGetCartQuery,
    useCheckoutCartMutation,
} from './redux/api/mediaEndpoints'
import { setFranchises } from './redux/api/globalSlice'
import {
    setUsername,
    setAccessToken,
    setGroup,
    setCart,
    setPurchasedGames,
} from './redux/api/userSlice'

// Support components
import Menubar from './shared/components/Menubar'

// Constants
import { hostname, port, menubarItems, ADMINISTRATOR_ITEMS, FORUM_PAGES } from './shared/constants'

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

// Game Pages
import FranchisePage from './features/FranchisePage'
import GamePage from './features/FranchisePage/GamePage'

// Auth
import { AuthProvider } from 'react-oidc-context'

const cognitoAuthConfig = {
    authority: `https://cognito-idp.us-west-1.amazonaws.com/${getConfig('userPoolId')}`,
    client_id: getConfig('clientId'),
    response_type: 'code',
    redirect_uri: `${hostname}:${port}`,
    scope: 'email openid phone aws.cognito.signin.user.admin',
}

import { useAuth } from 'react-oidc-context'

const RouterWrapper = props => {
    const auth = useAuth()
    const dispatch = useDispatch()

    const [triggerGetCart, { isLoading: isGetCartLoading }] = useLazyGetCartQuery()
    const [triggerGetPurchasedGames, { isLoading: isPurchasedGamesLoading }] =
        useLazyGetPurchasedGamesQuery()
    const getDetails = async auth => {
        const cartResults = await triggerGetCart({
            accessToken: auth.user.accessToken,
        }).unwrap()
        const purchasedGamesResults = await triggerGetPurchasedGames({
            accessToken: auth.user.accessToken,
        }).unwrap()
        dispatch(setCart([...cartResults]))
        dispatch(setPurchasedGames([...purchasedGamesResults]))
    }
    useEffect(() => {
        if (auth.isAuthenticated) {
            const username = auth.user.profile['cognito:username']
            const accessToken = auth.user.access_token
			console.debug(accessToken)
            const groups = auth.user.profile['cognito:groups']
            dispatch(setUsername(username))
            if (groups.length) dispatch(setGroup(groups[0]))
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

                <Route path="/bug-report/:bugReportId" element={<DiscussionWrapper type={FORUM_PAGES.BUG_REPORT} />} />
                <Route path="/support/:supportRequestId" element={<DiscussionWrapper type={FORUM_PAGES.SUPPORT} />} />
                <Route path="/discussion/:supportRequestId" element={<DiscussionWrapper type={FORUM_PAGES.DISCUSSION} />} />

                <Route path="/bug-report" element={<DiscussionWrapper type={FORUM_PAGES.BUG_REPORT} />} />
                <Route path="/support" element={<DiscussionWrapper type={FORUM_PAGES.SUPPORT} />} />
                <Route path="/discussion" element={<DiscussionWrapper type={FORUM_PAGES.DISCUSSION} />} />

                <Route path="/bug-report/create" element={<DiscussionWrapperCreate type={FORUM_PAGES.BUG_REPORT} />} />
                <Route path="/support/create" element={<DiscussionWrapperCreate type={FORUM_PAGES.SUPPORT} />} />
                <Route path="/discussion/create" element={<DiscussionWrapperCreate type={FORUM_PAGES.DISCUSSION} />} />

                <Route path="/*" element={<NoPage />} />
                <Route path="/" element={<Home />} />
            </Routes>
        </Router>
    )
}

const root = ReactDOM.createRoot(document.getElementById('root'))
const App = () => {
    const dispatch = useDispatch()

    const [triggerGetFranchises] = useLazyGetFranchisesQuery()
    const [finalItemsToDisplay, setFinalItemsToDisplay] = useState([
        ...menubarItems,
        {
            title: 'Franchise',
            elements: [],
        },
    ])
    const { group } = useSelector(state => state.userReducer)

    const getFranchises = async () => {
        const response = await triggerGetFranchises({}).unwrap()
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
            ...((group === 'admin' && ADMINISTRATOR_ITEMS) || []),
        ])
        dispatch(setFranchises(response))
    }
    useEffect(() => {
        getFranchises()
    }, [])
    return (
        <div>
            <React.StrictMode>
                <AuthProvider {...cognitoAuthConfig}>
                    <div>
                        <Menubar url={`${hostname}:${port}`} items={finalItemsToDisplay} />
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

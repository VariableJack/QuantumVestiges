import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useDispatch, Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import { thunk } from 'redux-thunk'
import { store } from './redux/api'
import {
    useLazyGetFranchisesQuery
} from './redux/api/mediaEndpoints'
import {
    setFranchises
} from './redux/api/globalSlice'

// Support components
import Menubar from './shared/components/Menubar';

// Constants
import {
    hostname,
    port,
    menubarItems,
} from './shared/constants'
// Base pages
import Home from './features/Home';
import ContactUs from './features/ContactUs';
import AboutUs from './features/AboutUs';
import NoPage from './features/NoPage';
import Login from './features/Login';

// Support & Request pages
import FeatureRequest from './features/Requests/FeatureRequest';
import GameRequest from './features/Requests/GameRequest';
import BugReport from './features/Requests/BugReport';
import SupportRequest from './features/Requests/SupportRequest';

// Game Pages
import FranchisePage from './features/FranchisePage'
import GamePage from './features/FranchisePage/GamePage'

const root = ReactDOM.createRoot(document.getElementById('root'));
const App = () => {
    const dispatch = useDispatch()
    
    const [triggerGetFranchises] = useLazyGetFranchisesQuery()
    const [finalItemsToDisplay, setFinalItemsToDisplay] = useState([...menubarItems,
        {
            title: 'Franchise',
            elements: []
        }
    ])
    
    const getFranchises = async() => {
        const response = await triggerGetFranchises().unwrap()
        setFinalItemsToDisplay([...menubarItems, {
                title: 'Franchise',
                elements: response.map(({ franchise_name, franchise_id }) => {
                    return {
                        menubarHeader: franchise_name,
                        path: `/franchise?franchiseId=${franchise_id}`,
                    }
                })
            }
        ])
        dispatch(setFranchises(response))
    }
    useEffect(() => {
        getFranchises()
    }, [])
    
    return (
        <div>
            <div>
                <React.StrictMode>
                    <div>
                        <Menubar url={`${hostname}:${port}`} items={finalItemsToDisplay}/>
                    </div>
                    <Router>
                        <Routes>
                            <Route path='/about-us' element={<AboutUs />} />
                            <Route path='/contact-us' element={<ContactUs />} />
                            <Route path='/login' element={<Login />} />
                            <Route path='/franchise' element={<FranchisePage />} />
                            <Route path='/game?franchiseId=:franchiseId&gameId=:gameId' element={<GamePage />} />
                            
                            <Route path='/feature-request' element={<FeatureRequest />} />
                            <Route path='/game-request' element={<GameRequest />} />
                            <Route path='/bug-report' element={<BugReport />} />
                            <Route path='/support' element={<SupportRequest />} />
                            <Route path='/login' element={<Login />} />
                            
                            <Route path='/*' element={<NoPage />} />
                            <Route path='/' element={<Home />} />
                        </Routes>
                    </Router>
                </React.StrictMode>
            </div>
        </div>)
}
root.render(<Provider store={store}><App /></Provider>);

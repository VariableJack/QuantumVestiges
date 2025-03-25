import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Support components
import Menubar from './shared/components/Menubar';

// Constants
import {
    hostname,
    port,
    menubarItems,
} from './shared/constants'
// Base pages
import Home from './containers/Home';
import ContactUs from './containers/ContactUs';
import AboutUs from './containers/AboutUs';
import NoPage from './containers/NoPage';

// Support & Request pages
import FeatureRequest from './containers/FeatureRequest';
import GameRequest from './containers/GameRequest';
import BugReport from './containers/BugReport';
import SupportRequest from './containers/SupportRequest';

// Game Pages

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <div>
        <div>
            <Menubar url={`${hostname}:${port}`} items={menubarItems}/>
        </div>
        <div>
            <React.StrictMode>
                <Router>
                    <Routes>
                        <Route path='/about-us' element={<AboutUs />} />
                        <Route path='/contact-us' element={<ContactUs />} />
						
                        <Route path='/feature-request' element={<FeatureRequest />} />
                        <Route path='/game-request' element={<GameRequest />} />
                        <Route path='/bug-report' element={<BugReport />} />
                        <Route path='/support' element={<SupportRequest />} />
						
                        <Route path='/*' element={<NoPage />} />
                        <Route path='/' element={<Home />} />
                    </Routes>
                </Router>
            </React.StrictMode>
        </div>
    </div>
);

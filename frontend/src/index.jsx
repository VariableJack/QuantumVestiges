import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Base pages
import Menubar from './shared/components/Menubar';
import Home from './containers/Home';
import ContactUs from './containers/ContactUs';
import AboutUs from './containers/AboutUs';
import NoPage from './containers/NoPage';

// Support & Request pages

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <div>
        <div>
            <Menubar />
        </div>
        <div>
            <React.StrictMode>
                <Router>
                    <Routes>
                        <Route path='/about-us' element={<AboutUs />} />
                        <Route path='/contact-us' element={<ContactUs />} />
                        <Route path='/feature-request' element={<NoPage />} />
                        <Route path='/game-request' element={<NoPage />} />
                        <Route path='/bug-report' element={<NoPage />} />
                        <Route path='/support' element={<NoPage />} />
                        <Route path='/*' element={<NoPage />} />
                        <Route path='/' element={<Home />} />
                    </Routes>
                </Router>
            </React.StrictMode>
        </div>
    </div>
);

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './containers/Home';
import ContactUs from './containers/ContactUs';
import AboutUs from './containers/AboutUs';
import NoPage from './containers/NoPage';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<React.StrictMode>
		<Router>
			<Routes>
				<Route path='/about-us' element={<AboutUs />} />
				<Route path='/contact-us' element={<ContactUs />} />
				<Route path='/*' element={<NoPage />} />
				<Route path='/' element={<Home />} />
			</Routes>
		</Router>
	</React.StrictMode>
);

import React from 'react';
import './index.css';
import '../../../App.css';
import {
	hostname,
	port
} from '../../constants';
import {
	getUrl
} from '../../utils';

const Sidebar = ({title, items}) => {
    return (<div className='d-i'>
		<h3>{title}</h3>
		{items.map((item) => {
			return (<div>
				<div>{item.title}</div>
				<div>{`${hostname}:${port}${getUrl(item.type)}${item.id}`}</div>
			</div>);
		})}
    </div>);
};

export default Sidebar;
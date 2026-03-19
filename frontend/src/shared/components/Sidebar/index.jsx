import React from 'react';
import './index.css';
import '../../../styles/App.css';

const Sidebar = ({url, title, items}) => {
    return (<div className='d-i'>
        <h3>{title}</h3>
        {items.map((item) => {
            return (<div>
                <div>{item.title}</div>
                <div>{`${url}${item.id}`}</div>
            </div>);
        })}
    </div>);
};

export default Sidebar;
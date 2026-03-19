import React, { useEffect } from 'react';
import './index.css';

window.onclick = function(event) {
    if (!event.target.matches('.dropbtn')) {
        resetDropdowns(-1);
    }
}

const resetDropdowns = (index) => {
    const dropdowns = document.getElementsByClassName("dropdown-content");
    for (let i = 0; i < dropdowns.length; i++) {
        if (i === index)
            continue;
        const dropdown = dropdowns[i];
        if (dropdown.classList.contains('show')) {
            dropdown.classList.remove('show');
        }
    }
}

const toggleShow = (index) => {
    resetDropdowns(index);
    document.getElementById(`dropdown${index}`).classList.toggle('show');
}
const Dropdown = ({
    url,
    title,
    elements,
    index
}) => {
    return (<div className='dropdown'>
        <button onClick={() => { toggleShow(index) }} className='dropbtn'>{title}</button>
        <span id={`dropdown${index}`} className='dropdown-content'>
            {
                elements.map((element) => <a href={`${url}${element.path}`} key={element.path}>{element.menubarHeader}</a>)
            }
        </span>
    </div>);
};

const Menubar = (props) => {
    const { items, url } = props

    return (<div>
        {
            items.map((item, index) => {
                return (<Dropdown url={url} title={item.title} elements={item.elements} index={index} />);
            })
        }
    </div>);
};

export default Menubar;
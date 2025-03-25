import React from 'react';
import './Menubar.css';
import menubarItems from '../menubarItems';
import { hostname, port } from '../constants'

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
	title,
	elements,
	index,
}) => {
	return (<div className="dropdown">
		<button onClick={() => { toggleShow(index) }} className='dropbtn'>{title}</button>
		<div id={`dropdown${index}`} className='dropdown-content'>
		    {
				elements.map((element) => <a href={`${hostname}:${port}${element.path}`}>{element.menubarHeader}</a>)
			}
		</div>
	</div>);
};

const Menubar = () => {
	return (<div>
	    {
			menubarItems.map((item, index) => {
				return (
				<button>
					<Dropdown title={item.title} elements={item.elements} index={index} />
				</button>);
			})
		}
	</div>);
};

export default Menubar;
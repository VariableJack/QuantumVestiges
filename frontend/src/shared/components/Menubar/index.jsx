import React, { useEffect } from 'react'
import './index.css'

window.onclick = function (event) {
    if (!event.target.matches('.dropbtn')) {
        resetDropdowns(-1)
    }
}

const resetDropdowns = index => {
    const dropdowns = document.getElementsByClassName('dropdown-content')
    for (let i = 0; i < dropdowns.length; i++) {
        if (i === index) continue
        const dropdown = dropdowns[i]
        if (dropdown.classList.contains('show')) {
            dropdown.classList.remove('show')
        }
    }
}

const toggleShow = index => {
    resetDropdowns(index)
    document.getElementById(`dropdown${index}`).classList.toggle('show')
}
const Dropdown = ({ url, title, elements, index }) => {
    return (
        <div className="dropdown">
            <div className="dropbtn-container">
                <a
                    onClick={() => {
                        toggleShow(index)
                    }}
                    className="dropbtn"
                >
                    {title}
                </a>
            </div>
            <div id={`dropdown${index}`} className="dropdown-content">
                {elements.map(element => (
                    <a
                        className="dropdown-content-item"
                        href={`${url}${element.path}`}
                        key={element.path}
                    >
                        <span className="dropdown-content-item-text">{element.menubarHeader}</span>
                    </a>
                ))}
            </div>
        </div>
    )
}

const Menubar = props => {
    const { items, url, actionButtons } = props

    return (
        <div className="pl-xs menubar">
            {items.map((item, index) => {
                return (
                    <Dropdown url={url} title={item.title} elements={item.elements} index={index} />
                )
            })}
            <div className="action-button-container f-r">
                {actionButtons.map(({ label, onClick, type }) => {
                    return (
                        <a className={`action-button-${type}`} onClick={onClick}>
                            {label}
                        </a>
                    )
                })}
            </div>
        </div>
    )
}

export default Menubar

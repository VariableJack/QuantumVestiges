import React, { useEffect } from 'react'
import './index.css'

const Modal = props => {
    const { header, children, footer } = props

    return (
        <div>
            {header}
            {children}
            {footer}
        </div>
    )
}

export default Modal

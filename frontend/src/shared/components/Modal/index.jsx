import React, { useEffect } from 'react'
import './index.css'

const Modal = props => {
    const { header, children, footer } = props

    return (
        <div className="modal">
            {header}
            <div className="modal-content">{children}</div>
            {footer}
        </div>
    )
}

export default Modal

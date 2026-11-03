import React, { useState } from 'react'
import '../../../styles/App.css'

const Wizard = props => {
    const { elements, shouldAllowPrimaryButtons, handleUpload } = props
    const [currentIndex, setCurrentIndex] = useState(0)
    return (
        <>
            {elements[currentIndex]}
            <br />
            <button
                className="secondary"
                disabled={currentIndex === 0}
                onClick={() => {
                    setCurrentIndex(currentIndex - 1)
                }}
            >
                Previous Page
            </button>
            <button
                className="primary"
                disabled={!shouldAllowPrimaryButtons[currentIndex]}
                onClick={() => {
                    if (currentIndex < elements.length - 1) setCurrentIndex(currentIndex + 1)
                    else {
                        handleUpload()
                    }
                }}
            >
                {(currentIndex < elements.length - 1 && 'Next Page') || 'Submit'}
            </button>
        </>
    )
}
export default Wizard

import React, { useEffect, useState } from 'react'
import '../../../styles/App.css'
import './index.css'

import {
    removeSuccessMessage,
    removeInfoMessage,
    removeErrorMessage,
    clearAllMessages,
} from '../../../redux/api/globalSlice'

const generateFlashbarItemFromMessage = (
    flashbarMessage,
    index,
    type,
    dispatch,
    removeFunction,
    isExpanded,
    setIsExpanded,
    totalCount,
) => {
    const shouldDisplayMainButtons = index === 0 || isExpanded
    const shouldDisplayAdditionalButtons = index === 0 && totalCount > 1
    const buttonOpacityStyle = {
        opacity: (shouldDisplayMainButtons && 1) || 0,
        transition: 'opacity 0.6s ease',
    }
    return (
        <div
            key={flashbarMessage.id}
            className={`flashbar-item ${type}`}
            style={{
                zIndex: `calc(9999 - ${index})`,
                top:
                    (isExpanded && `calc(20px + ${index * 80}px)`) ||
                    `calc(20px + ${index * 18}px)`,

                opacity: isExpanded ? 1 : Math.max(1 - index * 0.05, 0),
                transform: !isExpanded ? `scale(${1 - index * 0.01})` : 'scale(1)',
                transition:
                    'top 0.5s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.4s ease, transform 0.5s ease',
            }}
        >
            <div className="ml-s mt-n f-l flashbar-item-header">
                <span>
                    <h3 className="d-i">{flashbarMessage.title}</h3>&nbsp;
                    <h4 className="d-i">
                        ({index + 1}/{totalCount})
                    </h4>
                </span>
            </div>
            <br />
            <div className="flashbar-item-contents">
                <div className="flashbar-item-description f-l">{flashbarMessage.description}</div>
                <div className="buttons f-r">
                    {(shouldDisplayAdditionalButtons && (
                        <button
                            className="flashbar-expand-btn"
                            onClick={() => setIsExpanded(!isExpanded)}
                            style={buttonOpacityStyle}
                        >
                            {(isExpanded && 'Collapse') || 'Expand'} notifications
                        </button>
                    )) || <></>}
                    {(shouldDisplayAdditionalButtons && (
                        <button
                            className="flashbar-close-btn"
                            onClick={() => {
                                dispatch(clearAllMessages())
                            }}
                            style={buttonOpacityStyle}
                        >
                            Dismiss All
                        </button>
                    )) || <></>}
                    {(shouldDisplayMainButtons && (
                        <button
                            className="flashbar-close-btn"
                            onClick={() => {
                                dispatch(removeFunction(flashbarMessage.id))
                            }}
                            style={buttonOpacityStyle}
                        >
                            Dismiss
                        </button>
                    )) || <></>}
                </div>
            </div>
        </div>
    )
}

const Flashbar = props => {
    const { successMessages, infoMessages, errorMessages, dispatch } = props
    const [isExpanded, setIsExpanded] = useState(false)
    const [totalCount, setTotalCount] = useState(0)

    useEffect(() => {
        const tempSuccessMessages = []
        const tempInfoMessages = []
        const tempErrorMessages = []
        setTotalCount(successMessages.length + infoMessages.length + errorMessages.length)
    }, [successMessages, infoMessages, errorMessages])

    return (
        <div className="flashbar-container">
            {successMessages.map((message, index) =>
                generateFlashbarItemFromMessage(
                    message,
                    index,
                    'success',
                    dispatch,
                    removeSuccessMessage,
                    isExpanded,
                    setIsExpanded,
                    totalCount,
                ),
            )}
            {infoMessages.map((message, index) =>
                generateFlashbarItemFromMessage(
                    message,
                    index + successMessages.length,
                    'info',
                    dispatch,
                    removeInfoMessage,
                    isExpanded,
                    setIsExpanded,
                    totalCount,
                ),
            )}
            {errorMessages.map((message, index) =>
                generateFlashbarItemFromMessage(
                    message,
                    index + successMessages.length + infoMessages.length,
                    'error',
                    dispatch,
                    removeErrorMessage,
                    isExpanded,
                    setIsExpanded,
                    totalCount,
                ),
            )}
        </div>
    )
}

export default Flashbar

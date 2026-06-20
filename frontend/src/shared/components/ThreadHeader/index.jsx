import React from 'react'
import { formatTimestamp } from '../../utils'
import '../../../styles/App.css'

const ThreadHeader = props => {
    const {
        title,
        url,
        threadId,
        author,
        description,
        createTime,
        lastUpdateTime,
        lastUpdateBy,
        status,
    } = props
    const header = (url && (
        <a href={`${url}/${threadId}`}>
            <h3 className="d-i">{title}</h3>
        </a>
    )) || <h3 className="d-i">{title}</h3>
    return (
        <div>
            <div>
                <span className="d-i">{header}</span>
                <span className="d-i f-r">
                    {createTime && `${author} - ${formatTimestamp(createTime)}`}
                    {(status && lastUpdateBy && (
                        <>
                            <br />
                            {(status === 'CLOSE' && 'Closed by ') || 'Re-opened by '}
                            {lastUpdateBy} on {formatTimestamp(lastUpdateTime)}
                        </>
                    )) || <></>}
                </span>
            </div>
            <br />
            <span>{description}</span>
        </div>
    )
}

export default ThreadHeader

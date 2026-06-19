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
            <h3>{title}</h3>
        </a>
    )) || <h3>{title}</h3>
    return (
        <div>
            <span className="f-l">{header}</span>
            <span className="f-r">
                {author} - {formatTimestamp(createTime)}
                {(status && lastUpdateBy && (
                    <>
                        <br />
                        {(status === 'CLOSED' && 'Closed by ') || 'Re-opened by '}
                        {lastUpdateBy} on {formatTimestamp(lastUpdateTime)}
                    </>
                )) || <></>}
            </span>
            <br />
            <span className="f-l">{description}</span>
            <br />
            <br />
            <br />
        </div>
    )
}

export default ThreadHeader

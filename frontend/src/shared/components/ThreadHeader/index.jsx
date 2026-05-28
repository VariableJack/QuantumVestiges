import React from 'react'
import { formatTimestamp } from '../../utils'
import '../../../styles/App.css'

const ThreadHeader = props => {
    const { title, author, description, createTime, lastUpdateTime, lastUpdateBy, status } = props
    return (
        <div>
            <span>
                <h1 className="f-l">{title}</h1>
            </span>
            <span className="f-l">{description}</span>
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
        </div>
    )
}

export default ThreadHeader

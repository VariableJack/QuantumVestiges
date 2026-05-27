import React from 'react'
import { formatTimestamp } from '../../utils'
import '../../../styles/App.css'

const ThreadHeader = props => {
    const { title, author, subject, timestamp } = props
    return (
        <div>
            <span>
                <h1 className="f-l">{title}</h1>
            </span>
            <span className="f-l">{subject}</span>
            <span>
                {author} - {formatTimestamp(timestamp)}
            </span>
        </div>
    )
}

export default ThreadHeader

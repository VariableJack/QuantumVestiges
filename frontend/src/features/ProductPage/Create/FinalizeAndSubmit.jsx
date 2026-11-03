import React from 'react'
import { isUndefined } from 'lodash'

const FinalizeAndSubmit = props => {
    const { payload, errors } = props
    const errorsCombined = Object.keys(errors).map(errorPageKey => {
        return Object.values(errors[errorPageKey]).reduce(
            (acc, currentValue) => acc || currentValue,
            false,
        )
    })
    return (
        <>
            <div>
                <h1>Review</h1>
                <h2>Title</h2>
                <br />
                <h4>{payload.title}</h4>
                <h2>Description</h2>
                <br />
                <h4>{payload.description}</h4>
            </div>
        </>
    )
}
export default FinalizeAndSubmit

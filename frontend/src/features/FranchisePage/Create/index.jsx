import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { get } from 'lodash'

import { useCreateFranchiseMutation } from '../../../redux/api/mediaEndpoints'
import {
    addSuccessMessage,
    addInfoMessage,
    removeInfoMessage,
    addErrorMessage,
} from '../../../redux/api/globalSlice'
import { ACCOUNT_MESSAGE_TYPES, ACCOUNT_MESSAGES } from '../../../shared/constants'
import { createFlashbarMessages } from '../../../shared/utils'

import '../../../styles/App.css'

const FranchisePageCreate = () => {
    const dispatch = useDispatch()
    const { username, group } = useSelector(state => state.userReducer)
    const [
        triggerCreateFranchise,
        {
            isLoading: createFranchiseIsLoading,
            isError: createFranchiseIsError,
            error: createFranchiseError,
            isSuccess: createFranchiseIsSuccess,
        },
    ] = useCreateFranchiseMutation()
    const [franchiseName, setFranchiseName] = useState('')
    const [error, setError] = useState(false)

    const isLoadingArray = [
        {
            isLoading: createFranchiseIsLoading,
            title: 'Creating franchise',
            description: 'Please wait as the system finalizes the franchise',
            id: 'createFranchise',
        },
    ]
    const isErrorArray = [
        {
            isError: createFranchiseIsError,
            title: 'Failed to finalize franchise',
            error: createFranchiseError,
            id: 'createFranchiseError',
        },
    ]
    const isSuccessArray = [
        {
            isSuccess: createFranchiseIsSuccess,
            title: 'Successfully finalized franchise',
            description: 'Franchise has been successfully created',
            id: 'createFranchiseSuccess',
        },
    ]
    createFlashbarMessages({
        isLoadingArray,
        isErrorArray,
        isSuccessArray,
        dispatch,
    })

    const createFranchise = async input => {
        try {
            const response = await triggerCreateFranchise({ franchiseName }).unwrap()
            window.location.href = `/franchise?franchiseId=${response.franchiseId}`
        } catch (e) {}
    }
    return (
        (group !== 'admin' && (
            <div>
                <h1>Unauthorized</h1>
            </div>
        )) || (
            <>
                <h1>Create Franchise</h1>
                <div className="textarea-header">
                    Please enter a title{' '}
                    <b>
                        <i>(*Required*)</i>
                    </b>
                </div>
                <textarea
                    className={`title ${(error && 'error-text') || 'no-error-text'}`}
                    value={franchiseName}
                    onChange={event => {
                        setFranchiseName(event.nativeEvent.srcElement.value)
                        setError(event.nativeEvent.srcElement.value.length === 0)
                    }}
                    placeholder={'Enter franchise name here'}
                />
                <div>
                    <button
                        onClick={() => {
                            setError(franchiseName.length === 0)
                            if (franchiseName) createFranchise({ franchiseName })
                        }}
                    >
                        Finalize and upload
                    </button>
                </div>
            </>
        )
    )
}

export default FranchisePageCreate

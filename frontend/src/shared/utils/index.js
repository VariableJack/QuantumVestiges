import { useEffect } from 'react'
import { get } from 'lodash'
import config from '../../configurations/config.json'
import { CONNECTION_ERROR_MESSAGE } from '../constants'
import {
    addInfoMessage,
    removeInfoMessage,
    addErrorMessage,
    addSuccessMessage,
} from '../../redux/api/globalSlice'
const getConfig = key => {
    const env = get(process.env, 'REACT_APP_STAGE', 'local')
    return get(config, [env, key], 'No value')
}

const getUrl = urlType => {
    switch (urlType) {
        case FORM_PAGES.BUG_REPORT:
            return '/bug-report/'
        case FORM_PAGES.SUPPORT:
            return '/support/'
        case FORM_PAGES.DISCUSSION:
            return '/discussion/'
        default:
            return ''
    }
}
const formatTimestamp = timestamp => {
    let date

    if (timestamp instanceof Date) {
        date = timestamp
    } else if (typeof timestamp === 'number') {
        date = new Date(timestamp < 1e12 ? timestamp * 1000 : timestamp)
    } else if (typeof timestamp === 'string') {
        date = new Date(timestamp)
    }

    const dateOptions = {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    }

    return new Intl.DateTimeFormat('en-US', dateOptions).format(date)
}
/*
interface CreateFlashbarMessagesType {
isLoadingArray: {
	isLoading: boolean
title: string
description: string
id: string
}, 
isErrorArray: {
	isError: boolean
	error: { data: { error: string } }
	title: string
	id: string
}, 
isSuccessArray: {
	isSuccess: boolean
	title: string
	description: string
	id: string}, 
dispatch: any,
}
/* */
const createFlashbarMessages = props => {
    const { isLoadingArray, isErrorArray, isSuccessArray, dispatch } = props
    isLoadingArray.forEach(isLoadingObj => {
        useEffect(() => {
            let infoMessage = undefined
            const { isLoading, title, description, id } = isLoadingObj
            if (isLoading) {
                infoMessage = {
                    title,
                    description,
                    id,
                }
            } else {
                dispatch(removeInfoMessage(id))
            }
            if (infoMessage) dispatch(addInfoMessage(infoMessage))
        }, [isLoadingObj.isLoading])
    })
    isErrorArray.forEach(isErrorObj => {
        useEffect(() => {
            let errorMessage = undefined
            const { isError, title, error, type, id } = isErrorObj
            if (isError) {
                errorMessage = {
                    title,
                    description: get(error, 'data.error', CONNECTION_ERROR_MESSAGE),
                    id,
                }
            }
            if (errorMessage) dispatch(addErrorMessage(errorMessage))
        }, [isErrorObj.isError])
    })
    isSuccessArray.forEach(isSuccessObj => {
        useEffect(() => {
            let successMessage = undefined
            const { isSuccess, title, description, id } = isSuccessObj
            if (isSuccess) {
                successMessage = {
                    title,
                    description,
                    id,
                }
            }
            if (successMessage) dispatch(addSuccessMessage(successMessage))
        }, [isSuccessObj.isSuccess])
    })
}

export { getConfig, getUrl, formatTimestamp, createFlashbarMessages }

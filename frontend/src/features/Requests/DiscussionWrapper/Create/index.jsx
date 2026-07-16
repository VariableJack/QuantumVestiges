import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { get } from 'lodash'

import {
    useSubmitSupportRequestMutation,
    useSubmitBugReportMutation,
    useSubmitDiscussionThreadMutation,
} from '../../api/requestsEndpoints'
import { setSupportRequests, setBugReports, setDiscussionThreads } from '../../api/requestsSlice'
import { Sidebar } from '../../../../shared/components'
import {
    FORUM_PAGES,
    FORUM_PAGE_ITEMS,
    CONNECTION_ERROR_MESSAGE,
    FORUM_MESSAGE_PREFIXES,
    FORUM_MESSAGE_TYPES,
} from '../../../../shared/constants'
import { getConfig, getUrl, createFlashbarMessages } from '../../../../shared/utils'

import '../../../../styles/App.css'

const DiscussionCreate = props => {
    const { baseTitle, submitPageTitle, submitButtonText, recentText, submitAction, sidebarItems } =
        props
    const [inputs, setInputs] = useState({
        title: '',
        description: '',
        description: '',
    })
    const [errors, setErrors] = useState({
        title: false,
        description: false,
    })
    return (
        <div>
            <h1 className="mb-n pb-n">{baseTitle}</h1>
            <div className="d-i mr-xl">
                <h3>{submitPageTitle}</h3>
                <div className="textarea-header">
                    Please enter a title{' '}
                    <b>
                        <i>(*Required*)</i>
                    </b>
                </div>
                <textarea
                    className={`medium-border title ${(errors.title && 'error-text') || 'no-error-text'}`}
                    placeholder={'Enter title here'}
                    onChange={event => {
                        setInputs({
                            ...inputs,
                            title: event.nativeEvent.srcElement.value,
                        })
                        const newErrors = {
                            ...errors,
                            title: event.nativeEvent.srcElement.value.length === 0,
                        }
                        setErrors(newErrors)
                    }}
                />

                <div className="textarea-header">
                    Please enter a description{' '}
                    <b>
                        <i>(*Required*)</i>
                    </b>
                </div>
                <textarea
                    className={`medium-border description ${(errors.description && 'error-text') || 'no-error-text'}`}
                    placeholder={'Enter description here'}
                    onChange={event => {
                        setInputs({
                            ...inputs,
                            description: event.nativeEvent.srcElement.value,
                        })
                        const newErrors = {
                            ...errors,
                            description: event.nativeEvent.srcElement.value.length === 0,
                        }
                        setErrors(newErrors)
                    }}
                />

                <div>
                    <button
                        className="forum-button"
                        onClick={() => {
                            const newErrors = {
                                title: inputs.title.length === 0,
                                description: inputs.description.length === 0,
                            }
                            setErrors(newErrors)
                            if (inputs.title && inputs.description) {
                                submitAction(inputs)
                            }
                        }}
                    >
                        {submitButtonText}
                    </button>
                </div>
            </div>
            <Sidebar url={getConfig('hostname')} title={recentText} items={sidebarItems} />
        </div>
    )
}

const DiscussionWrapperCreate = props => {
    const dispatch = useDispatch()
    const { type } = props
    const { group } = useSelector(state => state.userReducer)
    const [
        submitSupportRequest,
        {
            isLoading: supportRequestIsSubmitting,
            isError: supportRequestIsError,
            error: supportRequestError,
            isSuccess: supportRequestIsSuccess,
        },
    ] = useSubmitSupportRequestMutation()
    const [
        submitBugReport,
        {
            isLoading: bugReportIsSubmitting,
            isError: bugReportIsError,
            error: bugReportError,
            isSuccess: bugReportIsSuccess,
        },
    ] = useSubmitBugReportMutation()
    const [
        submitDiscussionThread,
        {
            isLoading: discussionThreadIsSubmitting,
            isError: discussionThreadIsError,
            error: discussionThreadError,
            isSuccess: discussionThreadIsSuccess,
        },
    ] = useSubmitDiscussionThreadMutation()
    const { supportRequests, bugReports, discussionThreads } = useSelector(
        state => state.requestsReducer,
    )
    const [sidebarItems, setSidebarItems] = useState([])

    const isLoadingArray = [
        {
            isLoading: supportRequestIsSubmitting,
            title: `${FORUM_MESSAGE_PREFIXES[FORUM_MESSAGE_TYPES.CREATE_THREAD_LOADING].title}support request`,
            description: `${FORUM_MESSAGE_PREFIXES[FORUM_MESSAGE_TYPES.CREATE_THREAD_LOADING].description}support request`,
            id: 'supportRequestInfo',
        },
        {
            isLoading: bugReportIsSubmitting,
            title: `${FORUM_MESSAGE_PREFIXES[FORUM_MESSAGE_TYPES.CREATE_THREAD_LOADING].title}bug report`,
            description: `${FORUM_MESSAGE_PREFIXES[FORUM_MESSAGE_TYPES.CREATE_THREAD_LOADING].description}bug report`,
            id: 'bugReportInfo',
        },
        {
            isLoading: discussionThreadIsSubmitting,
            title: `${FORUM_MESSAGE_PREFIXES[FORUM_MESSAGE_TYPES.CREATE_THREAD_LOADING].title}discussion`,
            description: `${FORUM_MESSAGE_PREFIXES[FORUM_MESSAGE_TYPES.CREATE_THREAD_LOADING].description}discussion`,
            id: 'discussionThreadInfo',
        },
    ]
    const isErrorArray = [
        {
            isError: supportRequestIsError,
            error: supportRequestError,
            title: `${FORUM_MESSAGE_PREFIXES[FORUM_MESSAGE_TYPES.CREATE_THREAD_ERROR].title}`,
            id: 'supportRequestError',
        },
        {
            isError: bugReportIsError,
            error: bugReportError,
            title: `${FORUM_MESSAGE_PREFIXES[FORUM_MESSAGE_TYPES.CREATE_THREAD_ERROR].title}`,
            id: 'bugReportError',
        },
        {
            isError: discussionThreadIsError,
            error: discussionThreadError,
            title: `${FORUM_MESSAGE_PREFIXES[FORUM_MESSAGE_TYPES.CREATE_THREAD_ERROR].title}`,
            id: 'discussionThreadError',
        },
    ]
    const isSuccessArray = [
        {
            isSuccess: supportRequestIsSuccess,
            title: `${FORUM_MESSAGE_PREFIXES[FORUM_MESSAGE_TYPES.CREATE_THREAD_SUCCESS].title}support request`,
            description: `${FORUM_MESSAGE_PREFIXES[FORUM_MESSAGE_TYPES.CREATE_THREAD_SUCCESS].description}support request`,
            id: 'supportRequestSuccess',
        },
        {
            isSuccess: bugReportIsSuccess,
            title: `${FORUM_MESSAGE_PREFIXES[FORUM_MESSAGE_TYPES.CREATE_THREAD_SUCCESS].title}bug report`,
            description: `${FORUM_MESSAGE_PREFIXES[FORUM_MESSAGE_TYPES.CREATE_THREAD_SUCCESS].description}bug report`,
            id: 'bugReportSuccess',
        },
        {
            isSuccess: discussionThreadIsSuccess,
            title: `${FORUM_MESSAGE_PREFIXES[FORUM_MESSAGE_TYPES.CREATE_THREAD_SUCCESS].title}discussion`,
            description: `${FORUM_MESSAGE_PREFIXES[FORUM_MESSAGE_TYPES.CREATE_THREAD_SUCCESS].description}discussion`,
            id: 'discussionThreadSuccess',
        },
    ]
    createFlashbarMessages({ isLoadingArray, isErrorArray, isSuccessArray, dispatch })
    useEffect(() => {
        switch (type) {
            case FORUM_PAGES.SUPPORT:
                setSidebarItems([...supportRequests])
                break
            case FORUM_PAGES.BUG_REPORT:
                setSidebarItems([...bugReports])
                break
            case FORUM_PAGES.DISCUSSION:
                setSidebarItems([...discussionThreads])
                break
        }
    }, [supportRequests, bugReports, discussionThreads])
    const submitAction = async input => {
        let response = {
            threadId: -1,
        }
        let successMessage = undefined
        let createdLink = undefined
        try {
            switch (type) {
                case FORUM_PAGES.SUPPORT:
                    response = await submitSupportRequest(input).unwrap()
                    createdLink = `/support/${response.threadId}`
                    dispatch(setSupportRequests([response, ...supportRequests]))
                    break
                case FORUM_PAGES.BUG_REPORT:
                    response = await submitBugReport(input).unwrap()
                    createdLink = `/bug-report/${response.threadId}`
                    dispatch(setBugReports([response, ...bugReports]))
                    break
                case FORUM_PAGES.DISCUSSION:
                    response = await submitDiscussionThread(input).unwrap()
                    createdLink = `/discussion/${response.threadId}`
                    dispatch(setDiscussionThreads([response, ...discussionThreads]))
                    break
            }
            window.location.href = createdLink
        } catch (e) {}
    }

    return (
        <DiscussionCreate
            baseTitle={FORUM_PAGE_ITEMS[type].baseTitle(group)}
            submitPageTitle={FORUM_PAGE_ITEMS[type].submitPageTitle()}
            submitButtonText={FORUM_PAGE_ITEMS[type].submitButtonText()}
            recentText={FORUM_PAGE_ITEMS[type].recentText()}
            submitAction={submitAction}
            sidebarItems={sidebarItems}
        />
    )
}

export default DiscussionWrapperCreate

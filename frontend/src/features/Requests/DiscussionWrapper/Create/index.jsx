import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { get } from 'lodash'

import { getConfig, getUrl } from '../../../../shared/utils'
import {
    useSubmitSupportRequestMutation,
    useSubmitBugReportMutation,
    useSubmitDiscussionThreadMutation,
} from '../../api/requestsEndpoints'
import { setSupportRequests, setBugReports, setDiscussionThreads } from '../../api/requestsSlice'
import {
    addSuccessMessage,
    addInfoMessage,
    removeInfoMessage,
    addErrorMessage,
} from '../../../../redux/api/globalSlice'
import { Sidebar } from '../../../../shared/components'
import {
    FORUM_PAGES,
    FORUM_PAGE_ITEMS,
    CONNECTION_ERROR_MESSAGE,
} from '../../../../shared/constants'

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

    useEffect(() => {
        let infoMessage = undefined
        if (supportRequestIsSubmitting) {
            infoMessage = {
                title: 'Creating support request',
                description: 'Please wait as the system saves the support request',
                id: 'supportRequestInfo',
            }
        } else {
            dispatch(removeInfoMessage('supportRequestInfo'))
        }
        if (bugReportIsSubmitting) {
            infoMessage = {
                title: 'Creating bug report',
                description: 'Please wait as the system saves the bug report',
                id: 'bugReportInfo',
            }
        } else {
            dispatch(removeInfoMessage('bugReportInfo'))
        }
        if (discussionThreadIsSubmitting) {
            infoMessage = {
                title: 'Creating new discussion',
                description: 'Please wait as the system saves the discussion',
                id: 'discussionThreadInfo',
            }
        } else {
            dispatch(removeInfoMessage('discussionThreadInfo'))
        }
        if (infoMessage) dispatch(addInfoMessage(infoMessage))
    }, [supportRequestIsSubmitting, bugReportIsSubmitting, discussionThreadIsSubmitting])

    useEffect(() => {
        let errorMessage = undefined
        if (supportRequestIsError) {
            errorMessage = {
                title: 'Failed to create new support request',
                description: get(supportRequestError, 'data.error', CONNECTION_ERROR_MESSAGE),
                id: 'supportRequestError',
            }
        }
        if (bugReportIsError) {
            errorMessage = {
                title: 'Failed to create new bug report',
                description: get(bugReportError, 'data.error', CONNECTION_ERROR_MESSAGE),
                id: 'bugReportError',
            }
        }
        if (discussionThreadIsError) {
            errorMessage = {
                title: 'Failed to create new discussion',
                description: get(discussionThreadError, 'data.error', CONNECTION_ERROR_MESSAGE),
                id: 'discussionThreadError',
            }
        }
        if (errorMessage) dispatch(addErrorMessage(errorMessage))
    }, [supportRequestIsError, bugReportIsError, discussionThreadIsError])

    useEffect(() => {
        let successMessage = undefined
        if (supportRequestIsSuccess) {
            const createdLink = `/support-request/requestId=${bugReports[0].threadId}`
            successMessage = {
                title: 'Successfully created new support request',
                description: `Your support request has been successfully created and can be accessed ${(<a href={createdLink}>'here'</a>)}`,
                id: 'supportRequestSuccess',
            }
            dispatch(setSupportRequests([response, ...supportRequests]))
        }
        if (bugReportIsSuccess) {
            const createdLink = `/bug-report/requestId=${supportRequests[0].threadId}`
            successMessage = {
                title: 'Successfully created new bug report',
                description: `Your bug report has been successfully created and can be accessed ${(<a href={createdLink}>'here'</a>)}`,
                id: 'bugReportSuccess',
            }
            dispatch(setBugReports([response, ...bugReports]))
        }
        if (discussionThreadIsSuccess) {
            const createdLink = `/discussion/requestId=${discussionThreads[0].threadId}`
            successMessage = {
                title: 'Successfully created new discussion',
                description: `Your discussion has been successfully created and can be accessed ${(<a href={createdLink}>'here'</a>)}`,
                id: 'discussionThreadSuccess',
            }
            dispatch(setDiscussionThreads([response, ...discussionThreads]))
        }
        if (successMessage) dispatch(addSuccessMessage(successMessage))
    }, [supportRequestIsSuccess, bugReportIsSuccess, discussionThreadIsSuccess])
    const [sidebarItems, setSidebarItems] = useState([])
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
        try {
            switch (type) {
                case FORUM_PAGES.SUPPORT:
                    response = await submitSupportRequest(input).unwrap()
                    break
                case FORUM_PAGES.BUG_REPORT:
                    response = await submitBugReport(input).unwrap()
                    break
                case FORUM_PAGES.DISCUSSION:
                    response = await submitDiscussionThread(input).unwrap()
                    break
            }
        } catch (e) {}
        return response
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

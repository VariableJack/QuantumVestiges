import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { get } from 'lodash'

import {
    useLazyGetDetailedSupportRequestQuery,
    useLazyGetDetailedBugReportQuery,
    useLazyGetDetailedDiscussionThreadQuery,
    useSubmitSupportRequestCommentMutation,
    useSubmitBugReportCommentMutation,
    useSubmitDiscussionThreadCommentMutation,
    useCloseSupportRequestMutation,
    useReopenSupportRequestMutation,
    useCloseBugReportMutation,
    useReopenBugReportMutation,
} from '../../api/requestsEndpoints'
import {
    addSuccessMessage,
    addInfoMessage,
    removeInfoMessage,
    addErrorMessage,
} from '../../../../redux/api/globalSlice'
import { Modal, ThreadHeader } from '../../../../shared/components'
import {
    FORUM_PAGES,
    FORUM_PAGE_ITEMS,
    CONNECTION_ERROR_MESSAGE,
} from '../../../../shared/constants'

const DiscussionDetailed = props => {
    const { data, type, submitAction, closeAction, reopenAction } = props
    const [inputDescription, setInputDescription] = useState('')
    const [mainCommentResetBoolean, setMainCommentResetBoolean] = useState(true)

    const [modalIsOpen, setModalIsOpen] = useState(false)
    const [modalInputDescription, setModalInputDescription] = useState('')
    const [modalCommentResetBoolean, setModalCommentResetBoolean] = useState(true)
    return (
        <div>
            <div className="d-f">
                <h1>{FORUM_PAGE_ITEMS[type].detailedPageTitle}</h1>
                <div className="f-r">
                    <button onClick={() => setModalIsOpen(true)}>
                        {(data.status === 'OPEN' && 'Close out') || 'Reopen'}{' '}
                        {FORUM_PAGE_ITEMS[type].detailedPageTitle}
                    </button>
                </div>
            </div>
            {(modalIsOpen && (
                <Modal
                    header={`Do you wish to put a comment as you ${(data.status === 'OPEN' && 'close out') || 'reopen'} this ${FORUM_PAGE_ITEMS[type].detailedPageTitle}?`}
                    footer={
                        <div>
                            <button
                                className="f-l secondary"
                                onClick={() => {
                                    setModalIsOpen(false)
                                    setModalInputDescription('')
                                    setModalCommentResetBoolean(true)
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                className="f-l primary"
                                onClick={() => {
                                    if (data.status === 'OPEN')
                                        closeAction({
                                            threadId: data.threadId,
                                            description: modalInputDescription,
                                        })
                                    else
                                        reopenAction({
                                            threadId: data.threadId,
                                            description: modalInputDescription,
                                        })
                                    setModalIsOpen(false)
                                    setModalInputDescription('')
                                    setModalCommentResetBoolean(true)
                                }}
                            >
                                Submit
                            </button>
                        </div>
                    }
                >
                    <input
                        className={`medium-border description ${(!modalCommentResetBoolean && 'error-text') || 'no-error-text'}`}
                        placeholder="Enter your comment here (not required)"
                        value={modalInputDescription}
                        onChange={event => {
                            setModalInputDescription(event.nativeEvent.srcElement.value)
                            setModalCommentResetBoolean(
                                event.nativeEvent.srcElement.value.length > 0,
                            )
                        }}
                    />
                </Modal>
            )) || <></>}
            <ThreadHeader
                title={data.title}
                author={data.author}
                description={data.description}
                createTime={data.createTime}
            />
            <br />
            {(data.status === 'OPEN' && (
                <>
                    <div>
                        <input
                            className={`medium-border description ${(!mainCommentResetBoolean && 'error-text') || 'no-error-text'}`}
                            placeholder="Enter your comment here..."
                            value={inputDescription}
                            onChange={event => {
                                setInputDescription(event.nativeEvent.srcElement.value)
                                setMainCommentResetBoolean(
                                    event.nativeEvent.srcElement.value.length > 0,
                                )
                            }}
                        />
                        <button
                            onClick={() => {
                                if (inputDescription.length !== 0) {
                                    submitAction({
                                        threadId: data.threadId,
                                        description: inputDescription,
                                    })
                                    setInputDescription('')
                                    setMainCommentResetBoolean(true)
                                }
                            }}
                        >
                            Add Comment
                        </button>
                    </div>
                    <br />
                </>
            )) || <></>}
            {get(data, 'comments', []).map(comment => {
                ;<div className="d-f">
                    <span>{comment.author}</span>
                    <span className="mh-xl">{comment.description}</span>
                    <span>Commented on {comment.createTime}</span>
                </div>
            })}
        </div>
    )
}

const DiscussionWrapperDetailed = props => {
    const dispatch = useDispatch()
    const threadId = window.location.pathname.split('/')[2]
    useEffect(() => {}, [])
    const { type } = props

    const [
        triggerGetSupportRequest,
        {
            isLoading: supportRequestIsLoading,
            isError: supportRequestIsError,
            error: supportRequestError,
        },
    ] = useLazyGetDetailedSupportRequestQuery()
    const [
        triggerGetBugReport,
        { isLoading: bugReportIsLoading, isError: bugReportIsError, error: bugReportError },
    ] = useLazyGetDetailedBugReportQuery()
    const [
        triggerGetDiscussionThread,
        {
            isLoading: discussionThreadIsLoading,
            isError: discussionThreadIsError,
            error: discussionThreadError,
        },
    ] = useLazyGetDetailedDiscussionThreadQuery()

    const [
        submitSupportRequestComment,
        {
            isLoading: supportRequestCommentIsSubmitting,
            isError: supportRequestCommentIsError,
            error: supportRequestCommentError,
            isSuccess: supportRequestCommentIsSuccess,
        },
    ] = useSubmitSupportRequestCommentMutation()
    const [
        submitBugReportComment,
        {
            isLoading: bugReportCommentIsSubmitting,
            isError: bugReportCommentIsError,
            error: bugReportCommentError,
            isSuccess: bugReportCommentIsSuccess,
        },
    ] = useSubmitBugReportCommentMutation()
    const [
        submitDiscussionThreadComment,
        {
            isLoading: discussionThreadCommentIsSubmitting,
            isError: discussionThreadCommentIsError,
            error: discussionThreadCommentError,
            isSuccess: discussionThreadCommentIsSuccess,
        },
    ] = useSubmitDiscussionThreadCommentMutation()

    const [data, setData] = useState({
        threadId: -1,
        title: '',
        author: '',
        description: '',
        createTime: 0,
        comments: [],
    })
    const [getDataErrorStatusCode, setGetDataErrorStatusCode] = useState(0)

    useEffect(() => {
        let infoMessage = undefined
        if (supportRequestIsLoading) {
            infoMessage = {
                title: 'Fetching support request',
                description: 'Please wait as the system retrieves the support request',
                id: 'supportRequestFetch',
            }
        } else {
            dispatch(removeInfoMessage('supportRequestInfo'))
        }
        if (bugReportIsLoading) {
            infoMessage = {
                title: 'Fetching bug report',
                description: 'Please wait as the system retrieves the bug report',
                id: 'bugReportFetch',
            }
        } else {
            dispatch(removeInfoMessage('bugReportInfo'))
        }
        if (discussionThreadIsLoading) {
            infoMessage = {
                title: 'Fetching discussion',
                description: 'Please wait as the system retrieves the discussion',
                id: 'discussionThreadFetch',
            }
        } else {
            dispatch(removeInfoMessage('discussionThreadInfo'))
        }
        if (infoMessage) dispatch(addInfoMessage(infoMessage))
    }, [supportRequestIsLoading, bugReportIsLoading, discussionThreadIsLoading])

    useEffect(() => {
        let errorMessage = undefined
        if (supportRequestIsError) {
            errorMessage = {
                title: 'Failed to fetch support request',
                description: get(supportRequestError, 'data.error', CONNECTION_ERROR_MESSAGE),
                id: 'supportRequestFetchError',
            }
        }
        if (bugReportIsError) {
            errorMessage = {
                title: 'Failed to fetch bug report',
                description: get(bugReportError, 'data.error', CONNECTION_ERROR_MESSAGE),
                id: 'bugReportFetchError',
            }
        }
        if (discussionThreadIsError) {
            errorMessage = {
                title: 'Failed to fetch discussion',
                description: get(discussionThreadError, 'data.error', CONNECTION_ERROR_MESSAGE),
                id: 'discussionThreadFetchError',
            }
        }
        if (errorMessage) dispatch(addErrorMessage(errorMessage))
    }, [supportRequestIsError, bugReportIsError, discussionThreadIsError])

    useEffect(() => {
        let infoMessage = undefined
        if (supportRequestCommentIsSubmitting) {
            infoMessage = {
                title: 'Adding comment to support request',
                description:
                    'Please wait as the system saves the comment to the current support request',
                id: 'supportRequestCommentSubmit',
            }
        } else {
            dispatch(removeInfoMessage('supportRequestInfo'))
        }
        if (bugReportCommentIsSubmitting) {
            infoMessage = {
                title: 'Adding comment to bug report',
                description:
                    'Please wait as the system saves the comment to the current bug report',
                id: 'bugReportCommentSubmit',
            }
        } else {
            dispatch(removeInfoMessage('bugReportInfo'))
        }
        if (discussionThreadCommentIsSubmitting) {
            infoMessage = {
                title: 'Adding comment to new discussion',
                description:
                    'Please wait as the system saves the comment to the current discussion',
                id: 'discussionThreadCommentSubmit',
            }
        } else {
            dispatch(removeInfoMessage('discussionThreadInfo'))
        }
        if (infoMessage) dispatch(addInfoMessage(infoMessage))
    }, [
        supportRequestCommentIsSubmitting,
        bugReportCommentIsSubmitting,
        discussionThreadCommentIsSubmitting,
    ])

    useEffect(() => {
        let errorMessage = undefined
        if (supportRequestCommentIsError) {
            errorMessage = {
                title: 'Failed to add comment to support request',
                description: supportRequestCommentError.data.error,
                id: 'supportRequestCommentSubmitError',
            }
            setGetDataErrorStatusCode(supportRequestCommentError.statusCode)
        }
        if (bugReportCommentIsError) {
            errorMessage = {
                title: 'Failed to add comment to bug report',
                description: bugReportCommentError.data.error,
                id: 'bugReportCommentSubmitError',
            }
            setGetDataErrorStatusCode(bugReportCommentError.statusCode)
        }
        if (discussionThreadCommentIsError) {
            errorMessage = {
                title: 'Failed to add comment to discussion',
                description: discussionThreadCommentError.data.error,
                id: 'discussionThreadCommentSubmitError',
            }
            setGetDataErrorStatusCode(discussionThreadCommentError.statusCode)
        }
        if (errorMessage) dispatch(addErrorMessage(errorMessage))
    }, [supportRequestCommentIsError, bugReportCommentIsError, discussionThreadCommentIsError])

    useEffect(() => {
        let successMessage = undefined
        if (supportRequestCommentIsSuccess) {
            successMessage = {
                title: 'Successfully added comment to support request',
                description: 'Your comment has been successfully saved to the support request',
                id: 'supportRequestCommentSubmitSuccess',
            }
        }
        if (bugReportCommentIsSuccess) {
            successMessage = {
                title: 'Successfully added comment to bug report',
                description: 'Your comment has been successfully saved to the bug report',
                id: 'bugReportCommentSubmitSuccess',
            }
        }
        if (discussionThreadCommentIsSuccess) {
            successMessage = {
                title: 'Successfully added comment to discussion',
                description: 'Your comment has been successfully saved to the discussion',
                id: 'discussionThreadCommentSubmitSuccess',
            }
        }
        if (successMessage) dispatch(addSuccessMessage(successMessage))
    }, [
        supportRequestCommentIsSuccess,
        bugReportCommentIsSuccess,
        discussionThreadCommentIsSuccess,
    ])

    const getData = async () => {
        let response = {
            threadId: -1,
            title: '',
            author: '',
            description: '',
            createTime: 0,
            comments: [],
        }
        try {
            switch (type) {
                case FORUM_PAGES.SUPPORT:
                    response = await triggerGetSupportRequest({ threadId }).unwrap()
                    break
                case FORUM_TYPE.BUG_REPORT:
                    response = await triggerGetBugReport({ threadId }).unwrap()
                    break
                case FORUM_PAGES.DISCUSSION:
                    response = await triggerGetDiscussionThread({ threadId }).unwrap()
                    break
            }
        } catch (e) {}
        setData(response)
    }
    useEffect(() => {
        getData()
    }, [])
    const submitAction = async input => {
        let response = {
            threadId: -1,
            title: '',
            author: '',
            description: '',
            createTime: 0,
            comments: [],
        }
        try {
            switch (type) {
                case FORUM_PAGES.SUPPORT:
                    response = await submitSupportRequestComment(input).unwrap()
                    break
                case FORUM_TYPE.BUG_REPORT:
                    response = await submitBugReportComment(input).unwrap()
                    break
                case FORUM_PAGES.DISCUSSION:
                    response = await submitDiscussionThreadComment(input).unwrap()
                    break
            }
        } catch (e) {}
        return response
    }
    const handleSubmitAndSave = input => {
        const response = submitAction(input)
        setData({
            ...data,
            comments: [...data.comments, response],
        })
    }
    return <DiscussionDetailed data={data} type={type} submitAction={handleSubmitAndSave} />
}

export default DiscussionWrapperDetailed

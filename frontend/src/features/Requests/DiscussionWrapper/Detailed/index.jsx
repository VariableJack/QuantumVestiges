import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
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
import { setBugReports, setDiscussionThreads, setSupportRequests } from '../../api/requestsSlice'
import { Modal, ThreadHeader } from '../../../../shared/components'
import {
    FORUM_PAGES,
    FORUM_PAGE_ITEMS,
    CONNECTION_ERROR_MESSAGE,
    FORUM_MESSAGE_TYPES,
    FORUM_MESSAGE_PREFIXES,
} from '../../../../shared/constants'
import { formatTimestamp, createFlashbarMessages } from '../../../../shared/utils'

import '../../../../styles/App.css'

const DiscussionDetailed = props => {
    const { data, type, submitAction, closeAction, reopenAction } = props
    const [inputDescription, setInputDescription] = useState('')
    const [mainCommentResetBoolean, setMainCommentResetBoolean] = useState(true)
    const comments = get(data, 'comments', [])

    const [modalIsOpen, setModalIsOpen] = useState(false)
    const [modalInputDescription, setModalInputDescription] = useState('')
    const [modalCommentResetBoolean, setModalCommentResetBoolean] = useState(true)
    return (
        <div>
            <div className="pt-s">
                <h1 className="d-i">{FORUM_PAGE_ITEMS[type].detailedPageTitle()}</h1>
                <button className="d-i f-r forum-status" onClick={() => setModalIsOpen(true)}>
                    {(data.status === 'OPEN' && 'Close out') || 'Reopen'}{' '}
                    {FORUM_PAGE_ITEMS[type].detailedPageTitle()}
                </button>
                <br />
            </div>
            {(modalIsOpen && (
                <Modal
                    header={`Do you wish to put a comment as you ${(data.status === 'OPEN' && 'close out') || 'reopen'} this ${FORUM_PAGE_ITEMS[type].detailedPageTitle()}?`}
                    footer={
                        <div className="f-r">
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
                    <div className="mh-xs">
                        <input
                            className={`medium-border comment ${(!modalCommentResetBoolean && 'error-text') || 'no-error-text'}`}
                            placeholder="Enter your comment here (not required)"
                            value={modalInputDescription}
                            onChange={event => {
                                setModalInputDescription(event.nativeEvent.srcElement.value)
                                setModalCommentResetBoolean(
                                    event.nativeEvent.srcElement.value.length > 0,
                                )
                            }}
                        />
                    </div>
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
                    <div className="mh-xs">
                        <input
                            className={`medium-border comment ${(!mainCommentResetBoolean && 'error-text') || 'no-error-text'}`}
                            placeholder="Enter your comment here..."
                            value={inputDescription}
                            onChange={event => {
                                setInputDescription(event.nativeEvent.srcElement.value)
                                setMainCommentResetBoolean(
                                    event.nativeEvent.srcElement.value.length > 0,
                                )
                            }}
                        />
                        <br />
                        <br />
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
            {comments.map(comment => {
                return (
                    <div>
                        <br />
                        <span>{comment.author}</span>
                        <span className="f-r">
                            Commented on {formatTimestamp(comment.createTime)}
                        </span>
                        <br />
                        <span>{comment.description}</span>
                        <hr />
                    </div>
                )
            })}
        </div>
    )
}

const DiscussionWrapperDetailed = props => {
    const dispatch = useDispatch()
    const threadId = window.location.pathname.split('/')[2]
    const { type } = props

    const { bugReports, supportRequests } = useSelector(state => state.requestsReducer)
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

    const [
        closeSupportRequest,
        {
            isLoading: closeSupportRequestIsLoading,
            isError: closeSupportRequestIsError,
            error: closeSupportRequestError,
            isSuccess: closeSupportRequestIsSuccess,
        },
    ] = useCloseSupportRequestMutation()
    const [
        reopenSupportRequest,
        {
            isLoading: reopenSupportRequestIsLoading,
            isError: reopenSupportRequestIsError,
            error: reopenSupportRequestError,
            isSuccess: reopenSupportRequestIsSuccess,
        },
    ] = useReopenSupportRequestMutation()
    const [
        closeBugReport,
        {
            isLoading: closeBugReportIsLoading,
            isError: closeBugReportIsError,
            error: closeBugReportError,
            isSuccess: closeBugReportIsSuccess,
        },
    ] = useCloseBugReportMutation()
    const [
        reopenBugReport,
        {
            isLoading: reopenBugReportIsLoading,
            isError: reopenBugReportIsError,
            error: reopenBugReportError,
            isSuccess: reopenBugReportIsSuccess,
        },
    ] = useReopenBugReportMutation()

    const [data, setData] = useState({
        threadId: -1,
        title: '',
        author: '',
        description: '',
        createTime: 0,
        comments: [],
    })
    const [getDataErrorStatusCode, setGetDataErrorStatusCode] = useState(0)

    const isLoadingArray = [
        {
            isLoading: supportRequestIsLoading,
            title: `${FORUM_MESSAGE_PREFIXES[FORUM_MESSAGE_TYPES.LOADING].title}support request`,
            description: `${FORUM_MESSAGE_PREFIXES[FORUM_MESSAGE_TYPES.LOADING].description}support request`,
            id: 'supportRequestFetch',
        },
        {
            isLoading: bugReportIsLoading,
            title: `${FORUM_MESSAGE_PREFIXES[FORUM_MESSAGE_TYPES.LOADING].title}bug report`,
            description: `${FORUM_MESSAGE_PREFIXES[FORUM_MESSAGE_TYPES.LOADING].description}bug report`,
            id: 'bugReportFetch',
        },
        {
            isLoading: discussionThreadIsLoading,
            title: `${FORUM_MESSAGE_PREFIXES[FORUM_MESSAGE_TYPES.LOADING].title}discussion`,
            description: `${FORUM_MESSAGE_PREFIXES[FORUM_MESSAGE_TYPES.LOADING].description}discussion`,
            id: 'discussionThreadFetch',
        },
        {
            isLoading: supportRequestCommentIsSubmitting,
            title: `${FORUM_MESSAGE_PREFIXES[FORUM_MESSAGE_TYPES.ADD_COMMENT_LOADING].title}support request`,
            description: `${FORUM_MESSAGE_PREFIXES[FORUM_MESSAGE_TYPES.ADD_COMMENT_LOADING].description}support request`,
            id: 'supportRequestCommentSubmit',
        },
        {
            isLoading: bugReportCommentIsSubmitting,
            title: `${FORUM_MESSAGE_PREFIXES[FORUM_MESSAGE_TYPES.ADD_COMMENT_LOADING].title}bug report`,
            description: `${FORUM_MESSAGE_PREFIXES[FORUM_MESSAGE_TYPES.ADD_COMMENT_LOADING].description}bug report`,
            id: 'bugReportCommentSubmit',
        },
        {
            isLoading: discussionThreadCommentIsSubmitting,
            title: `${FORUM_MESSAGE_PREFIXES[FORUM_MESSAGE_TYPES.ADD_COMMENT_LOADING].title}discussion`,
            description: `${FORUM_MESSAGE_PREFIXES[FORUM_MESSAGE_TYPES.ADD_COMMENT_LOADING].description}discussion`,
            id: 'discussionThreadCommentSubmit',
        },
        {
            isLoading: closeSupportRequestIsLoading,
            title: `${FORUM_MESSAGE_PREFIXES[FORUM_MESSAGE_TYPES.CLOSE_THREAD_LOADING].title}support request`,
            description: `${FORUM_MESSAGE_PREFIXES[FORUM_MESSAGE_TYPES.CLOSE_THREAD_LOADING].description}support request`,
            id: 'supportRequestClose',
        },
        {
            isLoading: closeBugReportIsLoading,
            title: `${FORUM_MESSAGE_PREFIXES[FORUM_MESSAGE_TYPES.CLOSE_THREAD_LOADING].title}bug report`,
            description: `${FORUM_MESSAGE_PREFIXES[FORUM_MESSAGE_TYPES.CLOSE_THREAD_LOADING].description}bug report`,
            id: 'bugReportClose',
        },
        {
            isLoading: reopenSupportRequestIsLoading,
            title: `${FORUM_MESSAGE_PREFIXES[FORUM_MESSAGE_TYPES.REOPEN_THREAD_LOADING].title}support request`,
            description: `${FORUM_MESSAGE_PREFIXES[FORUM_MESSAGE_TYPES.REOPEN_THREAD_LOADING].description}support request`,
            id: 'supportRequestReopen',
        },
        {
            isLoading: reopenBugReportIsLoading,
            title: `${FORUM_MESSAGE_PREFIXES[FORUM_MESSAGE_TYPES.REOPEN_THREAD_LOADING].title}bug report`,
            description: `${FORUM_MESSAGE_PREFIXES[FORUM_MESSAGE_TYPES.REOPEN_THREAD_LOADING].description}bug report`,
            id: 'bugReportReopen',
        },
    ]
    const isErrorArray = [
        {
            isError: supportRequestIsError,
            error: supportRequestError,
            title: `${FORUM_MESSAGE_PREFIXES[FORUM_MESSAGE_TYPES.LOADING_ERROR].title}support request`,
            id: 'supportRequestFetchError',
        },
        {
            isError: bugReportIsError,
            error: bugReportError,
            title: `${FORUM_MESSAGE_PREFIXES[FORUM_MESSAGE_TYPES.LOADING_ERROR].title}bug report`,
            id: 'bugReportFetchError',
        },
        {
            isError: discussionThreadIsError,
            error: discussionThreadError,
            title: `${FORUM_MESSAGE_PREFIXES[FORUM_MESSAGE_TYPES.LOADING_ERROR].title}discussion`,
            id: 'discussionThreadFetchError',
        },
        {
            isError: supportRequestCommentIsError,
            error: supportRequestCommentError,
            title: `${FORUM_MESSAGE_PREFIXES[FORUM_MESSAGE_TYPES.ADD_COMMENT_ERROR].title}support request`,
            id: 'supportRequestCommentSubmitError',
        },
        {
            isError: bugReportCommentIsError,
            error: bugReportCommentError,
            title: `${FORUM_MESSAGE_PREFIXES[FORUM_MESSAGE_TYPES.ADD_COMMENT_ERROR].title}bug report`,
            id: 'bugReportCommentSubmitError',
        },
        {
            isError: discussionThreadCommentIsError,
            error: discussionThreadCommentError,
            title: `${FORUM_MESSAGE_PREFIXES[FORUM_MESSAGE_TYPES.ADD_COMMENT_ERROR].title}discussion`,
            id: 'discussionThreadCommentSubmitError',
        },
        {
            isError: closeSupportRequestIsError,
            error: closeSupportRequestError,
            title: `${FORUM_MESSAGE_PREFIXES[FORUM_MESSAGE_TYPES.CLOSE_THREAD_ERROR].title}support request`,
            id: 'closeSupportRequestError',
        },
        {
            isError: closeBugReportIsError,
            error: closeBugReportError,
            title: `${FORUM_MESSAGE_PREFIXES[FORUM_MESSAGE_TYPES.CLOSE_THREAD_ERROR].title}bug report`,
            id: 'closeBugReportError',
        },
        {
            isError: reopenSupportRequestIsError,
            error: reopenSupportRequestError,
            title: `${FORUM_MESSAGE_PREFIXES[FORUM_MESSAGE_TYPES.REOPEN_THREAD_ERROR].title}support request`,
            id: 'reopenSupportRequestError',
        },
        {
            isError: reopenBugReportIsError,
            error: reopenBugReportError,
            title: `${FORUM_MESSAGE_PREFIXES[FORUM_MESSAGE_TYPES.REOPEN_THREAD_ERROR].title}bug report`,
            id: 'reopenBugReportError',
        },
    ]
    const isSuccessArray = [
        {
            isSuccess: supportRequestCommentIsSuccess,
            title: `${FORUM_MESSAGE_PREFIXES[FORUM_MESSAGE_TYPES.ADD_COMMENT_SUCCESS].title}support request`,
            description: `${FORUM_MESSAGE_PREFIXES[FORUM_MESSAGE_TYPES.ADD_COMMENT_SUCCESS].description}support request`,
            id: 'supportRequestCommentIsSuccess',
        },
        {
            isSuccess: bugReportCommentIsSuccess,
            title: `${FORUM_MESSAGE_PREFIXES[FORUM_MESSAGE_TYPES.ADD_COMMENT_SUCCESS].title}bug report`,
            description: `${FORUM_MESSAGE_PREFIXES[FORUM_MESSAGE_TYPES.ADD_COMMENT_SUCCESS].description}bug report`,
            id: 'bugReportCommentIsSuccess',
        },
        {
            isSuccess: discussionThreadCommentIsSuccess,
            title: `${FORUM_MESSAGE_PREFIXES[FORUM_MESSAGE_TYPES.ADD_COMMENT_SUCCESS].title}discussion`,
            description: `${FORUM_MESSAGE_PREFIXES[FORUM_MESSAGE_TYPES.ADD_COMMENT_SUCCESS].description}discussion`,
            id: 'discussionThreadCommentIsSuccess',
        },
        {
            isSuccess: closeSupportRequestIsSuccess,
            title: `${FORUM_MESSAGE_PREFIXES[FORUM_MESSAGE_TYPES.CLOSE_THREAD_SUCCESS].title}support request`,
            description: `${FORUM_MESSAGE_PREFIXES[FORUM_MESSAGE_TYPES.CLOSE_THREAD_SUCCESS].description}support request`,
            id: 'closeSupportRequestIsSuccess',
        },
        {
            isSuccess: closeBugReportIsSuccess,
            title: `${FORUM_MESSAGE_PREFIXES[FORUM_MESSAGE_TYPES.CLOSE_THREAD_SUCCESS].title}bug report`,
            description: `${FORUM_MESSAGE_PREFIXES[FORUM_MESSAGE_TYPES.CLOSE_THREAD_SUCCESS].description}bug report`,
            id: 'closeBugReportIsSuccess',
        },
        {
            isSuccess: reopenSupportRequestIsSuccess,
            title: `${FORUM_MESSAGE_PREFIXES[FORUM_MESSAGE_TYPES.REOPEN_THREAD_SUCCESS].title}support request`,
            description: `${FORUM_MESSAGE_PREFIXES[FORUM_MESSAGE_TYPES.REOPEN_THREAD_SUCCESS].description}support request`,
            id: 'reopenSupportRequestIsSuccess',
        },
        {
            isSuccess: reopenBugReportIsSuccess,
            title: `${FORUM_MESSAGE_PREFIXES[FORUM_MESSAGE_TYPES.REOPEN_THREAD_SUCCESS].title}bug report`,
            description: `${FORUM_MESSAGE_PREFIXES[FORUM_MESSAGE_TYPES.REOPEN_THREAD_SUCCESS].description}bug report`,
            id: 'reopenBugReportIsSuccess',
        },
    ]
    createFlashbarMessages({
        isLoadingArray,
        isErrorArray,
        isSuccessArray,
        dispatch,
    })
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
                case FORUM_PAGES.BUG_REPORT:
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
        setData({
            ...data,
            comments: [...data.comments, response],
        })
    }
    const handleSubmitAndSave = input => {
        submitAction(input)
    }
    const closeAction = async input => {
        let response = {
            threadId: -1,
            title: '',
            author: '',
            description: '',
            createTime: 0,
            comments: [],
        }
        switch (type) {
            case FORUM_PAGES.SUPPORT:
                response = await closeSupportRequest(input).unwrap()
                break
            case FORUM_TYPE.BUG_REPORT:
                response = await closeBugReport(input).unwrap()
                break
        }
        if (input.description.trim()) {
            setData({
                ...data,
                status: 'CLOSE',
                comments: [...data.comments, response],
            })
        }
    }
    const handleClose = input => {
        try {
            closeAction(input)
            let indexOfData = undefined
            let newData = undefined
            switch (type) {
                case FORUM_PAGES.SUPPORT:
                    indexOfData = supportRequests.indexOf(
                        supportRequest => (supportRequest.threadId = data.threadId),
                    )
                    newData = [...supportRequests]
                    newData[indexOfData] = { ...data }
                    dispatch(setSupportRequests(newData))
                    break
                case FORUM_TYPE.BUG_REPORT:
                    indexOfData = bugReports.indexOf(
                        bugReport => (supportRequest.threadId = data.threadId),
                    )
                    newData = [...bugReports]
                    newData[indexOfData] = { ...data }
                    dispatch(setBugReports(newData))
                    break
            }
        } catch (e) {}
    }
    const reopenAction = async input => {
        let response = {
            threadId: -1,
            title: '',
            author: '',
            description: '',
            createTime: 0,
            comments: [],
        }
        switch (type) {
            case FORUM_PAGES.SUPPORT:
                response = await reopenSupportRequest(input).unwrap()
                break
            case FORUM_TYPE.BUG_REPORT:
                response = await reopenBugReport(input).unwrap()
                break
        }
        if (input.description.trim()) {
            setData({
                ...data,
                status: 'OPEN',
                comments: [...data.comments, response],
            })
        }
    }
    const handleReopen = input => {
        try {
            reopenAction(input)
            let indexOfData = undefined
            let newData = undefined
            switch (type) {
                case FORUM_PAGES.SUPPORT:
                    indexOfData = supportRequests.indexOf(
                        supportRequest => (supportRequest.threadId = data.threadId),
                    )
                    newData = [...supportRequests]
                    newData[indexOfData] = { ...data }
                    dispatch(setSupportRequests(newData))
                    break
                case FORUM_TYPE.BUG_REPORT:
                    indexOfData = bugReports.indexOf(
                        bugReport => (supportRequest.threadId = data.threadId),
                    )
                    newData = [...bugReports]
                    newData[indexOfData] = { ...data }
                    dispatch(setBugReports(newData))
                    break
            }
        } catch (e) {}
    }
    return (
        <DiscussionDetailed
            data={data}
            type={type}
            submitAction={handleSubmitAndSave}
            closeAction={closeAction}
            reopenAction={reopenAction}
        />
    )
}

export default DiscussionWrapperDetailed

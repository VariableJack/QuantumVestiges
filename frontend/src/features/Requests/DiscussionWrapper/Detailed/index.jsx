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
    FORUM_MESSAGE_TYPES,
    FORUM_MESSAGE_PREFIXES,
} from '../../../../shared/constants'
import { formatTimestamp } from '../../../../shared/utils'
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
            type: 'support request',
            id: 'supportRequestFetch',
            messageType: FORUM_MESSAGE_TYPES.LOADING,
        },
        {
            isLoading: bugReportIsLoading,
            type: 'bug report',
            id: 'bugReportFetch',
            messageType: FORUM_MESSAGE_TYPES.LOADING,
        },
        {
            isLoading: discussionThreadIsLoading,
            type: 'discussion',
            id: 'discussionThreadFetch',
            messageType: FORUM_MESSAGE_TYPES.LOADING,
        },
        {
            isLoading: supportRequestCommentIsSubmitting,
            type: 'support request',
            id: 'supportRequestCommentSubmit',
            messageType: FORUM_MESSAGE_TYPES.ADD_COMMENT_LOADING,
        },
        {
            isLoading: bugReportCommentIsSubmitting,
            type: 'bug report',
            id: 'bugReportCommentSubmit',
            messageType: FORUM_MESSAGE_TYPES.ADD_COMMENT_LOADING,
        },
        {
            isLoading: discussionThreadCommentIsSubmitting,
            type: 'discussion',
            id: 'discussionThreadCommentSubmit',
            messageType: FORUM_MESSAGE_TYPES.ADD_COMMENT_LOADING,
        },
        {
            isLoading: closeSupportRequestIsLoading,
            type: 'support request',
            id: 'supportRequestClose',
            messageType: FORUM_MESSAGE_TYPES.CLOSE_THREAD_LOADING,
        },
        {
            isLoading: closeBugReportIsLoading,
            type: 'bug report',
            id: 'bugReportClose',
            messageType: FORUM_MESSAGE_TYPES.CLOSE_THREAD_LOADING,
        },
        {
            isLoading: reopenSupportRequestIsLoading,
            type: 'support request',
            id: 'supportRequestReopen',
            messageType: FORUM_MESSAGE_TYPES.REOPEN_THREAD_LOADING,
        },
        {
            isLoading: reopenBugReportIsLoading,
            type: 'bug report',
            id: 'bugReportReopen',
            messageType: FORUM_MESSAGE_TYPES.REOPEN_THREAD_LOADING,
        },
    ]
    const isErrorArray = [
        {
            isError: supportRequestIsError,
            error: supportRequestError,
            type: 'support request',
            id: 'supportRequestFetchError',
            messageType: FORUM_MESSAGE_TYPES.LOADING_ERROR,
        },
        {
            isError: bugReportIsError,
            error: bugReportError,
            type: 'bug report',
            id: 'bugReportFetchError',
            messageType: FORUM_MESSAGE_TYPES.LOADING_ERROR,
        },
        {
            isError: discussionThreadIsError,
            error: discussionThreadError,
            type: 'discussion',
            id: 'discussionThreadFetchError',
            messageType: FORUM_MESSAGE_TYPES.LOADING_ERROR,
        },
        {
            isError: supportRequestCommentIsError,
            error: supportRequestCommentError,
            type: 'support request',
            id: 'supportRequestCommentSubmitError',
            messageType: FORUM_MESSAGE_TYPES.ADD_COMMENT_ERROR,
        },
        {
            isError: bugReportCommentIsError,
            error: bugReportCommentError,
            type: 'bug report',
            id: 'bugReportCommentSubmitError',
            messageType: FORUM_MESSAGE_TYPES.ADD_COMMENT_ERROR,
        },
        {
            isError: discussionThreadCommentIsError,
            error: discussionThreadCommentError,
            type: 'discussion',
            id: 'discussionThreadCommentSubmitError',
            messageType: FORUM_MESSAGE_TYPES.ADD_COMMENT_ERROR,
        },
        {
            isError: closeSupportRequestIsError,
            error: closeSupportRequestError,
            type: 'support request',
            id: 'closeSupportRequestError',
            messageType: FORUM_MESSAGE_TYPES.CLOSE_THREAD_ERROR,
        },
        {
            isError: closeBugReportIsError,
            error: closeBugReportError,
            type: 'bug report',
            id: 'closeBugReportError',
            messageType: FORUM_MESSAGE_TYPES.CLOSE_THREAD_ERROR,
        },
        {
            isError: reopenSupportRequestIsError,
            error: reopenSupportRequestError,
            type: 'support request',
            id: 'reopenSupportRequestError',
            messageType: FORUM_MESSAGE_TYPES.REOPEN_THREAD_ERROR,
        },
        {
            isError: reopenBugReportIsError,
            error: reopenBugReportError,
            type: 'bug report',
            id: 'reopenBugReportError',
            messageType: FORUM_MESSAGE_TYPES.REOPEN_THREAD_ERROR,
        },
    ]
    const isSuccessArray = [
        {
            isSuccess: supportRequestCommentIsSuccess,
            type: 'support request',
            id: 'supportRequestCommentIsSuccess',
            messageType: FORUM_MESSAGE_TYPES.ADD_COMMENT_SUCCESS,
        },
        {
            isSuccess: bugReportCommentIsSuccess,
            type: 'bug report',
            id: 'bugReportCommentIsSuccess',
            messageType: FORUM_MESSAGE_TYPES.ADD_COMMENT_SUCCESS,
        },
        {
            isSuccess: discussionThreadCommentIsSuccess,
            type: 'discussion',
            id: 'discussionThreadCommentIsSuccess',
            messageType: FORUM_MESSAGE_TYPES.ADD_COMMENT_SUCCESS,
        },
        {
            isSuccess: closeSupportRequestIsSuccess,
            type: 'support request',
            id: 'closeSupportRequestIsSuccess',
            messageType: FORUM_MESSAGE_TYPES.CLOSE_THREAD_SUCCESS,
        },
        {
            isSuccess: closeBugReportIsSuccess,
            type: 'bug report',
            id: 'closeBugReportIsSuccess',
            messageType: FORUM_MESSAGE_TYPES.CLOSE_THREAD_SUCCESS,
        },
        {
            isSuccess: reopenSupportRequestIsSuccess,
            type: 'support request',
            id: 'reopenSupportRequestIsSuccess',
            messageType: FORUM_MESSAGE_TYPES.REOPEN_THREAD_SUCCESS,
        },
        {
            isSuccess: reopenBugReportIsSuccess,
            type: 'bug report',
            id: 'reopenBugReportIsSuccess',
            messageType: FORUM_MESSAGE_TYPES.REOPEN_THREAD_SUCCESS,
        },
    ]
    useEffect(() => {
        let infoMessage = undefined
        isLoadingArray.forEach(isLoadingObj => {
            const { isLoading, type, id, messageType } = isLoadingObj
            const { title, description } = FORUM_MESSAGE_PREFIXES[messageType]
            if (isLoading) {
                infoMessage = {
                    title: `${title}${type}`,
                    description: `${description}${type}`,
                    id,
                }
            } else {
                dispatch(removeInfoMessage(id))
            }
        })
        if (infoMessage) dispatch(addInfoMessage(infoMessage))
    }, [...isLoadingArray.map(isLoadingObj => isLoadingObj.isLoading)])
    useEffect(
        () => {
            let errorMessage = undefined
            isErrorArray.forEach(isErrorObj => {
                const { isError, error, type, id, messageType } = isErrorObj
                const { title } = FORUM_MESSAGE_PREFIXES[messageType]
                if (isError) {
                    errorMessage = {
                        title: `${title}${type}`,
                        description: get(error, 'data.error', CONNECTION_ERROR_MESSAGE),
                        id,
                    }
                }
            })
            if (errorMessage) dispatch(addErrorMessage(errorMessage))
        },
        isErrorArray.map(isErrorObj => isErrorObj.isError),
    )
    useEffect(
        () => {
            let successMessage = undefined
            isSuccessArray.forEach(isSuccessObj => {
                const { isSuccess, type, id, messageType } = isSuccessObj
                const { title, description } = FORUM_MESSAGE_PREFIXES[messageType]
                if (isSuccess) {
                    successMessage = {
                        title: `${title}${type}`,
                        description: `${description}${type}`,
                        id,
                    }
                }
            })
            if (successMessage) dispatch(addSuccessMessage(successMessage))
        },
        isSuccessArray.map(isSuccessObj => isSuccessObj.isSuccess),
    )
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

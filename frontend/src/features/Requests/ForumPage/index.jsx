import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { get } from 'lodash'

import {
    useLazyGetBugReportsQuery,
    useLazyGetDiscussionThreadsQuery,
    useLazyGetSupportRequestsQuery,
} from '../api/requestsEndpoints'
import { setSupportRequests, setBugReports, setDiscussionThreads } from '../api/requestsSlice'
import {
    FORUM_PAGES,
    FORUM_PAGE_ITEMS,
    FORUM_MESSAGE_TYPES,
    FORUM_MESSAGE_PREFIXES,
} from '../../../shared/constants'
import { createFlashbarMessages } from '../../../shared/utils'
import { ThreadHeader } from '../../../shared/components'
import '../../../styles/App.css'

const getThreadHeaders = (data, url) => {
    return data.map(singleItem => (
        <ThreadHeader
            url={url}
            threadId={singleItem.threadId}
            title={singleItem.title}
            author={singleItem.author}
            createTime={singleItem.createTime}
            lastUpdateTime={singleItem.lastUpdateTime}
            lastUpdateBy={singleItem.lastUpdateBy}
            status={singleItem.status}
        />
    ))
}

const ForumPage = () => {
    const dispatch = useDispatch()
    const { username, group } = useSelector(state => state.userReducer)
    const { supportRequests, bugReports, discussionThreads } = useSelector(
        state => state.requestsReducer,
    )
    const [
        triggerGetSupportRequests,
        {
            isLoading: supportRequestsIsLoading,
            isError: supportRequestsIsError,
            error: supportRequestsError,
        },
    ] = useLazyGetSupportRequestsQuery()
    const [
        triggerGetBugReport,
        { isLoading: bugReportsIsLoading, isError: bugReportsIsError, error: bugReportsError },
    ] = useLazyGetBugReportsQuery()
    const [
        triggerGetDiscussionThreads,
        {
            isLoading: discussionThreadsIsLoading,
            isError: discussionThreadsIsError,
            error: discussionThreadsError,
        },
    ] = useLazyGetDiscussionThreadsQuery()
    const getRequests = async () => {
        try {
            const supportRequestResponse = await triggerGetSupportRequests().unwrap()
            dispatch(setSupportRequests(supportRequestResponse))
        } catch (e) {}
        try {
            const bugReportsResponse = await triggerGetBugReport().unwrap()
            dispatch(setBugReports(bugReportsResponse))
        } catch (e) {}
        try {
            const discussionThreadsResponse = await triggerGetDiscussionThreads().unwrap()
            dispatch(setDiscussionThreads(discussionThreadsResponse))
        } catch (e) {
            dispatch(setDiscussionThreads([]))
            dispatch(setBugReports([]))
            dispatch(setDiscussionThreads([]))
        }
    }
    useEffect(() => {
        getRequests()
    }, [])

    const isLoadingArray = [
        {
            isLoading: supportRequestsIsLoading,
            title: `${FORUM_MESSAGE_PREFIXES[FORUM_MESSAGE_TYPES.LOADING_ALL].title}support requests`,
            description: `${FORUM_MESSAGE_PREFIXES[FORUM_MESSAGE_TYPES.LOADING_ALL].description}support requests`,
            id: 'supportRequestsInfo',
        },
        {
            isLoading: bugReportsIsLoading,
            title: `${FORUM_MESSAGE_PREFIXES[FORUM_MESSAGE_TYPES.LOADING_ALL].title}bug reports`,
            description: `${FORUM_MESSAGE_PREFIXES[FORUM_MESSAGE_TYPES.LOADING_ALL].description}bug reports`,
            id: 'bugReportsInfo',
        },
        {
            isLoading: discussionThreadsIsLoading,
            title: `${FORUM_MESSAGE_PREFIXES[FORUM_MESSAGE_TYPES.LOADING_ALL].title}discussions`,
            description: `${FORUM_MESSAGE_PREFIXES[FORUM_MESSAGE_TYPES.LOADING_ALL].description}discussions`,
            id: 'discussionThreadsInfo',
        },
    ]
    const isErrorArray = [
        {
            isError: supportRequestsIsError,
            error: supportRequestsError,
            title: `${FORUM_MESSAGE_PREFIXES[FORUM_MESSAGE_TYPES.LOADING_ALL_ERROR].title}support requests`,
            id: 'supportRequestsError',
        },
        {
            isError: bugReportsIsError,
            error: bugReportsError,
            title: `${FORUM_MESSAGE_PREFIXES[FORUM_MESSAGE_TYPES.LOADING_ALL_ERROR].title}bug reports`,
            id: 'bugReportsError',
        },
        {
            isError: discussionThreadsIsError,
            error: discussionThreadsError,
            title: `${FORUM_MESSAGE_PREFIXES[FORUM_MESSAGE_TYPES.LOADING_ALL_ERROR].title}discussions`,
            id: 'discussionThreadsError',
        },
    ]
    const isSuccessArray = []
    createFlashbarMessages({ isLoadingArray, isErrorArray, isSuccessArray, dispatch })
    return (
        <div>
            {Object.values(FORUM_PAGES).map(type => {
                if (type === FORUM_PAGES.SUPPORT && !username) {
                    return <></>
                }
                let data = []
                switch (type) {
                    case FORUM_PAGES.SUPPORT:
                        data = supportRequests
                        break
                    case FORUM_PAGES.BUG_REPORT:
                        data = bugReports
                        break
                    case FORUM_PAGES.DISCUSSION:
                        data = discussionThreads
                        break
                }
                return (
                    <div>
                        <h1>{FORUM_PAGE_ITEMS[type].recentText()} (Open)</h1>
                        <a href={`${FORUM_PAGE_ITEMS[type].createUrl()}`}>
                            <button className="forum-button">
                                {FORUM_PAGE_ITEMS[type].submitButtonText()}
                            </button>
                        </a>
                        <br />
                        {getThreadHeaders(
                            data.filter(singleItem => singleItem.status === 'OPEN').slice(0, 10),
                            FORUM_PAGE_ITEMS[type].allViewUrl(),
                        )}
                        <h2>
                            <a href={`${FORUM_PAGE_ITEMS[type].allViewUrl()}`}>
                                {FORUM_PAGE_ITEMS[type].baseTitle(group)}
                            </a>
                        </h2>
                        <br />
                    </div>
                )
            })}
        </div>
    )
}
export default ForumPage

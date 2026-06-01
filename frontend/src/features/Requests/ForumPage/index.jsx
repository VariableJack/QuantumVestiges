import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { get } from 'lodash'

import {
    useLazyGetBugReportsQuery,
    useLazyGetDiscussionThreadsQuery,
    useLazyGetSupportRequestsQuery,
} from '../api/requestsEndpoints'
import {
    addSuccessMessage,
    addInfoMessage,
    removeInfoMessage,
    addErrorMessage,
} from '../../../redux/api/globalSlice'
import { setSupportRequests, setBugReports, setDiscussionThreads } from '../api/requestsSlice'
import { FORUM_PAGES, FORUM_PAGE_ITEMS, CONNECTION_ERROR_MESSAGE } from '../../../shared/constants'

const getThreadHeaders = data => {
    return data.map(singleItem => (
        <ThreadHeader
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

    useEffect(() => {
        let infoMessage = undefined
        if (supportRequestsIsLoading) {
            infoMessage = {
                title: 'Fetching support requests',
                description: 'Please wait as the system retrieves all support requests',
                id: 'supportRequestsFetch',
            }
        } else {
            dispatch(removeInfoMessage('supportRequestInfo'))
        }
        if (bugReportsIsLoading) {
            infoMessage = {
                title: 'Fetching bug reports',
                description: 'Please wait as the system retrieves all bug reports',
                id: 'bugReportsFetch',
            }
        } else {
            dispatch(removeInfoMessage('bugReportInfo'))
        }
        if (discussionThreadsIsLoading) {
            infoMessage = {
                title: 'Fetching discussions',
                description: 'Please wait as the system retrieves all discussions',
                id: 'discussionThreadsFetch',
            }
        } else {
            dispatch(removeInfoMessage('discussionThreadInfo'))
        }
        if (infoMessage) dispatch(addInfoMessage(infoMessage))
    }, [supportRequestsIsLoading, bugReportsIsLoading, discussionThreadsIsLoading])

    useEffect(() => {
        let errorMessage = undefined
        if (supportRequestsIsError) {
            errorMessage = {
                title: 'Failed to fetch support requests',
                description: get(supportRequestsError, 'data.error', CONNECTION_ERROR_MESSAGE),
                id: 'supportRequestsFetchError',
            }
        }
        if (bugReportsIsError) {
            errorMessage = {
                title: 'Failed to fetch bug reports',
                description: get(bugReportsError, 'data.error', CONNECTION_ERROR_MESSAGE),
                id: 'bugReportsFetchError',
            }
        }
        if (discussionThreadsIsError) {
            errorMessage = {
                title: 'Failed to fetch discussions',
                description: get(discussionThreadsError, 'data.error', CONNECTION_ERROR_MESSAGE),
                id: 'discussionThreadsFetchError',
            }
        }
        if (errorMessage) dispatch(addErrorMessage(errorMessage))
    }, [supportRequestsIsError, bugReportsIsError, discussionThreadsIsError])

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
                            <button>{FORUM_PAGE_ITEMS[type].submitButtonText()}</button>
                        </a>
                        {data
                            .filter(singleItem => singleItem.status === 'OPEN')
                            .slice(0, 10)
                            .map(singleItem => getThreadHeaders(singleItem))}
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

import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { get, isUndefined } from 'lodash'

import {
    addSuccessMessage,
    addInfoMessage,
    removeInfoMessage,
    addErrorMessage,
} from '../../../redux/api/globalSlice'
import { Dropdown, ThreadHeader, Toggle } from '../../../shared/components'
import { FORUM_PAGES, FORUM_PAGE_ITEMS, CONNECTION_ERROR_MESSAGE } from '../../../shared/constants'

import '../../../styles/App.css'

import {
    useLazyGetBugReportsQuery,
    useLazyGetDiscussionThreadsQuery,
    useLazyGetSupportRequestsQuery,
} from '../api/requestsEndpoints'
import { setBugReports, setDiscussionThreads, setSupportRequests } from '../api/requestsSlice'

const filterData = (data, pagination, author, status) => {
    return data
        .filter(
            singleItem => singleItem.status === status && (!author || singleItem.author === author),
        )
        .slice(0, pagination.count)
}
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

const DiscussionComponent = props => {
    const { baseTitle, data, type } = props
    const { username } = useSelector(state => state.userReducer)
    const [selectedCount, setSelectedCount] = useState({
        title: '5',
        count: 5,
        id: '5',
        disabled: false,
    })
    const [selectedPage, setSelectedPage] = useState({
        title: '1',
        pageNumber: 1,
        id: '1',
        disabled: false,
    })
    const [pagination, setPagination] = useState({
        count: 5,
        currentPageNumber: 0,
    })
    const [selectedAuthor, setSelectedAuthor] = useState({
        title: 'All',
        author: undefined,
        id: 'all',
    })
    return (
        <div>
            <h1>{baseTitle}</h1>
            Open
            {getThreadHeaders(filterData(data, pagination, selectedAuthor.author, 'OPEN'))}
            Closed
            {getThreadHeaders(filterData(data, pagination, selectedAuthor.author, 'CLOSED'))}
            <span>
                Page size
                <Toggle
                    items={[
                        { title: '5', count: 5, id: '5', disabled: false },
                        { title: '10', count: 10, id: '10', disabled: false },
                        { title: '25', count: 25, id: '25', disabled: false },
                    ]}
                    selectedItem={selectedCount}
                    onChange={item => {
                        setSelectedCount(item)
                        setPagination({
                            count: selectedCount.count,
                            currentPageNumber: Math.min(
                                pagination.currentPageNumber,
                                Math.floor(data.length / selectedCount.count),
                            ),
                        })
                    }}
                />
            </span>
            <span>
                Set page
                <Dropdown
                    items={Array.from(
                        { length: Math.max(1, Math.floor(data.length / pagination.count)) },
                        (_, index) => ({
                            title: `${index + 1}`,
                            pageNumber: index + 1,
                            id: `${index + 1}`,
                            disabled: false,
                        }),
                    )}
                    selectedItem={selectedPage}
                    onChange={item => {
                        setSelectedPage(item)
                        setPagination({
                            ...pagination,
                            currentPageNumber: item.pageNumber,
                        })
                    }}
                />
            </span>
            {type === FORUM_PAGES.SUPPORT && (
                <span>
                    <></>
                    ||{' '}
                    <Toggle
                        items={[
                            { title: 'All', author: undefined, id: 'all', disabled: false },
                            {
                                title: 'Mine',
                                author: username,
                                id: 'author',
                                disabled: isUndefined(username),
                            },
                        ]}
                        selectedItem={selectedAuthor}
                        onChange={item => {
                            setSelectedAuthor(item)
                        }}
                    />
                </span>
            )}
        </div>
    )
}

const DiscussionWrapper = props => {
    const dispatch = useDispatch()
    const { username, type } = props
    const { group } = useSelector(state => state.userReducer)
    const { supportRequests, bugReports, discussionThreads } = useSelector(
        state => state.requestsReducer,
    )
    const [
        triggerGetBugReport,
        { isLoading: bugReportsIsLoading, isError: bugReportsIsError, error: bugReportsError },
    ] = useLazyGetBugReportsQuery()
    const [
        triggerGetSupportRequests,
        {
            isLoading: supportRequestsIsLoading,
            isError: supportRequestsIsError,
            error: supportRequestsError,
        },
    ] = useLazyGetSupportRequestsQuery()
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
            let response = []
            switch (type) {
                case FORUM_PAGES.SUPPORT:
                    response = await triggerGetSupportRequests().unwrap()
                    dispatch(setDiscussionThreads(response))
                    break
                case FORUM_PAGES.BUG_REPORT:
                    response = await triggerGetBugReport().unwrap()
                    dispatch(setBugReports(response))
                    break
                case FORUM_PAGES.DISCUSSION:
                    response = await triggerGetDiscussionThreads().unwrap()
                    dispatch(setSupportRequests(response))
                    break
                default:
                    response = []
                    break
            }
        } catch (e) {}
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
        <DiscussionComponent
            type={type}
            baseTitle={FORUM_PAGE_ITEMS[type].baseTitle(group)}
            data={
                (type === FORUM_PAGES.SUPPORT && supportRequests) ||
                (type === FORUM_PAGES.DISCUSSION && discussionThreads) ||
                (type === FORUM_PAGES.BUG_REPORT && bugReports) ||
                []
            }
            username={username}
        />
    )
}

export default DiscussionWrapper

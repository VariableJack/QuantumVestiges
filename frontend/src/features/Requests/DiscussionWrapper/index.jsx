import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { get, isUndefined } from 'lodash'

import { Dropdown, ThreadHeader, Toggle } from '../../../shared/components'
import {
    FORUM_PAGES,
    FORUM_PAGE_ITEMS,
    CONNECTION_ERROR_MESSAGE,
    FORUM_MESSAGE_TYPES,
    FORUM_MESSAGE_PREFIXES,
} from '../../../shared/constants'
import { createFlashbarMessages } from '../../../shared/utils'

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
            {getThreadHeaders(
                filterData(data, pagination, selectedAuthor.author, 'OPEN'),
                FORUM_PAGE_ITEMS[type].allViewUrl(),
            )}
            Closed
            {getThreadHeaders(
                filterData(data, pagination, selectedAuthor.author, 'CLOSE'),
                FORUM_PAGE_ITEMS[type].allViewUrl(),
            )}
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
            {(type !== FORUM_PAGES.SUPPORT && (
                <span>
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
            )) || <></>}
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
                    dispatch(setSupportRequests(response))
                    break
                case FORUM_PAGES.BUG_REPORT:
                    response = await triggerGetBugReport().unwrap()
                    dispatch(setBugReports(response))
                    break
                case FORUM_PAGES.DISCUSSION:
                    response = await triggerGetDiscussionThreads().unwrap()
                    dispatch(setDiscussionThreads(response))
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

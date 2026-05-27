import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { isUndefined } from 'lodash'

import '../../../styles/App.css'
import { hostname, port, FORUM_PAGES, FORUM_PAGE_ITEMS } from '../../../shared/constants'
import { Dropdown, ThreadHeader, Toggle } from '../../../shared/components'

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
            timestamp={singleItem.createTime}
        />
    ))
}

const DiscussionComponent = props => {
    const { baseTitle, data, username, type } = props
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
                        { length: Math.floor(data.length / pagination.count) },
                        (_, index) => ({
                            title: `${index + 1}`,
                            pageNumber: index + 1,
                            id: `${index + 1}`,
                            disabled: false,
                        }),
                    )}
                    selectedPage={selectedPage}
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
                    || <></>
                </span>
            )}
        </div>
    )
}

const DiscussionWrapper = props => {
    const { username, type } = props
    const { group } = useSelector(state => state.userReducer)
    const { supportRequests, bugReports, discussionThreads } = useSelector(
        state => state.requestsReducer,
    )
    const [triggerGetBugReport, { isLoading: isLoadingBugReport }] = useLazyGetBugReportsQuery()
    const [triggerGetDiscussionThreads, { isLoading: isLoadingDiscussionThreads }] =
        useLazyGetDiscussionThreadsQuery()
    const [triggerGetSupportRequests, { isLoading: isLoadingSupportRequests }] =
        useLazyGetSupportRequestsQuery()
    const getRequests = async () => {
        let response = []
        switch (type) {
            case FORUM_PAGES.SUPPORT:
                response = await triggerGetDiscussionThreads().unwrap()
                dispatch(setDiscussionThreads(response))
                break
            case FORUM_PAGES.DISCUSSION:
                response = await triggerGetSupportRequests().unwrap()
                dispatch(setSupportRequests(response))
                break
            case FORUM_TYPE.BUG_REPORT:
                response = await triggerGetBugReport().unwrap()
                dispatch(setBugReports(response))
                break
            default:
                response = []
                break
        }
    }
    useEffect(() => {
        getRequests()
    }, [])
    return (
        <DiscussionComponent
            type={type}
            baseTitle={FORUM_PAGE_ITEMS[type].baseTitle(group)}
            data={
                (type === FORUM_TYPE.SUPPORT && supportRequests) ||
                (type === FORUM_TYPE.DISCUSSION && discussionThreads) ||
                (type === FORUM_TYPE.BUG_REPORT && bugReports) ||
                []
            }
            username={username}
        />
    )
}

export default DiscussionWrapper

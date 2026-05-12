import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import '../../../styles/App.css'
import { hostname, port, FORUM_PAGES, FORUM_PAGE_ITEMS } from '../../../shared/constants'
import { Sidebar, ThreadHeader } from '../../../shared/components'

import { useLazyGetBugReportsQuery, useLazyGetDiscussionThreadsQuery, useLazyGetSupportRequestsQuery } from '../api/requestsEndpoints'
import { setBugReports, setDiscussionThreads, setSupportRequests } from '../api/requestsSlice'

const DiscussionComponent = (props) => {
	const { baseTitle , data} = props
	return (<div>
	<h1></h1>
	{data.map((singleItem) => <ThreadHeader
title={singleItem.title}
subject={singleItem.subject}
author={singleItem.username}
timestamp={singleItem.createTime}/>)}
	</div>)
}

const DiscussionWrapper = (props) => {
	const { type } = props
	const { group } = useSelector((state) => state.userReducer)
	const { supportRequests, bugReports, discussionThreads } = useSelector((state) => state.requestsReducer)
	const [triggerGetBugReport, { isLoading: isLoadingBugReport }] = useLazyGetBugReportsQuery()
	const [triggerGetDiscussionThreads, { isLoading: isLoadingDiscussionThreads }] = useLazyGetDiscussionThreadsQuery()
	const [triggerGetSupportRequests, { isLoading: isLoadingSupportRequests }] = useLazyGetSupportRequestsQuery()
	const getRequests = async() => {
	let response = [];
		switch (type) {
			case FORUM_PAGES.SUPPORT:
				response = await triggerGetDiscussionThreads().unwrap()
				dispatch(setDiscussionThreads(response))
				break;
			case FORUM_PAGES.DISCUSSION:
				response = await triggerGetSupportRequests().unwrap()
				dispatch(setSupportRequests(response))
				break;
			case FORUM_TYPE.BUG_REPORT:
				response = await triggerGetBugReport().unwrap()
				dispatch(setBugReports(response))
				break;
			default:
				response = []
				break;
		}
	}
	useEffect(() => {
		getRequests()
	}, [])
	return (<DiscussionComponent baseTitle={FORUM_PAGE_ITEMS[type].baseTitle(group)} data={type === FORUM_TYPE.SUPPORT && supportRequests || type === FORUM_TYPE.DISCUSSION && discussionThreads || type === FORUM_TYPE.BUG_REPORT && bugReports || []} />
	
	)
}

export default DiscussionWrapper

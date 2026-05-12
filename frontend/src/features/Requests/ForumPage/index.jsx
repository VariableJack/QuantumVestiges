import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
    useGetLazyBugReportsQuery,
    useGetLazySupportRequestsQuery,
    useGetLazyGameRequestsQuery,
} from '../api/requestsEndpoints'
const ForumPage = () => {
	
	const dispatch = useDispatch()
    const { username } = useSelector(state => state.userReducer)
    return (<div></div>)
}
export default ForumPage

import React from 'react'
import { useSelector } from 'react-redux'
import {
    useGetLazyFeatureRequestsQuery,
    useGetLazyBugReportsQuery,
    useGetLazySupportRequestsQuery,
    useGetLazyGameRequestsQuery,
} from '../api/requestsEndpoints'
const DiscussionForums = () => {
    const { username } = useSelector(state => state.userReducer)
    return <div></div>
}
export default DiscussionForums

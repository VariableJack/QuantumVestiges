import React, { useState } from 'react'

import '../../../../styles/App.css'
import Sidebar from '../../../../shared/components/Sidebar'
import { hostname, port, FORUM_PAGES, FORUM_PAGE_ITEMS } from '../../../../shared/constants'
import { getUrl } from '../../../../shared/utils'
import {
    useSubmitBugReportMutation,
    useSubmitSupportRequestMutation,
    useSubmitDiscussionThreadMutation,
} from '../../api/requestsEndpoints'
const DiscussionCreate = (props) => {
	const {
	submitPageTitle,
	submitButtonText,
	recentText,
	submitAction
	} = props
    const [inputs, setInputs] = useState({
        title: '',
        subject: '',
		description: '',
    })
    const [errors, setErrors] = useState({
        title: false,
        subject: false,
		description: false,
    })
	return (
        <div>
            <h1 className="mb-n pb-n">Support page</h1>
            <div className="d-i mr-xl">
                <h3>{submitPageTitle}</h3>
                <div className="textarea-header">
                    Please enter a title{' '}
                    <b>
                        <i>(*Required*)</i>
                    </b>
                </div>
                <textarea
                    className={`medium-border title ${(errors.title && 'error-text') || 'no-error-text'}`}
                    placeholder={'Enter title here'}
                    onChange={event => {
                        setInputs({
                            ...inputs,
                            title: event.nativeEvent.srcElement.value,
                        })
                        const newErrors = {
                            ...errors,
                            title: event.nativeEvent.srcElement.value.length === 0,
                        }
                        setErrors(newErrors)
                    }}
                />

                <div className="textarea-header">
                    Please enter a description{' '}
                    <b>
                        <i>(*Required*)</i>
                    </b>
                </div>
                <textarea
                    className={`medium-border subject ${(errors.subject && 'error-text') || 'no-error-text'}`}
                    placeholder={'Enter description here'}
                    onChange={event => {
                        setInputs({
                            ...inputs,
                            subject: event.nativeEvent.srcElement.value,
                        })
                        const newErrors = {
                            ...errors,
                            subject: event.nativeEvent.srcElement.value.length === 0,
                        }
                        setErrors(newErrors)
                    }}
                />

                <div>
                    <button
                        onClick={() => {
                            console.log('click')
                            const newErrors = {
                                title: inputs.title.length === 0,
                                subject: inputs.subject.length === 0,
                            }
                            console.log(newErrors)
                            setErrors(newErrors)
                            if (newErrors.title.length === 0 && newErrors.subject.length === 0) {
								submitAction(input)
                                console.log('API call')
                            }
                        }}
                    >
					{submitButtonText}
                    </button>
                </div>
            </div>
            <Sidebar
                url={`${hostname}:${port}`}
                title={recentText}
                items={sidebarItems}
            />
        </div>
    )
}

const DiscussionWrapperCreate = (props) => {
	const { type } = props
	const [submitBugReport, { isLoading: isSubmittingBugReport, isSuccess: isSubmitBugReportSuccess }] = useSubmitBugReportMutation
	const [submitSupportRequest, { isLoading: isSubmittingSupportRequest, isSuccess: isSubmitSupportRequestSuccess }] = useSubmitSupportRequestMutation
	const [submitDiscussionThread, { isLoading: isSubmittingDiscussionThread, isSuccess: isSubmitDiscussionThreadSuccess }] = useSubmitDiscussionThreadMutation
	
	const [isSubmitting, setIsSubmitting] = useState(false)
    useEffect(() => {
		setIsSubmitting(
		isSubmittingBugReport ||
		isSubmittingSupportRequest ||
		isSubmittingDiscussionThread)
	}, [isSubmittingBugReport,
	    isSubmittingSupportRequest,
	    isSubmittingDiscussionThread
	])
    const sidebarItems = []
    return <DiscussionWrapper
	submitPageTitle={FORUM_PAGE_ITEMS[type].submitPageTitle()}
	submitButtonText={FORUM_PAGE_ITEMS[type].submitButtonText()}
	recentText={FORUM_PAGE_ITEMS[type].recentText()}
	submitAction={(input) => {
		switch (type) {
			case FORUM_TYPE.BUG_REPORT:
				submitBugReport(input)
				break;
			case FORUM_PAGES.SUPPORT:
				submitSupportRequest(input)
				break;
			case FORUM_PAGES.DISCUSSION:
				submitDiscussionThread(input)
				break;
		}
	}}
	isSuccess={isSubmitBugReportSuccess || isSubmitSupportRequestSuccess || isSubmitDiscussionThreadSuccess}
	/>
}

export default DiscussionWrapperCreate

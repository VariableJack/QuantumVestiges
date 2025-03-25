import React, { useState } from 'react';

import '../../../styles/App.css';
import Sidebar from '../../../shared/components/Sidebar';
import {
    hostname,
    port,
    MOCK_ITEMS_TO_DISPLAY,
} from '../../../shared/constants';
import {
    getUrl
} from '../../../shared/utils';

const FeatureRequest = () => {
    const [inputs, setInputs] = useState(
        {
            title: '',
            subject: '',
        }
    );
    const [errors, setErrors] = useState(
        {
            title: false,
            subject: false,
        }
    );
    
    const sidebarItems = MOCK_ITEMS_TO_DISPLAY.map((item) => {
        return {
            ...item,
            subpath: getUrl(item.type)
        }
    });
    return (<div>
        <h1 className='mb-n pb-n'>Feature Request page</h1>
        <div className='d-i mr-xl'>
            <h3>Submit a new feature request</h3>
            <div className='textarea-header'>Please enter a title <b><i>(*Required*)</i></b></div>
            <textarea className={`medium-border title ${errors.title && 'error-text' || 'no-error-text'}`} placeholder={'Enter title here'} onChange={(event) =>
                {
                    setInputs({
                        ...inputs,
                        title: event.nativeEvent.srcElement.value,
                    });
                    const newErrors = {
                        ...errors,
                        title: event.nativeEvent.srcElement.value.length === 0,
                    }
                    setErrors(newErrors);
                }}/>
        
            <div className='textarea-header'>Please enter a description <b><i>(*Required*)</i></b></div>
            <textarea className={`medium-border subject ${errors.subject && 'error-text' || 'no-error-text'}`} placeholder={'Enter description here'} onChange={(event) =>
                {
                    setInputs({
                        ...inputs,
                        subject: event.nativeEvent.srcElement.value,
                    });
                    const newErrors = {
                        ...errors,
                        subject: event.nativeEvent.srcElement.value.length === 0,
                    }
                    setErrors(newErrors);
                    
                }}/>

            <div>
                <button onClick={() => {
                    console.log("click");
                    const newErrors = {
                        title: inputs.title.length === 0,
                        subject: inputs.subject.length === 0,
                    }
                    console.log(newErrors);
                    setErrors(newErrors);
                    if (newErrors.title.length === 0 && newErrors.subject.length === 0) {
                        console.log('API call');
                    }
                }}>Submit feature request</button>
            </div>
        
        </div>
        <Sidebar url={`${hostname}:${path}`} title={'Recent feature requests'} items={sidebarItems} />
    </div>)
};

export default FeatureRequest;
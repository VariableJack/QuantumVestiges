import React from 'react'
import { RadioToggle } from '../'
import './index.css'

const RadioGroup = props => {
    const { options, items, selectedItem, onChange } = props
    return (
        <div>
            {options.map((option, index) => {
                return (
                    <>
                        <span>
                            <b>{option.label}</b>
                        </span>
                        {(index !== options.length - 1 && ' | ') || ''}
                    </>
                )
            })}
            {items.map(item => {
                return (
                    <>
                        <RadioToggle
                            items={[
                                { id: 'disabled', subId: item.subId, disabled: false },
                                { id: 'enabled', subId: item.subId, disabled: false },
                            ]}
                            selectedItem={{
                                id: (item.isEnabled && 'enabled') || 'disabled',
                                ...item,
                            }}
                            onChange={onChange}
                        />
                        {item.label}
                    </>
                )
            })}
        </div>
    )
}

export default RadioGroup

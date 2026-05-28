import React from 'react'
import './index.css'

const Toggle = props => {
    const { items, selectedItem, onChange } = props
    return (
        <div>
            {items.map(item => {
                return (
                    <span
                        className={`${(item.disabled && 'disabled') || (item.id === selectedItem.id && 'selected') || 'unselected'}`}
                        onClick={() => {
                            if (!item.disabled) {
                                onChange(item)
                            }
                        }}
                    >
                        {item.title}
                    </span>
                )
            })}
        </div>
    )
}

export default Toggle

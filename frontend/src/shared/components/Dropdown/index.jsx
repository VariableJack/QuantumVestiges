import React from 'react'
import '../../../styles/App.css'

const Dropdown = props => {
    const { items, onChange } = props
    return (
        <div style={{ width: '50px' }}>
            {items.map(item => {
                return (
                    <span
                        className={`${(item.disabled && 'disabled') || ''} ${(item.id === selectedItem.id && 'selected') || ''}`}
                        onClick={() => {
                            if (!item.disabled) onChange(item)
                        }}
                    >
                        {item.title}
                        <br />
                    </span>
                )
            })}
        </div>
    )
}

export default Dropdown

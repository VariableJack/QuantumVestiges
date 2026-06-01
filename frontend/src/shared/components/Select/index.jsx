import React from 'react'
import '../../../styles/App.css'

const Select = props => {
    const { items, selectedItem, onChange } = props
    return (
        <div>
            <select style={{ width: '200px' }}>
                {items.map(item => {
                    return (
                        <option
                            style={{ minWidth: '100px', width: '85%' }}
                            className={`${(item.disabled && 'disabled') || ''} ${(item.id === selectedItem.id && 'selected') || ''}`}
                            onClick={() => {
                                if (!item.disabled) onChange(item)
                            }}
                        >
                            {item.label}
                            <br />
                        </option>
                    )
                })}
            </select>
        </div>
    )
}

export default Select

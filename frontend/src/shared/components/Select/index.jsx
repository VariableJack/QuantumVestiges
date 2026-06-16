import React from 'react'
import '../../../styles/App.css'

const Select = props => {
    const { items, selectedItem, onChange } = props
    return (
        <div>
            <select style={{ width: '200px' }} onChange={(event) => {
				const id = parseInt(event.target.value)
				const item = items.find((item) => item.id === id)
				if (!item.disabled)
					onChange(item)
			}}>
                {items.map(item => {
                    return (
                        <option
                            style={{ minWidth: '100px', width: '85%' }}
                            className={`${(item.disabled && 'disabled') || ''} ${(item.id === selectedItem.id && 'selected') || ''}`}
							value={item.id}
                        >
                            {item.label}
                        </option>
                    )
                })}
            </select>
        </div>
    )
}

export default Select

import React from 'react'
import './index.css'

const RadioToggle = props => {
    const { items, selectedItem, onChange } = props
    return (
        <div>
            {items.map(item => {
                return (
                    <>
                        <input
                            type="radio"
                            onClick={() => {
                                if (!item.disabled) {
                                    onChange(item)
                                }
                            }}
                            checked={item.id === selectedItem.id}
                        />
                        {item.label}
                    </>
                )
            })}
        </div>
    )
}

export default RadioToggle

import React from 'react'

const Dropdown = props => {
    const { items, onChange } = props
    return (
        <div style={{ width: '50px' }}>
            {items.map(item => {
                return (
                    <span onClick={() => onChange(item)}>
                        {item.title}
                        <br />
                    </span>
                )
            })}
        </div>
    )
}

export default Dropdown

import React from 'react'

const FranchisePageCreate = () => {
    const { username, group } = useSelector(state => state.userReducer)
    if (group !== 'admin') {
        return (
            <div>
                <h1>Unauthorized</h1>
            </div>
        )
    }
    return <div></div>
}

export default FranchisePageCreate

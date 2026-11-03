import React from 'react'
import { isUndefined } from 'lodash'

import { Select } from '../../../shared/components'
import { DEFAULT_FRANCHISE } from '../../../shared/constants'

const generateSelectItems = items => {
    return items.map(item => ({
        id: item.franchiseId,
        label: item.franchiseName,
        disabled: item.disabled,
    }))
}
const RELEASE_SELECT_ITEMS = [
    {
        id: 1,
        hiddenLabel: 'DEVELOPMENT',
        label: 'No',
        disabled: false,
    },
    {
        id: 2,
        hiddenLabel: 'RELEASE',
        label: 'Yes',
        disabled: false,
    },
]
const BasicInfo = props => {
    const {
        payload,
        setPayload,
        franchises,
        selectedFranchise,
        setSelectedFranchise,
        errors,
        setErrors,
    } = props
    return (
        <>
            <h1>Enter basic information</h1>
            {
                <>
                    <h2>Select franchise to create product under</h2>
                    <Select
                        items={generateSelectItems([
                            { ...DEFAULT_FRANCHISE, disabled: true },
                            ...franchises.map(franchise => ({ ...franchise, disabled: false })),
                        ])}
                        selectedItem={{
                            id: selectedFranchise.franchiseId,
                            label: selectedFranchise.franchiseName,
                        }}
                        onChange={item => {
                            setSelectedFranchise({
                                franchiseId: item.id,
                                franchiseName: item.label,
                            })
                        }}
                    />
                </>
            }
            {
                <>
                    <h2>Product Name</h2>
                    <input
                        className={`${errors.pageOne.productName && 'error-text'}`}
                        value={payload.productName}
                        onChange={event => {
                            setErrors({
                                ...errors,
                                pageOne: {
                                    ...errors.pageOne,
                                    productName: event.target.value.length === 0,
                                },
                            })
                            setPayload({
                                ...payload,
                                productName: event.target.value,
                            })
                        }}
                    />
                </>
            }
            {
                <>
                    <div className="textarea-header">
                        <h2>Description</h2>
                        <b>
                            <i>(*Required*)</i>
                        </b>
                    </div>
                    <textarea
                        className={`${errors.pageOne.description && 'error-text'}`}
                        value={payload.description}
                        onChange={event => {
                            setErrors({
                                ...errors,
                                pageOne: {
                                    ...errors.pageOne,
                                    description: event.target.value.length === 0,
                                },
                            })
                            setPayload({
                                ...payload,
                                description: event.target.value,
                            })
                        }}
                    />
                </>
            }
            {
                <>
                    <h2>Input Price</h2>
                    <input
                        className={`${errors.pageOne.price && 'error-text'}`}
                        value={payload.price}
                        onChange={event => {
                            const newPrice = parseInt(event.target.value)
                            setErrors({
                                ...errors,
                                pageOne: {
                                    ...errors.pageOne,
                                    price: newPrice <= 0,
                                },
                            })
                            setPayload({
                                ...payload,
                                price: newPrice,
                            })
                        }}
                    />
                </>
            }
            {
                <>
                    <h2>Release now?</h2>
                    <Select
                        items={RELEASE_SELECT_ITEMS}
                        selectedItem={RELEASE_SELECT_ITEMS.find(
                            item => item.hiddenLabel === payload.releaseState,
                        )}
                        onChange={item => {
                            setPayload({
                                ...payload,
                                releaseState: item.hiddenLabel,
                            })
                        }}
                    />
                </>
            }
        </>
    )
}
export default BasicInfo

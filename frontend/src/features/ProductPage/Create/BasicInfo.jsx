import React, { useEffect, useState } from 'react'
import { isUndefined } from 'lodash'

import { Select } from '../../../shared/components'
import {
    DEFAULT_FRANCHISE,
    DEVELOPMENT,
    RELEASE,
    OFFSET_DURATIONS,
    MILLISECOND_DURATIONS,
} from '../../../shared/constants'

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
        hiddenLabel: DEVELOPMENT,
        label: 'No',
        disabled: false,
    },
    {
        id: 2,
        hiddenLabel: RELEASE,
        label: 'Yes',
        disabled: false,
    },
]
const RELEASE_SCHEDULE_SELECT_ITEMS = [
    {
        id: 1,
        label: 'No',
        disabled: false,
    },
    {
        id: 2,
        label: 'Yes',
        disabled: false,
    },
]

const getDateStringWithOffset = (originalDateTimestamp, offset, offsetDuration) => {
    const originalDate = new Date(originalDateTimestamp)
    const currentDate = new Date(Date.now())
    if (offsetDuration === OFFSET_DURATIONS.DAY) {
        currentDate.setTime(
            currentDate.getTime() + offset * MILLISECOND_DURATIONS.MILLISECONDS_IN_DAY,
        )
    }
    if (offsetDuration === OFFSET_DURATIONS.WEEK) {
        currentDate.setTime(
            currentDate.getTime() + offset * MILLISECOND_DURATIONS.MILLISECONDS_IN_WEEK,
        )
    }
    currentDate.setUTCHours(0)
    currentDate.setUTCMinutes(0)
    currentDate.setUTCSeconds(0)
    currentDate.setUTCMilliseconds(0)
    let returnDate = originalDate
    if (originalDate.getTime() < currentDate.getTime()) {
        returnDate = currentDate
    }

    const year = returnDate.getUTCFullYear()
    const month = (returnDate.getUTCMonth() + 1).toString()
    const day = returnDate.getUTCDate().toString()
    return `${year}-${month.length === 1 ? '0' : ''}${month}-${day.length === 1 ? '0' : ''}${day}`
}
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
    const [shouldScheduleRelease, setShouldScheduleRelease] = useState(
        RELEASE_SCHEDULE_SELECT_ITEMS[0],
    )
    const [tempDate, setTempDate] = useState(
        getDateStringWithOffset(payload.releaseDate, 1, OFFSET_DURATIONS.WEEK),
    )
    useEffect(() => {
        console.debug(tempDate)
        if (shouldScheduleRelease.label === 'Yes') {
            setPayload({
                ...payload,
                releaseDate: new Date(tempDate).getTime(),
            })
        } else {
            setPayload({
                ...payload,
                releaseDate: 0,
            })
        }
    }, [shouldScheduleRelease, tempDate])
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
            {(payload.releaseState === RELEASE && (
                <>
                    <h2>Automatically schedule the release of this product?</h2>
                    <Select
                        items={RELEASE_SCHEDULE_SELECT_ITEMS}
                        selectedItem={shouldScheduleRelease}
                        onChange={setShouldScheduleRelease}
                    />
                    {(shouldScheduleRelease.label === 'Yes' && (
                        <>
                            Select a release date (UTC time)
                            <input
                                type="date"
                                value={tempDate}
                                onChange={event => {
                                    setTempDate(event.target.value)
                                }}
                            />
                        </>
                    )) || <></>}
                </>
            )) || <></>}
        </>
    )
}
export default BasicInfo

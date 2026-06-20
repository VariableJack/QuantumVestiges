import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { get } from 'lodash'

import { useLocation } from 'react-router-dom'

import { useUpdateOrderMutation, useLazyGetProductByIdQuery } from '../../redux/api/mediaEndpoints'
import {
    addSuccessMessage,
    addInfoMessage,
    removeInfoMessage,
    addErrorMessage,
} from '../../redux/api/globalSlice'
import { setOrder } from '../../redux/api/userSlice'
import { CONNECTION_ERROR_MESSAGE } from '../../shared/constants'

import '../../styles/App.css'

const Game = () => {
    const dispatch = useDispatch()
    const { order, purchasedGames } = useSelector(state => state.userReducer)
    const { search } = useLocation()
    const params = new URLSearchParams(search)
    const productId = params.get('productId')

    const [triggerGetProduct, { isLoading, isError: getProductIsError, error: getProductError }] =
        useLazyGetProductByIdQuery()
    const [
        updateOrder,
        {
            isLoading: isUpdating,
            isError: updateOrderIsError,
            error: updateOrderError,
            isSuccess: updateOrderIsSuccess,
        },
    ] = useUpdateOrderMutation()
    const [product, setProduct] = useState({
        productId: -1,
        productName: '',
        franchiseId: -1,
        franchiseName: '',
    })
    const getProduct = async () => {
        try {
            const response = await triggerGetProduct({ productId }).unwrap()
            setProduct(response)
        } catch (e) {}
    }
    const isPresentInOrder = order.items.find(
        orderItem => orderItem.productId === product.productId,
    )
    useEffect(() => {
        if (!productId) {
            window.location.href = '/not-found'
        } else {
            getProduct()
        }
    }, [])

    useEffect(() => {
        if (getProductIsError) {
            dispatch(
                addErrorMessage({
                    title: 'Failed to fetch product',
                    description: get(getProductError, 'data.error', CONNECTION_ERROR_MESSAGE),
                    id: `productFetchError-${product.productId}`,
                }),
            )
        }
    }, [getProductIsError])

    useEffect(() => {
        const messageId = `productFetchInfo-${product.productId}`
        if (isLoading) {
            dispatch(
                addInfoMessage({
                    title: 'Fetching product',
                    description: 'Please wait while the system retrieves this product',
                    id: messageId,
                }),
            )
        } else {
            dispatch(removeInfoMessage(messageId))
        }
    }, [isLoading])

    useEffect(() => {
        const messageId = `updateOrderInfo-${(isPresentInOrder && 'remove') || 'add'}-${product.productId}`
        if (isUpdating) {
            dispatch(
                addInfoMessage({
                    title:
                        (isPresentInOrder && 'Removing item from order') || 'Adding item to order',
                    description:
                        (isPresentInOrder &&
                            'Please wait as the system removes the item from your order') ||
                        'Please wait as the system addes the item to your order',
                    id: messageId,
                }),
            )
        } else {
            dispatch(removeInfoMessage(messageId))
        }
    }, [isUpdating])

    useEffect(() => {
        if (updateOrderIsError) {
            dispatch(
                addErrorMessage({
                    title: `Failed to ${(isPresentInOrder && 'remove item from') || 'add item to'} your order`,
                    description: get(updateOrderError, 'data.error', CONNECTION_ERROR_MESSAGE),
                    id: `updateOrderError-${(isPresentInOrder && 'remove') || 'add'}-${product.productId}`,
                }),
            )
        }
    }, [updateOrderIsError])

    useEffect(() => {
        if (updateOrderIsSuccess) {
            dispatch(
                addSuccessMessage({
                    title: (isPresentInOrder && 'Removed item from order') || 'Added item to order',
                    description: `The system has successfully ${(isPresentInOrder && 'removed the item from') || 'added the item to'} your order`,
                    id: `updateOrderSuccess-${(isPresentInOrder && 'remove') || 'add'}-${product.productId}`,
                }),
            )
            if (isPresentInOrder) {
                dispatch(
                    setOrder({
                        ...order,
                        items: order.items.filter(
                            existingOrderItem => existingOrderItem.productId !== productId,
                        ),
                        totalPurchasePrice: order.totalPurchasePrice - product.price,
                    }),
                )
            } else {
                dispatch(
                    setOrder({
                        ...order,
                        items: [...order.items, product],
                        totalPurchasePrice: order.totalPurchasePrice + product.price,
                    }),
                )
            }
        }
    }, [updateOrderIsSuccess])

    const onDownloadClick = () => {
        const appProtocol = 'myapp://open'
        const fallbackUrl = '/download'

        let timeoutId
        window.location.href = appProtocol
        timeoutId = setTimeout(() => {
            window.location.href = fallbackUrl
        }, 1500)
        return () => clearTimeout(timeoutId)
    }

    return (
        <div>
            {product.franchiseName} - {product.productName}
            {(isPresentInOrder && (
                <div>
                    <br />
                    {(!isUpdating && (
                        <button
                            onClick={() => {
                                updateOrder({ action: 'remove', productId: product.productId })
                            }}
                        >
                            Remove from Order
                        </button>
                    )) || <b>Removing from order...</b>}
                </div>
            )) ||
                (!purchasedGames.find(
                    purchasedGame => purchasedGame.productId === product.productId,
                ) && (
                    <div>
                        <br />
                        {(!isUpdating && (
                            <button
                                onClick={() => {
                                    updateOrder({
                                        action: 'add',
                                        productId: product.productId,
                                        quantity: 1,
                                    })
                                }}
                            >
                                Add to Order
                            </button>
                        )) || <b>Adding to order...</b>}
                    </div>
                )) || (
                    <div>
                        <br />
                        <button onClick={onDownloadClick}>Download the product</button>
                    </div>
                )}
        </div>
    )
}
export default Game

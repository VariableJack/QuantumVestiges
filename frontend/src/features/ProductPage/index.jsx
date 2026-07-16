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
import { createFlashbarMessages } from '../../shared/utils'

import '../../styles/App.css'

const Game = () => {
    const dispatch = useDispatch()
    const { order, purchasedItems } = useSelector(state => state.userReducer)
    const { search } = useLocation()
    const params = new URLSearchParams(search)
    const productId = params.get('productId')

    const [
        triggerGetProduct,
        { isLoading: getProductIsLoading, isError: getProductIsError, error: getProductError },
    ] = useLazyGetProductByIdQuery()
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

    const isLoadingArray = [
        {
            isLoading: getProductIsLoading,
            title: 'Fetching product',
            description: 'Please wait while the system retrieves this product',
            id: `productFetchInfo-${product.productId}`,
        },
        {
            isLoading: getProductIsLoading,
            title: 'Fetching product',
            description: 'Please wait while the system retrieves this product',
            id: `updateOrderInfo-${(isPresentInOrder && 'remove') || 'add'}-${product.productId}`,
        },
    ]
    const isErrorArray = [
        {
            isError: getProductIsError,
            error: getProductError,
            title: 'Failed to fetch product',
            id: `productFetchError-${product.productId}`,
        },
        {
            isError: updateOrderIsError,
            error: updateOrderError,
            title: `Failed to ${(isPresentInOrder && 'remove item from') || 'add item to'} your order`,
            id: `updateOrderError-${(isPresentInOrder && 'remove') || 'add'}-${product.productId}`,
        },
    ]
    const isSuccessArray = [
        {
            isSuccess: updateOrderIsSuccess,
            title: (isPresentInOrder && 'Removed item from order') || 'Added item to order',
            description: `The system has successfully ${(isPresentInOrder && 'removed the item from') || 'added the item to'} your order`,
            id: `updateOrderSuccess-${(isPresentInOrder && 'remove') || 'add'}-${product.productId}`,
        },
    ]
    createFlashbarMessages({ isLoadingArray, isErrorArray, isSuccessArray, dispatch })

    useEffect(() => {
        if (updateOrderIsSuccess) {
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
                (!purchasedItems.find(
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

import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { get } from 'lodash'

import { useLocation } from 'react-router-dom'

import { useUpdateCartMutation, useLazyGetProductByIdQuery } from '../../redux/api/mediaEndpoints'
import {
    addSuccessMessage,
    addInfoMessage,
    removeInfoMessage,
    addErrorMessage,
} from '../../redux/api/globalSlice'
import { CONNECTION_ERROR_MESSAGE } from '../../shared/constants'

import '../../styles/App.css'

const Game = () => {
	const dispatch = useDispatch()
    const { cart, purchasedGames } = useSelector(state => state.userReducer)
    const { search } = useLocation()
    const params = new URLSearchParams(search)
    const productId = params.get('productId')

    const [triggerGetProduct, { isLoading, isError: getProductIsError, error: getProductError }] =
        useLazyGetProductByIdQuery()
    const [
        updateCart,
        {
            isLoading: isUpdating,
            isError: updateCartIsError,
            error: updateCartError,
            isSuccess: updateCartIsSuccess,
        },
    ] = useUpdateCartMutation()
    const [product, setProduct] = useState({
        productId: -1,
        productName: '',
        franchiseId: -1,
        franchiseName: '',
    })
    const getProduct = async () => {
        const response = await triggerGetProduct({ productId }).unwrap()
        setProduct(response)
    }
    const isPresentInCart = cart.find(cartItem => cartItem.productId === product.productId)
    useEffect(() => {
        if (!productId) {
            window.location.href('/not-found')
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
        const messageId = `updateCartInfo-${(isPresentInCart && 'remove') || 'add'}-${product.productId}`
        if (isUpdating) {
            dispatch(
                addInfoMessage({
                    title: (isPresentInCart && 'Removing item from cart') || 'Adding item to cart',
                    description:
                        (isPresentInCart &&
                            'Please wait as the system removes the item from your cart') ||
                        'Please wait as the system addes the item to your cart',
                    id: messageId,
                }),
            )
        } else {
            dispatch(removeInfoMessage(messageId))
        }
    }, [isUpdating])

    useEffect(() => {
        if (updateCartIsError) {
            dispatch(
                addErrorMessage({
                    title: `Failed to ${(isPresentInCart && 'remove item from') || 'add item to'} your cart`,
                    description: get(updateCartError, 'data.error', CONNECTION_ERROR_MESSAGE),
                    id: `updateCartError-${(isPresentInCart && 'remove') || 'add'}-${product.productId}`,
                }),
            )
        }
    }, [updateCartIsError])

    useEffect(() => {
        if (updateCartIsSuccess) {
            dispatch(
                addSuccessMessage({
                    title: (isPresentInCart && 'Removed item from cart') || 'Added item to cart',
                    description: `The system has successfully ${(isPresentInCart && 'removed the item from') || 'added the item to'} your cart`,
                    id: `updateCartSuccess-${(isPresentInCart && 'remove') || 'add'}-${product.productId}`,
                }),
            )
        }
    }, [updateCartIsSuccess])

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
            {(isPresentInCart && (
                <div>
                    <br />
                    {(!isUpdating && (
                        <button
                            onClick={() => {
                                updateCart({ action: 'remove', productId: product.productId })
                            }}
                        >
                            Remove from Cart
                        </button>
                    )) || <b>Removing from cart...</b>}
                </div>
            )) ||
                (!purchasedGames.find(purchasedGame => purchasedGame.productId === product.productId) && (
                    <div>
                        <br />
                        {(!isUpdating && (
                            <button
                                onClick={() => {
                                    updateCart({ action: 'add', productId: product.productId })
                                }}
                            >
                                Add to Cart
                            </button>
                        )) || <b>Adding to cart...</b>}
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

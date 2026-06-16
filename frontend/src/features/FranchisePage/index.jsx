import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { get } from 'lodash'

import { useLazyGetProductsQuery } from '../../redux/api/mediaEndpoints'
import { addInfoMessage, removeInfoMessage, addErrorMessage } from '../../redux/api/globalSlice'
import { CONNECTION_ERROR_MESSAGE } from '../../shared/constants'

import '../../styles/App.css'

const Franchise = () => {
    const dispatch = useDispatch()
    const { search } = useLocation()
    const params = new URLSearchParams(search)
    const franchiseId = parseInt(params.get('franchiseId'))
    const { franchises } = useSelector(state => state.globalReducer)
    const [franchise, setFranchise] = useState({ franchiseId: -1, franchiseName: 'Loading...' })

    useEffect(() => {
        if (!franchiseId) {
            window.location.href('/not-found')
        }
    }, [])

    const [triggerGetProducts, { isLoading, isError, error }] = useLazyGetProductsQuery()

    const [products, setProducts] = useState([])
    const getProducts = async () => {
        try {
            const response = await triggerGetProducts({ franchiseId }).unwrap()
            setProducts([...response])
        } catch (e) {}
    }
    useEffect(() => {
        if (franchises.length) {
            setFranchise(franchises.find(franchise => franchise.franchiseId === franchiseId))
            getProducts()
        }
    }, [franchises])
    useEffect(() => {
        const messageId = `productsFetchError-${franchiseId}`
        if (isError) {
            dispatch(
                addErrorMessage({
                    title: `Failed to fetch products for ${franchise.franchiseName}`,
                    description: get(error, 'data.error', CONNECTION_ERROR_MESSAGE),
                    id: messageId,
                }),
            )
        }
    }, [isError])

    useEffect(() => {
        const messageId = `productsFetchInfo-${franchiseId}`
        if (isLoading) {
            dispatch(
                addInfoMessage({
                    title: 'Fetching products...',
                    description: `Please wait while the system retrieves the products for ${franchise.franchiseName}`,
                    id: messageId,
                }),
            )
        } else {
            dispatch(removeInfoMessage(messageId))
        }
    }, [isLoading])
    return (
        <div>
            {franchise.franchiseName}
            <br />
            {(isLoading && <h2>Loading...</h2>) || <></>}
            {products && (
                <div>
                    <b>Products:</b>
                    {products.map(product => (
                        <div>
                            Product {product.productId}&nbsp;
                            <a href={`/product?&productId=${product.productId}`}>{product.productName}</a>
                        </div>
                    ))}
                </div>
            ) || <></>}
        </div>
    )
}
export default Franchise

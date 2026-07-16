import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { get } from 'lodash'

import { useLazyGetProductsQuery } from '../../redux/api/mediaEndpoints'
import { addInfoMessage, removeInfoMessage, addErrorMessage } from '../../redux/api/globalSlice'
import { CONNECTION_ERROR_MESSAGE } from '../../shared/constants'
import { createFlashbarMessages } from '../../shared/utils'

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

    const isLoadingArray = [
        {
            isLoading,
            title: 'Fetching products',
            description: `Please wait while the system retrieves the products for ${franchise.franchiseName}`,
            id: `productsFetchInfo-${franchiseId}`,
        },
    ]
    const isErrorArray = [
        {
            isError,
            error,
            title: `Failed to fetch products for ${franchise.franchiseName}`,
            id: `productsFetchError-${franchiseId}`,
        },
    ]
    const isSuccessArray = []
    createFlashbarMessages({ isLoadingArray, isErrorArray, isSuccessArray, dispatch })

    return (
        <div>
            {franchise.franchiseName}
            <br />
            {(isLoading && <h2>Loading...</h2>) || <></>}
            {(products && (
                <div>
                    <b>Products:</b>
                    {products.map(product => (
                        <div>
                            Product {product.productId}&nbsp;
                            <a href={`/product?&productId=${product.productId}`}>
                                {product.productName}
                            </a>
                        </div>
                    ))}
                </div>
            )) || <></>}
        </div>
    )
}
export default Franchise

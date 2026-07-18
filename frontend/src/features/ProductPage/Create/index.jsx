import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { get, isUndefined } from 'lodash'

import {
    useLazyGetProductPresignedUrlsQuery,
    useCreateGameMutation,
} from '../../../redux/api/mediaEndpoints'
import {
    addSuccessMessage,
    addInfoMessage,
    removeInfoMessage,
    addErrorMessage,
} from '../../../redux/api/globalSlice'
import { Select } from '../../../shared/components'
import { DEFAULT_FRANCHISE, CONNECTION_ERROR_MESSAGE } from '../../../shared/constants'
import { createFlashbarMessages } from '../../../shared/utils'

import '../../../styles/App.css'

const getFileNamesFromFile = file => {
    return file.map(file => file.name)
}

const generateSelectItems = items => {
    return items.map(item => ({
        id: item.franchiseId,
        label: item.franchiseName,
        disabled: item.disabled,
    }))
}

const ProductPageCreate = () => {
    const dispatch = useDispatch()
    const { username, group } = useSelector(state => state.userReducer)
    const { franchises } = useSelector(state => state.globalReducer)
    const [
        triggerGetProductPresignedUrls,
        {
            isLoading: getProductPresignedUrlsIsLoading,
            isError: getProductPresignedUrlsIsError,
            error: getProductPresignedUrlsError,
            isSuccess: getProductPresignedUrlsIsSuccess,
        },
    ] = useLazyGetProductPresignedUrlsQuery()
    const [
        triggerCreateProduct,
        {
            isLoading: createProductIsLoading,
            isError: createProductIsError,
            error: createProductError,
            isSuccess: createProductIsSuccess,
        },
    ] = useCreateGameMutation()
    const [file, setFile] = useState(undefined)
    const [productName, setProductName] = useState('')
    const [price, setPrice] = useState(0)
    const [selectedFranchise, setSelectedFranchise] = useState(DEFAULT_FRANCHISE)
    const [isUploadingFile, setIsUploadingFile] = useState(false)
    const [isUploadingFileSuccess, setIsUploadingFileSuccess] = useState(false)
    const [errors, setErrors] = useState({
        file: false,
        productName: false,
        franchise: false,
        price: false,
    })

    const isLoadingArray = [
        {
            isLoading: getProductPresignedUrlsIsLoading,
            title: 'Generating presigned URLs',
            description: 'Please wait as the system generates all of the presigned URLs',
            id: 'presignedURLFetch',
        },
        {
            isLoading: createProductIsLoading,
            title: 'Creating product',
            description: 'Please wait as the system finalizes the product',
            id: 'createProductInfo',
        },
        {
            isLoading: isUploadingFile,
            title: 'Uploading file',
            description: 'Please wait as the file is being uploaded',
            id: 'uploadFileInfo',
        },
    ]
    const isErrorArray = [
        {
            isError: getProductPresignedUrlsIsError,
            error: getProductPresignedUrlsError,
            title: 'Failed to generate presigned URLs',
            id: 'presignedURLFetchError',
        },
        {
            isError: createProductIsError,
            error: createProductError,
            title: 'Failed to finalize product',
            id: 'createProductError',
        },
    ]
    const isSuccessArray = [
        {
            isSuccess: getProductPresignedUrlsIsSuccess,
            title: 'Successfully generated presigned URLs',
            description: 'Presigned URL successfully generated',
            id: 'presignedURLFetchSuccess',
        },
        {
            isSuccess: createProductIsSuccess,
            title: 'Successfully finalized product',
            description: 'Product has been successfully created',
            id: 'createProductSuccess',
        },
        {
            isSuccess: isUploadingFileSuccess,
            title: 'File successfully uploaded',
            description: 'File successfully uploaded',
            id: 'presignedURLUploadSuccess',
        },
    ]
    createFlashbarMessages({ isLoadingArray, isErrorArray, isSuccessArray, dispatch })

    const handleUpload = async () => {
        setIsUploadingFile(true)
        setIsUploadingFileSuccess(false)
        try {
            const { presignedUrls } = await triggerGetProductPresignedUrls({
                fileNames: getFileNamesFromFile([file]),
                method: 'PUT',
            }).unwrap()
            try {
                await fetch(presignedUrls[file.name], {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: file,
                })
                setIsUploadingFileSuccess(true)
            } catch (e) {
                dispatch(
                    addErrorMessage({
                        title: 'Failed to upload file',
                        description: 'File failed to be uploaded',
                        id: 'uploadFileError',
                    }),
                )
            }
        } catch (e) {}
        setIsUploadingFile(false)
    }
    const createProduct = async input => {
        try {
            const response = await triggerCreateProduct(input).unwrap()
            window.location.href = `/product?productId=${response.productId}`
        } catch (e) {}
    }
    useEffect(() => {
        if (isUploadingFileSuccess) {
            try {
                createProduct({
                    productName,
                    franchiseId: selectedFranchise.franchiseId,
                    price,
                })
            } catch (e) {}
        }
    }, [isUploadingFileSuccess])
    return (
        (group !== 'admin' && (
            <div>
                <h1>Unauthorized</h1>
            </div>
        )) || (
            <div className="ph-xs">
                <h1>Product creation</h1>
                <h2>Upload files here</h2>
                <input
                    type="file"
                    className={`${errors.file && 'error-text'}`}
                    onChange={event => {
                        const file = event.target.files[0]
                        setErrors({
                            ...errors,
                            file: isUndefined(file),
                        })
                        setFile(file)
                    }}
                />
                <br />
                <h2>Product name</h2>
                <input
                    className={`${errors.productName && 'error-text'}`}
                    value={productName}
                    onChange={event => {
                        setErrors({
                            ...errors,
                            productName: event.target.value === 0,
                        })
                        setProductName(event.target.value)
                    }}
                />
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
                <h2>Input price</h2>
                <input
                    className={`${errors.price && 'error-text'}`}
                    value={price}
                    onChange={event => {
                        const newPrice = parseInt(event.target.value)
                        setErrors({
                            ...errors,
                            price: newPrice <= 0,
                        })
                        setPrice(newPrice)
                    }}
                />
                <div>
                    <button
                        onClick={() => {
                            console.debug(file)
                            if (
                                file &&
                                productName &&
                                selectedFranchise.franchiseId !== DEFAULT_FRANCHISE.franchiseId &&
                                price > 0
                            ) {
                                handleUpload()
                            } else {
                                setErrors({
                                    file: isUndefined(file),
                                    productName: productName.length === 0,
                                    franchise:
                                        selectedFranchise.franchiseId ===
                                        DEFAULT_FRANCHISE.franchiseId,
                                    price: price <= 0,
                                })
                            }
                        }}
                    >
                        Finalize and upload
                    </button>
                </div>
            </div>
        )
    )
}

export default ProductPageCreate

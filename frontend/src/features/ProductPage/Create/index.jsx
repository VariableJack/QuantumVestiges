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
    const [selectedFranchise, setSelectedFranchise] = useState(DEFAULT_FRANCHISE)
    const [isUploadingFile, setIsUploadingFile] = useState(false)
    const [isUploadingFileSuccess, setIsUploadingFileSuccess] = useState(false)
    const [errors, setErrors] = useState({ file: false, productName: false, franchise: false })
    useEffect(() => {
        if (getProductPresignedUrlsIsLoading) {
            dispatch(
                addInfoMessage({
                    title: 'Generating presigned URLs',
                    description: 'Please wait as the system generates all of the presigned URLs',
                    id: 'presignedURLFetch',
                }),
            )
        } else {
            dispatch(removeInfoMessage('presignedURLFetch'))
        }
    }, [getProductPresignedUrlsIsLoading])
    useEffect(() => {
        if (getProductPresignedUrlsIsError) {
            dispatch(
                addErrorMessage({
                    title: 'Failed to generate presigned URLs',
                    description: get(
                        getProductPresignedUrlsError,
                        'data.error',
                        CONNECTION_ERROR_MESSAGE,
                    ),
                    id: 'presignedURLFetchError',
                }),
            )
        }
    }, [getProductPresignedUrlsIsError])
    useEffect(() => {
        if (getProductPresignedUrlsIsSuccess) {
            dispatch(
                addSuccessMessage({
                    title: 'Successfully generated presigned URLs',
                    description: 'Presigned URL successfully generated',
                    id: 'presignedURLFetchSuccess',
                }),
            )
        }
    }, [getProductPresignedUrlsIsSuccess])
    useEffect(() => {
        if (createProductIsLoading) {
            dispatch(
                addInfoMessage({
                    title: 'Creating product',
                    description: 'Please wait as the system finalizes the product',
                    id: 'createProductInfo',
                }),
            )
        } else {
            dispatch(removeInfoMessage('createProductInfo'))
        }
    }, [createProductIsLoading])
    useEffect(() => {
        if (createProductIsError) {
            dispatch(
                addErrorMessage({
                    title: 'Failed to finalize product',
                    description: get(createProductError, 'data.error', CONNECTION_ERROR_MESSAGE),
                    id: 'createProductError',
                }),
            )
        }
    }, [createProductIsError])
    useEffect(() => {
        if (isUploadingFile) {
            dispatch(
                addInfoMessage({
                    title: 'Uploading file',
                    description: 'Please wait as the file is being uploaded',
                    id: 'uploadFileInfo',
                }),
            )
        } else {
            dispatch(removeInfoMessage('uploadFileInfo'))
        }
    }, [isUploadingFile])
    useEffect(() => {
        if (isUploadingFileSuccess) {
            dispatch(
                addSuccessMessage({
                    title: 'File successfully uploaded',
                    description: 'File successfully uploaded',
                    id: 'presignedURLUploadSuccess',
                }),
            )
            try {
                createProduct({
                    productName,
                    franchiseId: selectedFranchise.franchiseId,
                    price: 5,
                })
            } catch (e) {}
        }
    }, [isUploadingFileSuccess])

    const handleUpload = async () => {
        setIsUploadingFile(true)
        setIsUploadingFileSuccess(false)
        try {
            const { presignedUrls } = await triggerGetProductPresignedUrls({
                fileNames: getFileNamesFromFile([file]),
                method: 'PUT',
            }).unwrap()
            try {
                await fetch(presignedUrls[file.webkitRelativePath], {
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
            dispatch(
                addSuccessMessage({
                    title: 'Successfully finalized product',
                    description: 'Product has been successfully created',
                    id: 'createProductSuccess',
                }),
            )
            window.location.href = `/product?productId=${response.productId}`
        } catch (e) {}
    }
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
                <h3>Select franchise to create product under</h3>
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
                <div>
                    <button
                        onClick={() => {
                            console.debug(file)
                            if (
                                file &&
                                productName &&
                                selectedFranchise.franchiseId !== DEFAULT_FRANCHISE.franchiseId
                            ) {
                                handleUpload()
                            } else {
                                setErrors({
                                    file: isUndefined(file),
                                    productName: productName.length === 0,
                                    franchise:
                                        selectedFranchise.franchiseId ===
                                        DEFAULT_FRANCHISE.franchiseId,
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

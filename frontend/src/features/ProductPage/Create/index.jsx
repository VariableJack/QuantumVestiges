import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { get } from 'lodash'

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

const getFileNamesFromFiles = files => {
    return files.map(file => file.webkitRelativePath)
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
    const [files, setFiles] = useState([])
    const [productName, setProductName] = useState('')
    const [selectedFranchise, setSelectedFranchise] = useState(DEFAULT_FRANCHISE)
    const [isUploadingFiles, setIsUploadingFiles] = useState(false)
    const [isUploadingFilesSuccess, setIsUploadingFilesSuccess] = useState(false)
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
                    description: `All ${files.length} presigned URLs successfully generated`,
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
        if (isUploadingFiles) {
            dispatch(
                addInfoMessage({
                    title: 'Uploading files',
                    description: 'Please wait as the files are being uploaded',
                    id: 'uploadFilesInfo',
                }),
            )
        } else {
            dispatch(removeInfoMessage('uploadFilesInfo'))
        }
    }, [isUploadingFiles])
    useEffect(() => {
        if (isUploadingFilesSuccess) {
            dispatch(
                addSuccessMessage({
                    title: 'Files successfully uploaded',
                    description: `All ${files.length} successfully uploaded`,
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
    }, [isUploadingFilesSuccess])

    const handleUpload = async () => {
        setIsUploadingFiles(true)
        setIsUploadingFilesSuccess(false)
        const filesSucceeded = []
        const filesFailed = []
        try {
            const { presignedUrls } = await triggerGetProductPresignedUrls({
                fileNames: getFileNamesFromFiles(files),
                method: 'PUT',
            }).unwrap()
            files.forEach(async file => {
                try {
                    await fetch(presignedUrls[file.webkitRelativePath], {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: file,
                    })
                    filesSucceeded.push(file)
                } catch (e) {
                    filesFailed.push(file)
                }
            })
        } catch (e) {}
        if (filesFailed.length) {
            dispatch(
                addErrorMessage({
                    title: 'Failed to upload files',
                    description: `${filesFailed.length} files failed to be uploaded`,
                    id: 'uploadFilesError',
                }),
            )
        } else {
            setIsUploadingFilesSuccess(true)
        }
        setIsUploadingFiles(false)
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
                <h1>Upload folder here</h1>
                <input
                    type="file"
                    multiple
                    webkitdirectory=""
                    directory=""
                    onChange={event => {
                        setFiles(Array.from(event.target.files))
                        const firstFile = event.target.files[0]
                        setProductName(
                            firstFile.webkitRelativePath.substring(
                                0,
                                firstFile.webkitRelativePath.indexOf('/'),
                            ),
                        )
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
                {(files.length && (
                    <div className="pv-xs">Detected product name {productName}</div>
                )) || <></>}
                <div>
                    <button
                        onClick={() => {
                            if (files.length) {
                                handleUpload()
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

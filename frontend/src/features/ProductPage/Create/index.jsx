import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { isUndefined } from 'lodash'

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
import { Select, Wizard } from '../../../shared/components'
import { DEFAULT_FRANCHISE, CONNECTION_ERROR_MESSAGE } from '../../../shared/constants'
import { createFlashbarMessages } from '../../../shared/utils'

import '../../../styles/App.css'

import BasicInfo from './BasicInfo'
import FileUpload from './FileUpload'
import FinalizeAndSubmit from './FinalizeAndSubmit'

const getFileNamesFromFiles = (franchiseName, productName, file) => {
    return file.map(file => `${franchiseName}/${productName}/${file.name}`)
}

const validatePayload = payload => {
    return payload.thumbnail && payload.assets && payload.franchise
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
    const [payload, setPayload] = useState({
        productName: '',
        description: '',
        price: 0,
        thumbnail: '',
        assets: '',
        releaseState: 'DEVELOPMENT',
    })
    const [thumbnailFile, setThumbnailFile] = useState(undefined)
    const [assetFiles, setAssetFiles] = useState(undefined)
    const [selectedFranchise, setSelectedFranchise] = useState(DEFAULT_FRANCHISE)
    const [isUploadingFile, setIsUploadingFile] = useState(false)
    const [isUploadingFileSuccess, setIsUploadingFileSuccess] = useState(false)
    const [errors, setErrors] = useState({
        pageOne: {
            productName: false,
            description: false,
            franchise: false,
            price: false,
        },
        pageTwo: {
            file: false,
            thumbnail: false,
            assets: false,
        },
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
                fileNames: getFileNamesFromFiles(selectedFranchise.franchiseName, productName, [
                    file,
                    thumbnailFile,
                    ...assetFiles,
                ]),
                method: 'PUT',
            }).unwrap()
            try {
                await fetch(presignedUrls[file.name], {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: file,
                })
                await fetch(
                    presignedUrls[
                        getFileNamesFromFiles(selectedFranchise.franchiseName, productName, [
                            thumbnailFile,
                        ])
                    ],
                    {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: thumbnailFile,
                    },
                )
                assetFiles.forEach(async assetFile => {
                    await fetch(
                        presignedUrls[
                            getFileNamesFromFiles(selectedFranchise.franchiseName, productName, [
                                assetFile,
                            ])
                        ],
                        {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: assetFile,
                        },
                    )
                })
                setPayload({
                    ...payload,
                    thumbnail: getFileNamesFromFiles(selectedFranchise.franchiseName, productName, [
                        thumbnailFile,
                    ]),
                    assets: getFileNamesFromFiles(
                        selectedFranchise.franchiseName,
                        productName,
                        assetFiles,
                    ).join(','),
                })
                setIsUploadingFileSuccess(true)
            } catch (e) {
                dispatch(
                    addErrorMessage({
                        title: 'Failed to upload files',
                        description: 'Files failed to be uploaded',
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
                    //productName,
                    franchiseId: selectedFranchise.franchiseId,
                    ...payload,
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
            <Wizard
                elements={[
                    <BasicInfo
                        payload={payload}
                        setPayload={setPayload}
                        errors={errors}
                        setErrors={setErrors}
                        franchises={franchises}
                        selectedFranchise={selectedFranchise}
                        setSelectedFranchise={setSelectedFranchise}
                    />,
                    <FileUpload
                        payload={payload}
                        setPayload={setPayload}
                        errors={errors}
                        setErrors={setErrors}
                        file={file}
                        setFile={setFile}
                        thumbnailFile={thumbnailFile}
                        setThumbnailFile={setThumbnailFile}
                        assetFiles={assetFiles}
                        setAssetFiles={setAssetFiles}
                    />,
                    <FinalizeAndSubmit errors={errors} setErrors={setErrors} />,
                ]}
                shouldAllowPrimaryButtons={[
                    payload.productName && payload.description && selectedFranchise.franchiseName,
                    file && payload.thumbnail && payload.assets,

                    payload.productName &&
                        payload.description &&
                        selectedFranchise.franchiseName &&
                        file &&
                        payload.thumbnail &&
                        payload.assets,
                ]}
                handleUpload={handleUpload}
            />
        )
    )
}

export default ProductPageCreate

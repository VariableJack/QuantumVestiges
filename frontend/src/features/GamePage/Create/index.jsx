import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { get } from 'lodash'

import {
    useLazyGetGamePresignedUrlsQuery,
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

const GamePageCreate = () => {
    const dispatch = useDispatch()
    const { username, group } = useSelector(state => state.userReducer)
    const { franchises } = useSelector(state => state.globalReducer)
    const [
        triggerGetGamePresignedUrls,
        {
            isLoading: getGamePresignedUrlsIsLoading,
            isError: getGamePresignedUrlsIsError,
            error: getGamePresignedUrlsError,
            isSuccess: getGamePresignedUrlsIsSuccess,
        },
    ] = useLazyGetGamePresignedUrlsQuery()
    const [
        triggerCreateGame,
        {
            isLoading: createGameIsLoading,
            isError: createGameIsError,
            error: createGameError,
            isSuccess: createGameIsSuccess,
        },
    ] = useCreateGameMutation()
    const [files, setFiles] = useState([])
    const [gameName, setGameName] = useState('')
    const [selectedFranchise, setSelectedFranchise] = useState(DEFAULT_FRANCHISE)
    const [isUploadingFiles, setIsUploadingFiles] = useState(false)
    useEffect(() => {
        if (getGamePresignedUrlsIsLoading) {
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
    }, [getGamePresignedUrlsIsLoading])

    useEffect(() => {
        if (getGamePresignedUrlsIsError) {
            dispatch(
                addErrorMessage({
                    title: 'Failed to generate presigned URLs',
                    description: get(
                        getGamePresignedUrlsError,
                        'data.error',
                        CONNECTION_ERROR_MESSAGE,
                    ),
                    id: 'presignedURLFetchError',
                }),
            )
        }
    }, [getGamePresignedUrlsIsError])

    useEffect(() => {
        if (getGamePresignedUrlsIsSuccess) {
            dispatch(
                addSuccessMessage({
                    title: 'Successfully generated presigned URLs',
                    description: `All ${files.length} presigned URLs successfully generated`,
                    id: 'presignedURLFetchSuccess',
                }),
            )
            try {
                const game = triggerCreateGame({
                    productName: gameName,
                    franchiseId: selectedFranchise.franchiseId,
                    price: 5,
                })
            } catch (e) {}
        }
    }, [getGamePresignedUrlsIsSuccess])

    useEffect(() => {
        if (createGameIsLoading) {
            dispatch(
                addInfoMessage({
                    title: 'Creating game',
                    description: 'Please wait as the system finalizes the game',
                    id: 'createGameInfo',
                }),
            )
        } else {
            dispatch(removeInfoMessage('createGameInfo'))
        }
    }, [createGameIsLoading])

    useEffect(() => {
        if (createGameIsError) {
            dispatch(
                addErrorMessage({
                    title: 'Failed to finalize game',
                    description: get(createGameError, 'data.error', CONNECTION_ERROR_MESSAGE),
                    id: 'createGameError',
                }),
            )
        }
    }, [getGamePresignedUrlsIsError])

    useEffect(() => {
        if (createGameIsSuccess) {
            dispatch(
                addSuccessMessage({
                    title: 'Successfully finalized game',
                    description: 'Game has been successfully created',
                    id: 'createGameSuccess',
                }),
            )
        }
    }, [createGameIsSuccess])

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

    const handleUpload = async () => {
        setIsUploadingFiles(true)
        const filesSucceeded = []
        const filesFailed = []
        try {
            const { presignedUrls } = await triggerGetGamePresignedUrls({
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
        }
        setIsUploadingFiles(false)
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
                        setGameName(
                            firstFile.webkitRelativePath.substring(
                                0,
                                firstFile.webkitRelativePath.indexOf('/'),
                            ),
                        )
                    }}
                />
                <h3>Select franchise to create game under</h3>
                <Select
                    items={generateSelectItems([
                        ...franchises.map(franchise => ({ ...franchise, disabled: false })),
                        { ...DEFAULT_FRANCHISE, disabled: true },
                    ])}
                    selectedItem={{
                        id: selectedFranchise.franchiseId,
                        label: selectedFranchise.franchiseName,
                    }}
                    onChange={item => setSelectedFranchise(item)}
                />
                {(files.length && <div className="pv-xs">Detected game name {gameName}</div>) || (
                    <></>
                )}
                <div>
                    <button
                        onClick={() => {
                            handleUpload()
                        }}
                    >
                        Finalize and upload
                    </button>
                </div>
            </div>
        )
    )
}

export default GamePageCreate

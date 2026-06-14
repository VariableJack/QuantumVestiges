import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { get } from 'lodash'

import { useLazyGetInstallerQuery } from '../../redux/api/mediaEndpoints'
import {
    addSuccessMessage,
    addInfoMessage,
    removeInfoMessage,
    addErrorMessage,
} from '../../redux/api/globalSlice'
import { CONNECTION_ERROR_MESSAGE } from '../../shared/constants'

const DownloadInstaller = () => {
    const dispatch = useDispatch()
    const [
        triggerGetInstaller,
        {
            isLoading: getInstallerIsLoading,
            isError: getInstallerIsError,
            error: getInstallerError,
            isSuccess: getInstallerIsSuccess,
        },
    ] = useLazyGetInstallerQuery()
    const [downloadState, setDownloadState] = useState({
        isLoading: false,
        isError: false,
        isSuccess: false,
        error: undefined,
    })
    useEffect(() => {
        const messageId = 'installerDownload'
        if (downloadState.isLoading || getInstallerIsLoading) {
            dispatch(
                addInfoMessage({
                    title: 'Downloading files',
                    description: 'Your installer is beginning to download. Please wait',
                    id: messageId,
                }),
            )
        } else {
            dispatch(removeInfoMessage(messageId))
        }
    }, [downloadState, getInstallerIsLoading])

    useEffect(() => {
        if (getInstallerIsError) {
            dispatch(
                addErrorMessage({
                    title: 'Failed to download',
                    description: `Failed to download installer due to ${get(getInstallerIsError, 'data.error', CONNECTION_ERROR_MESSAGE)}`,
                    id: 'installerDownloadFailed',
                }),
            )
        }
        if (downloadState.isError) {
            dispatch(
                addErrorMessage({
                    title: 'Failed to download',
                    description: `Failed to download installer due to ${downloadState.error}`,
                    id: 'installerDownloadFailed',
                }),
            )
        }
    }, [downloadState, getInstallerIsError])

    useEffect(() => {
        if (downloadState.isSuccess && getInstallerIsSuccess) {
            dispatch(
                addSuccessMessage({
                    title: 'Installer successfully downloaded',
                    description: 'The installer has successfully downloaded',
                    id: 'installerDownloadSuccess',
                }),
            )
        }
    }, [downloadState, getInstallerIsSuccess])
    const handleDownload = async () => {
        try {
            const { installer } = await triggerGetInstaller().unwrap()
            setDownloadState({
                isLoading: true,
                isError: false,
                error: undefined,
                isSuccess: false,
            })
            await fetch(installer, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            })
                .then(response => {
                    return response.blob()
                })
                .then(blob => {
                    const url = window.URL.createObjectURL(blob)
                    const link = document.createElement('a')
                    link.href = url
                    link.download = 'QuantumVestiges-Installer.exe'
                    link.click()
                    setDownloadState({
                        isLoading: false,
                        isError: false,
                        error: undefined,
                        isSuccess: true,
                    })
                })
                .catch(error => {
                    setDownloadState({
                        isLoading: false,
                        isError: true,
                        error,
                        isSuccess: false,
                    })
                })
        } catch (e) {}
    }
    return (
        <div>
            <h1>Download our games via our installer</h1>
            <button onClick={handleDownload}>Download now</button>
        </div>
    )
}

export default DownloadInstaller

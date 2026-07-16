import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { get } from 'lodash'

import { useLazyGetInstallerQuery } from '../../redux/api/mediaEndpoints'
import { createFlashbarMessages } from '../../shared/utils'

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

    const isLoadingArray = [
        {
            isLoading: downloadState.isLoading || getInstallerIsLoading,
            title: 'Downloading installer',
            description: 'Your installer is beginning to download. Please wait',
            id: 'installerDownloadFetch',
        },
    ]
    const isErrorArray = [
        {
            isError: getInstallerIsError || downloadState.isError,
            title: 'Failed to download',
            error: getInstallerIsError
                ? getInstallerError
                : { data: { error: downloadState.error } },
            id: 'installerDownloadError',
        },
    ]
    const isSuccessArray = [
        {
            isSuccess: downloadState.isSuccess && getInstallerIsSuccess,
            title: 'Installer successfully downloaded',
            description: 'The installer has successfully downloaded',
            id: 'installerDownloadSuccess',
        },
    ]
    createFlashbarMessages({
        isLoadingArray,
        isErrorArray,
        isSuccessArray,
        dispatch,
    })

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

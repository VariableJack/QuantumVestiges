import React from 'react'
import { isUndefined } from 'lodash'

const FileUpload = props => {
    const {
        payload,
        setPayload,
        errors,
        setErrors,
        file,
        setFile,
        thumbnailFile,
        setThumbnailFile,
        assetFiles,
        setAssetFiles,
    } = props
    return (
        <>
            <h1>Upload product files</h1>
            <h2>Core files here</h2>
            <input
                type="file"
                className={`${errors.pageTwo.file && 'error-text'}`}
                onChange={event => {
                    const file = event.target.files[0]
                    setErrors({
                        ...errors,
                        pageTwo: {
                            ...errors.pageTwo,
                            file: isUndefined(file),
                        },
                    })
                    setFile(file)
                }}
            />
            <h2>Thumbnail</h2>
            <input
                type="file"
                className={`${errors.pageTwo.thumbnailFile && 'error-text'}`}
                onChange={event => {
                    const thumbnailFile = event.target.files[0]
                    setErrors({
                        ...errors,
                        pageTwo: {
                            ...errors.pageTwo,
                            thumbnailFile: isUndefined(thumbnailFile),
                        },
                    })
                    setThumbnailFile(thumbnailFile)
                }}
            />
            <h2>Additional videos and images</h2>
            <input
                type="file"
                className={`${errors.pageTwo.assetFiles && 'error-text'}`}
                onChange={event => {
                    const assetFiles = event.target.files
                    setErrors({
                        ...errors,
                        pageTwo: {
                            ...errors.pageTwo,
                            assetFiles: isUndefined(assetFiles) || assetFiles.length === 0,
                        },
                    })
                    setAssetFiles(assetFiles)
                }}
                multiple
            />
        </>
    )
}
export default FileUpload

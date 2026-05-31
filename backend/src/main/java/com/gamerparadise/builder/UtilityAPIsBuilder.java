package com.gamerparadise.builder;

import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Autowired;

import lombok.NonNull;

import com.gamerparadise.accessor.S3Accessor;

@Component
public class UtilityAPIsBuilder {
    @Autowired
    private S3Accessor s3Accessor;

    public String generatePresignedUrl(@NonNull String fileName, @NonNull String method, @NonNull String bucketName) {
        return s3Accessor.generatePresignedUrl(fileName, method, bucketName);
    }
}
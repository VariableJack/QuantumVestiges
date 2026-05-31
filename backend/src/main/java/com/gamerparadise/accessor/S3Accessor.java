package com.gamerparadise.accessor;

import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;

import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.GetObjectPresignRequest;
import software.amazon.awssdk.services.s3.presigner.model.PresignedGetObjectRequest;
import software.amazon.awssdk.services.s3.presigner.model.PutObjectPresignRequest;
import software.amazon.awssdk.services.s3.presigner.model.PresignedPutObjectRequest;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import lombok.NonNull;
import java.util.Date;
import java.time.Duration;

@Component
public class S3Accessor {
    @Autowired
    private S3Presigner s3Presigner;
    private static final Logger logger = LogManager.getLogger(S3Accessor.class);

    public String generatePresignedUrl(@NonNull String fileName, @NonNull String method, @NonNull String bucketName) {
        final Duration signatureDuration = Duration.ofHours(1);
        switch (method) {
            case "GET":
                final GetObjectRequest getObjectRequest = GetObjectRequest.builder()
                    .bucket(bucketName)
                    .key(fileName)
                    .build();
                final GetObjectPresignRequest getObjectPresignRequest = GetObjectPresignRequest.builder()
                    .getObjectRequest(getObjectRequest)
                    .signatureDuration(signatureDuration)
                    .build();
                final PresignedGetObjectRequest presignedGetObjectRequest = s3Presigner.presignGetObject(getObjectPresignRequest);
                return presignedGetObjectRequest.url().toString();
            case "PUT":
                final PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                    .bucket(bucketName)
                    .key(fileName)
                    .build();
                final PutObjectPresignRequest putObjectPresignRequest = PutObjectPresignRequest.builder()
                    .putObjectRequest(putObjectRequest)
                    .signatureDuration(signatureDuration)
                    .build();
                final PresignedPutObjectRequest presignedPutObjectRequest = s3Presigner.presignPutObject(putObjectPresignRequest);
                return presignedPutObjectRequest.url().toString();
            default:
                // This case will never occur due to input validation at the activity layer
                return "";
        }
    }
}
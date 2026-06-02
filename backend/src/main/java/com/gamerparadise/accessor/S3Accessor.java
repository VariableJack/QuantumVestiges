package com.gamerparadise.accessor;

import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;

import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.model.ListObjectsV2Request;
import software.amazon.awssdk.services.s3.model.ListObjectsV2Response;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.GetObjectPresignRequest;
import software.amazon.awssdk.services.s3.presigner.model.PresignedGetObjectRequest;
import software.amazon.awssdk.services.s3.presigner.model.PutObjectPresignRequest;
import software.amazon.awssdk.services.s3.presigner.model.PresignedPutObjectRequest;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import lombok.NonNull;
import java.util.Date;
import java.util.Objects;
import java.util.ArrayList;
import java.util.List;

import static com.gamerparadise.shared.Constants.S3_MAX_KEYS;
import static com.gamerparadise.shared.Constants.PRESIGNED_URL_DURATION;

@Component
public class S3Accessor {
    @Autowired
    private S3Presigner s3Presigner;
    @Autowired
    private S3Client s3Client;
    private static final Logger logger = LogManager.getLogger(S3Accessor.class);

    public String generatePresignedUrl(@NonNull String fileName, @NonNull String method, @NonNull String bucketName) {
        switch (method) {
            case "GET":
                final GetObjectRequest getObjectRequest = GetObjectRequest.builder()
                    .bucket(bucketName)
                    .key(fileName)
                    .build();
                final GetObjectPresignRequest getObjectPresignRequest = GetObjectPresignRequest.builder()
                    .getObjectRequest(getObjectRequest)
                    .signatureDuration(PRESIGNED_URL_DURATION)
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
                    .signatureDuration(PRESIGNED_URL_DURATION)
                    .build();
                final PresignedPutObjectRequest presignedPutObjectRequest = s3Presigner.presignPutObject(putObjectPresignRequest);
                return presignedPutObjectRequest.url().toString();
            default:
                // This case will never occur due to input validation at the activity layer
                return "";
        }
    }

    public List<String> getFileNames(@NonNull String folder, @NonNull String bucketName) {
        String continuationToken = null;
        final List<String> fileNames = new ArrayList<>();
        do {
            final ListObjectsV2Request request = ListObjectsV2Request.builder()
                .bucket(bucketName)
                .prefix(folder)
                .maxKeys(S3_MAX_KEYS)
                .build();
            final ListObjectsV2Response response = s3Client.listObjectsV2(request);
            response.contents().stream().forEach((object) -> {
                fileNames.add(object.key());
            });
            continuationToken = response.nextContinuationToken();
        } while (Objects.nonNull(continuationToken));
        return fileNames;
    }
}
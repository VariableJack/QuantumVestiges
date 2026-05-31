package com.gamerparadise.component;

import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Autowired;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import lombok.NonNull;
import java.util.HashMap;
import java.util.Map;
import java.util.List;

import com.gamerparadise.accessor.S3Accessor;
import com.gamerparadise.component.dto.GeneratePresignedUrlsComponentDTO;
import com.gamerparadise.component.dto.GeneratePresignedUrlsOutputComponentDTO;
import com.gamerparadise.builder.UtilityAPIsBuilder;

@Component
public class UtilityAPIsComponent {
    @Autowired
    private UtilityAPIsBuilder utilityAPIsBuilder;

    private static final Logger logger = LogManager.getLogger(UtilityAPIsComponent.class);
    public GeneratePresignedUrlsOutputComponentDTO generatePresignedUrls(@NonNull GeneratePresignedUrlsComponentDTO input) {
        final Map<String, String> presignedUrls = new HashMap<>();
        input.getFileNames().forEach((fileName) -> {
            presignedUrls.put(fileName, utilityAPIsBuilder.generatePresignedUrl(fileName, input.getMethod(), input.getBucketName()));
        });
        return GeneratePresignedUrlsOutputComponentDTO.builder()
            .presignedUrls(presignedUrls)
            .build();
    }
}          
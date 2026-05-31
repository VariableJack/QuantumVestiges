package com.gamerparadise.activity.converter;
import org.springframework.stereotype.Component;

import lombok.NonNull;

import com.gamerparadise.activity.dto.GeneratePresignedUrlsActivityDTO;
import com.gamerparadise.activity.dto.GeneratePresignedUrlsOutputActivityDTO;
import com.gamerparadise.component.dto.GeneratePresignedUrlsComponentDTO;
import com.gamerparadise.component.dto.GeneratePresignedUrlsOutputComponentDTO;

@Component
public class UtilityAPIsActivityConverter {
    public GeneratePresignedUrlsComponentDTO convertGeneratePresignedUrlsActivityDTOToComponentDTO(
        @NonNull GeneratePresignedUrlsActivityDTO input,
        @NonNull String bucketName) {
        return GeneratePresignedUrlsComponentDTO.builder()
            .fileNames(input.getFileNames())
            .method(input.getMethod())
            .bucketName(bucketName)
            .build();
    }
    
    public GeneratePresignedUrlsOutputActivityDTO convertGeneratePresignedUrlsOutputComponentDTOToActivityDTO(
        @NonNull GeneratePresignedUrlsOutputComponentDTO input) {
        
        return GeneratePresignedUrlsOutputActivityDTO.builder()
            .presignedUrls(input.getPresignedUrls())
            .build();
    }
}
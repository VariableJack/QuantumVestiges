package com.gamerparadise.component.dto;

import java.util.List;
import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class GeneratePresignedUrlsComponentDTO {
    public List<String> fileNames;
    public String method;
    public String bucketName;
}
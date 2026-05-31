package com.gamerparadise.component.dto;

import java.util.Map;
import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class GeneratePresignedUrlsOutputComponentDTO {
    private Map<String, String> presignedUrls;
}
package com.gamerparadise.activity.dto;

import java.util.Map;
import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class GeneratePresignedUrlsOutputActivityDTO {
    private Map<String, String> presignedUrls;
}
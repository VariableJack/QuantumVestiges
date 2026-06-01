package com.gamerparadise.activity.dto;

import java.util.Map;
import lombok.Builder;
import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class GeneratePresignedUrlsOutputActivityDTO {
    private Map<String, String> presignedUrls;
}
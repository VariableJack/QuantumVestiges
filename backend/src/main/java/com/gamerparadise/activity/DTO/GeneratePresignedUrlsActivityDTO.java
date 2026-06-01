package com.gamerparadise.activity.dto;

import java.util.List;
import lombok.Builder;
import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class GeneratePresignedUrlsActivityDTO {
    private List<String> fileNames;
    private String method;
    private String type;
}
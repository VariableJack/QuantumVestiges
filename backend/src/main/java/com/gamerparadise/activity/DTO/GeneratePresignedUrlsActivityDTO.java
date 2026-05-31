package com.gamerparadise.activity.dto;

import java.util.List;
import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class GeneratePresignedUrlsActivityDTO {
    public List<String> fileNames;
    public String method;
    public String type;
}
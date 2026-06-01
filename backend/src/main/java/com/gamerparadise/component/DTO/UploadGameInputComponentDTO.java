package com.gamerparadise.component.dto;

import java.util.List;
import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class UploadGameInputComponentDTO {
    private String gameName;
    private Integer franchiseId;
    private String franchiseName;
    private List<String> fileNames;
}

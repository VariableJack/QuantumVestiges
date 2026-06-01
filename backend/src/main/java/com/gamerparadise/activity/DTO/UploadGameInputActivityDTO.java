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
public class UploadGameInputActivityDTO {
    private String gameName;
    private Integer franchiseId;
    private List<String> fileNames;
}

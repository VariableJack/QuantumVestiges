package com.gamerparadise.activity.dto;

import java.util.List;
import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class GetFileNamesForGameOutputActivityDTO {
    private List<String> fileNames;
}

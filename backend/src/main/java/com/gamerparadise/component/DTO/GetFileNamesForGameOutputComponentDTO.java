package com.gamerparadise.component.dto;

import java.util.List;
import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class GetFileNamesForGameOutputComponentDTO {
    private List<String> fileNames;
}

package com.gamerparadise.component.dto;

import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class FranchiseComponentDTO {
    private Integer franchiseId;
    private String franchiseName;
}

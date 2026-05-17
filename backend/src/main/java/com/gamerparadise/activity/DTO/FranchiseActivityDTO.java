package com.gamerparadise.activity.dto;

import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class FranchiseActivityDTO {
    private Integer franchiseId;
    private String franchiseName;
}

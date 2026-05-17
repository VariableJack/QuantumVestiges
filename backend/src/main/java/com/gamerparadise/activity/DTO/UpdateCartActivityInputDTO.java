package com.gamerparadise.activity.dto;

import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class UpdateCartActivityInputDTO {
    private Integer gameId;
    private String gameName;
    private String action;
}

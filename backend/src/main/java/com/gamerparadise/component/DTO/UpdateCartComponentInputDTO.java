package com.gamerparadise.component.dto;

import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class UpdateCartComponentInputDTO {
    private Integer gameId;
    private String gameName;
    private String action;
}

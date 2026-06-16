package com.gamerparadise.component.dto;

import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class UpdateCartComponentInputDTO {
    private Integer orderId;
    private Integer productId;
    private String action;
}

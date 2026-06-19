package com.gamerparadise.component.dto;

import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class UpdateOrderComponentInputDTO {
    private Integer orderId;
    private Integer productId;
    private int quantity;
    private String action;
}

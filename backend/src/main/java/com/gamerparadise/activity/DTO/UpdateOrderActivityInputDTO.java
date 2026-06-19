package com.gamerparadise.activity.dto;

import lombok.Builder;
import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class UpdateOrderActivityInputDTO {
    private Integer orderId;
    private Integer productId;
    private String action;
    private int quantity;
}

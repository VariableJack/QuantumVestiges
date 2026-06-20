package com.gamerparadise.activity.dto;

import java.sql.Timestamp;
import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class OrderItemActivityDTO {
    private Long orderItemId;
    private Long orderId;
    private Integer productId;
    private String productName;
    private String franchiseName;
    private Integer purchasePrice;
    private Integer quantity;
}

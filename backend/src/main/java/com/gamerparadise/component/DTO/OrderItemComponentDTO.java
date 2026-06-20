package com.gamerparadise.component.dto;

import java.sql.Timestamp;
import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class OrderItemComponentDTO {
    private Long orderItemId;
    private Long orderId;
    private Integer productId;
    private String productName;
    private String franchiseName;
    private Integer purchasePrice;
    private Integer quantity;
}

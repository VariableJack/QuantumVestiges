package com.gamerparadise.component.dto;

import java.sql.Timestamp;
import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class OrderItemComponentDTO {
    private long orderItemId;
    private long orderId;
    private long productId;
    private String productName;
    private Integer purchasePrice;
    private int quantity;
}

package com.gamerparadise.activity.dto;

import java.sql.Timestamp;
import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class OrderItemActivityDTO {
    private long orderItemId;
    private long orderId;
    private long productId;
    private Integer purchasePrice;
    private Timestamp quantity;
}

package com.gamerparadise.dao.dto;

import java.sql.Timestamp;
import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class OrderItemDAODTO {
    private long orderItemId;
    private long orderId;
    private long productId;
    private Integer purchasePrice;
    private Timestamp quantity;
}

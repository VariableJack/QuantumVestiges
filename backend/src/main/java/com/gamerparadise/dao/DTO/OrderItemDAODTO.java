package com.gamerparadise.dao.dto;

import java.sql.Timestamp;
import lombok.Builder;
import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderItemDAODTO {
    private long orderItemId;
    private long orderId;
    private long productId;
    private String productName;
    private Integer purchasePrice;
    private int quantity;
}

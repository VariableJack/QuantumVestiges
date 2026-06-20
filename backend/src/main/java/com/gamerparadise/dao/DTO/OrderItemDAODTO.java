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
    private Long orderItemId;
    private Long orderId;
    private Integer productId;
    private String productName;
    private String franchiseName;
    private Integer purchasePrice;
    private Integer quantity;
}

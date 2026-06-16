package com.gamerparadise.activity.dto;

import java.util.List;
import java.sql.Timestamp;
import lombok.Builder;
import lombok.Data;

import com.gamerparadise.activity.dto.OrderItemActivityDTO;

@Builder
@Data
public class OrderActivityDTO {
    private long orderId;
    private String username;
    private String orderStatus;
    private Integer totalPurchasePrice;
    private Timestamp createTime;
    private List<OrderItemActivityDTO> items;
}

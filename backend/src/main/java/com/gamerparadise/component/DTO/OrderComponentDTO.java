package com.gamerparadise.component.dto;

import java.util.List;
import java.sql.Timestamp;
import lombok.Builder;
import lombok.Data;

import com.gamerparadise.component.dto.OrderItemComponentDTO;

@Builder
@Data
public class OrderComponentDTO {
    private long orderId;
    private String username;
    private String orderStatus;
    private Integer totalPurchasePrice;
    private Timestamp createTime;
    private List<OrderItemComponentDTO> items;
}

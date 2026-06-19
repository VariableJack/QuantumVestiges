package com.gamerparadise.dao.dto;

import java.util.List;
import java.sql.Timestamp;
import lombok.Builder;
import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import com.gamerparadise.dao.dto.OrderItemDAODTO;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderDAODTO {
    private long orderId;
    private String username;
    private String orderStatus;
    private Integer totalPurchasePrice;
    private Timestamp createTime;
    private List<OrderItemDAODTO> items;
}

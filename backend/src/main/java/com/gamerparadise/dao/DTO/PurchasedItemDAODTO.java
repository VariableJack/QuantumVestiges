package com.gamerparadise.dao.dto;

import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class PurchasedItemDAODTO {
    private String username;
    private long productId;
    private String productName;
    private String productType;
    private String franchiseId;
    private String franchiseName;
}

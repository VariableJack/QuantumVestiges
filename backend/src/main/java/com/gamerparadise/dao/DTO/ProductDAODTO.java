package com.gamerparadise.dao.dto;

import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class ProductDAODTO {
    private Integer productId;
    private String productName;
    private Integer parentProductId;
    private String productType;
    private Integer franchiseId;
    private String franchiseName;
    private Integer price;
}

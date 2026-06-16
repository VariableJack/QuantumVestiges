package com.gamerparadise.component.dto;

import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class ProductComponentDTO {
    private Integer productId;
    private String productName;
    private Integer parentProductId;
    private String productType;
    private Integer franchiseId;
    private String franchiseName;
    private Integer price;
}

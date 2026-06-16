package com.gamerparadise.activity.dto;

import lombok.Builder;
import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class ProductActivityDTO {
    private Integer productId;
    private String productName;
    private Integer parentProductId;
    private String productType;
    private Integer franchiseId;
    private String franchiseName;
    private Integer price;
}

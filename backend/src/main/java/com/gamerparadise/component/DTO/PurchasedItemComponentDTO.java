package com.gamerparadise.component.dto;

import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class PurchasedItemComponentDTO {
    private String username;
    private long productId;
    private String productName;
    private String productType;
}

package com.gamerparadise.activity.dto;

import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class PurchasedItemActivityDTO {
    private Integer id;
    private String name;
    private String type;
}

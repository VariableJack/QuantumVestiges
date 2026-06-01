package com.gamerparadise.activity.dto;

import lombok.Builder;
import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class PurchasedItemActivityDTO {
    private Integer id;
    private String name;
    private String type;
}

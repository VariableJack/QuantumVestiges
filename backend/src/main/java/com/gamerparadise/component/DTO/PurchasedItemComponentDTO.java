package com.gamerparadise.component.dto;


import lombok.Builder;

import lombok.Data;


@Builder
@Data
public class PurchasedItemComponentDTO {
    private Integer id;

    private String name;

    private String type;

}

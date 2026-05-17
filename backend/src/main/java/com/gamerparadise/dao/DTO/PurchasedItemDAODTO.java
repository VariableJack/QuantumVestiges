package com.gamerparadise.dao.dto;

import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class PurchasedItemDAODTO {
    private Integer id;
    private String name;
    private String type;
}

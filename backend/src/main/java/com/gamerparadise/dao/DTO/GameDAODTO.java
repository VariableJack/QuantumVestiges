package com.gamerparadise.dao.dto;

import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class GameDAODTO {
    private Integer gameId;
    private String gameName;
    private Integer franchiseId;
    private String franchiseName;
}

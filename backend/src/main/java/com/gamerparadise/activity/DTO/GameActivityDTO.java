package com.gamerparadise.activity.dto;

import lombok.Builder;
import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class GameActivityDTO {
    private Integer gameId;
    private String gameName;
    private Integer franchiseId;
    private String franchiseName;
}

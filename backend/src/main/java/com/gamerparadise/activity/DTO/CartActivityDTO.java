package com.gamerparadise.activity.dto;

import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class CartActivityDTO {
	private Integer gameId;
	private String gameName;
	private Integer franchiseId;
	private String franchiseName;
}

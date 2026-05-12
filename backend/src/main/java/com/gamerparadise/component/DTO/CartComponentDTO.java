package com.gamerparadise.component.dto;

import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class CartComponentDTO {
	private String username;
	private Integer gameId;
	private String gameName;
	private Integer franchiseId;
	private String franchiseName;
}

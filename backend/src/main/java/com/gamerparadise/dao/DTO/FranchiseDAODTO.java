package com.gamerparadise.dao.dto;

import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class FranchiseDAODTO {
	private Integer franchiseId;
	private String franchiseName;
}

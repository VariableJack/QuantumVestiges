package com.gamerparadise.component.dto;

import java.util.List;
import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class UploadGameComponentInputDTO {
	private String gameName;
	private List<String> files;
}

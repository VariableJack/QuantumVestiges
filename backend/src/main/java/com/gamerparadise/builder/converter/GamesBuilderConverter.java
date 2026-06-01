package com.gamerparadise.builder.converter;
import org.springframework.stereotype.Component;

import lombok.NonNull;

import com.gamerparadise.component.dto.GameComponentDTO;
import com.gamerparadise.dao.dto.GameDAODTO;
import com.gamerparadise.component.dto.UploadGameInputComponentDTO;

@Component
public class GamesBuilderConverter {
    public GameComponentDTO convertGameDAODTOToComponentDTO(@NonNull GameDAODTO input) {
        return GameComponentDTO.builder()
            .gameId(input.getGameId())
            .gameName(input.getGameName())
            .franchiseId(input.getFranchiseId())
            .franchiseName(input.getFranchiseName())
            .build();
    }

    public GameDAODTO convertGameComponentDTOToDAODTO(@NonNull GameComponentDTO input) {
        return GameDAODTO.builder()
            .gameId(input.getGameId())
            .gameName(input.getGameName())
            .build();
    }

    public GameDAODTO convertGameUploadInputComponentDTOToDAODTO(@NonNull UploadGameInputComponentDTO input, @NonNull String franchiseName) {
        return GameDAODTO.builder()
            .gameName(input.getGameName())
            .franchiseId(input.getFranchiseId())
            .franchiseName(franchiseName)
            .build();
    }
}
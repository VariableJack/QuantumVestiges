package com.gamerparadise.builder.converter;
import org.springframework.stereotype.Component;

import lombok.NonNull;

import com.gamerparadise.component.dto.GameComponentDTO;
import com.gamerparadise.dao.dto.GameDAODTO;

@Component
public class GamesBuilderConverter {
    public GameComponentDTO convertGameDAODTOToComponentDTO(@NonNull GameDAODTO input) {
        return GameComponentDTO.builder()
            .gameId(input.getGameId())
            .gameName(input.getGameName())
            .build();
    }
}
package com.gamerparadise.builder;

import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Autowired;

import lombok.NonNull;
import java.util.List;
import java.util.Objects;

import com.gamerparadise.builder.converter.GamesBuilderConverter;
import com.gamerparadise.component.dto.GameComponentDTO;
import com.gamerparadise.dao.GamesDAO;
import com.gamerparadise.dao.dto.GameDAODTO;

@Component
public class GamesBuilder {
    @Autowired
    private GamesBuilderConverter gamesBuilderConverter;
    @Autowired
    private GamesDAO gamesDAO;

    public List<GameComponentDTO> getGames(@NonNull Integer franchiseId) {
        return gamesDAO.getGames(franchiseId)
            .stream()
            .map((game) -> gamesBuilderConverter.convertGameDAODTOToComponentDTO(game))
            .toList();

    }

    public GameComponentDTO getGameById(@NonNull Integer gameId) {
        final GameDAODTO output = gamesDAO.getGameById(gameId);
        if (Objects.isNull(output)) {
            return null;
        }
        return gamesBuilderConverter.convertGameDAODTOToComponentDTO(output);
    }
}
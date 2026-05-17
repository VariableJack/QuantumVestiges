package com.gamerparadise.builder;

import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Autowired;

import lombok.NonNull;
import java.util.List;

import com.gamerparadise.builder.converter.GamesBuilderConverter;
import com.gamerparadise.dao.GamesDAO;
import com.gamerparadise.component.dto.GameComponentDTO;

@Component
public class GamesBuilder {
    @Autowired
    private GamesBuilderConverter gamesBuilderConverter;
    @Autowired
    private GamesDAO gamesDAO;

    public List<GameComponentDTO> getGames(@NonNull Integer franchiseId, Integer gameId) {
        return gamesDAO.getGames(franchiseId, gameId)
            .stream()
            .map((game) -> gamesBuilderConverter.convertGameDAODTOToComponentDTO(game))
            .toList();

    }

    public GameComponentDTO getGameById(@NonNull Integer gameId) {
        return gamesBuilderConverter.convertGameDAODTOToComponentDTO(gamesDAO.getGameById(gameId));
    }
}
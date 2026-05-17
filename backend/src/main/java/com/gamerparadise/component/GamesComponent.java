package com.gamerparadise.component;

import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Autowired;

import lombok.NonNull;
import java.util.List;

import com.gamerparadise.builder.GamesBuilder;
import com.gamerparadise.component.dto.GameComponentDTO;

@Component
public class GamesComponent {
    @Autowired
    private GamesBuilder gamesBuilder;

    public List<GameComponentDTO> getGames(@NonNull Integer franchiseId, Integer gameId) {
        return gamesBuilder.getGames(franchiseId, gameId);
    }
}
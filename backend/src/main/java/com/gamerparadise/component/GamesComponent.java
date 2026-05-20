package com.gamerparadise.component;

import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import lombok.NonNull;
import java.util.List;
import java.util.Objects;

import com.gamerparadise.builder.GamesBuilder;
import com.gamerparadise.component.dto.GameComponentDTO;

@Component
public class GamesComponent {
    @Autowired
    private GamesBuilder gamesBuilder;
    private static final Logger logger = LogManager.getLogger(GamesComponent.class);

    public List<GameComponentDTO> getGames(@NonNull Integer franchiseId) {
        return gamesBuilder.getGames(franchiseId);
    }

    public GameComponentDTO getGameById(@NonNull Integer gameId) {
        final GameComponentDTO output = gamesBuilder.getGameById(gameId);
        if (Objects.isNull(output)) {
            logger.warn("Game {} does not exist", gameId);
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, String.format("Game at id %s does not exist", gameId));
        }
        return output;
    }

    public GameComponentDTO uploadGame(@NonNull GameComponentDTO game) {
        // Validate uniqueness of name
        // Validate franchise ID, fetching franchise name
        // Insert & return
        return GameComponentDTO.builder().build();
    }
}
package com.gamerparadise.activity;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import lombok.NonNull;
import java.util.List;
import java.util.Objects;

import com.gamerparadise.activity.converter.GamesActivityConverter;
import com.gamerparadise.activity.dto.GameActivityDTO;
import com.gamerparadise.activity.dto.UploadGameInputActivityDTO;
import com.gamerparadise.component.GamesComponent;
import com.gamerparadise.component.dto.GameComponentDTO;
import com.gamerparadise.component.dto.UploadGameInputComponentDTO;

@RestController
public class GamesActivity {
    @Autowired
    private GamesActivityConverter gamesActivityConverter;
    @Autowired
    private GamesComponent gamesComponent;
    private static final Logger logger = LogManager.getLogger(GamesActivity.class);

    @GetMapping(name="GetGames",path="/games")
    public List<GameActivityDTO> getGames(@RequestParam(name="franchiseId",required=true) Integer franchiseId) {
        logger.info("Beginning to process getGames for franchise ID {}", franchiseId.toString());
        final List<GameComponentDTO> getGamesComponentOutput = gamesComponent.getGames(franchiseId);
        final List<GameActivityDTO> convertedOutput = getGamesComponentOutput
            .stream()
            .map((game) -> gamesActivityConverter.convertGameComponentDTOToActivityDTO(game))
            .toList();
        logger.info("Finished fetching {} games(s)", convertedOutput.size());
        return convertedOutput;

    }

    @GetMapping(name="GetGameById",path="/game")
    public GameActivityDTO getGameById(@RequestParam(name="gameId",required=true) Integer gameId) {
        logger.info("Beginning to process getGames for franchise ID {}{}", gameId.toString());
        final GameComponentDTO getGamesComponentOutput = gamesComponent.getGameById(gameId);
        final GameActivityDTO convertedOutput = gamesActivityConverter.convertGameComponentDTOToActivityDTO(getGamesComponentOutput);
        logger.info("Finished fetching game {}", convertedOutput);
        return convertedOutput;

    }

    @PostMapping(name="UploadGame",path="/games")
    public GameActivityDTO uploadGame(@NonNull @RequestBody UploadGameInputActivityDTO input) {
        logger.info("Beginning to process uploadGame with input {}", input);
        final UploadGameInputComponentDTO convertedInput = gamesActivityConverter.convertUploadGameActivityDTOToComponentDTO(input);
        final GameComponentDTO output = gamesComponent.insertGame(convertedInput);
        final GameActivityDTO convertedOutput = gamesActivityConverter.convertGameComponentDTOToActivityDTO(output);
        logger.info("Finished processing uploadGame on {}", convertedOutput);
        return convertedOutput;
    }
}
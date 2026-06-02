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
import com.gamerparadise.builder.FranchisesBuilder;
import com.gamerparadise.component.dto.GameComponentDTO;
import com.gamerparadise.component.dto.FranchiseComponentDTO;
import com.gamerparadise.component.dto.UploadGameInputComponentDTO;
import com.gamerparadise.component.dto.GetFileNamesForGameOutputComponentDTO;
import com.gamerparadise.component.dto.GetInstallerOutputComponentDTO;

@Component
public class GamesComponent {
    @Autowired
    private GamesBuilder gamesBuilder;
    @Autowired
    private FranchisesBuilder franchisesBuilder;
    private static final Logger logger = LogManager.getLogger(GamesComponent.class);

    public List<GameComponentDTO> getGames(@NonNull Integer franchiseId) {
        return gamesBuilder.getGames(franchiseId);
    }

    public GameComponentDTO getGameById(@NonNull Integer gameId) {
        final GameComponentDTO output = gamesBuilder.getGameByFilters(GameComponentDTO.builder().gameId(gameId).build());
        if (Objects.isNull(output)) {
            logger.warn("Game {} does not exist", gameId);
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, String.format("Game at id %s does not exist", gameId));
        }
        return output;
    }

    public GameComponentDTO insertGame(@NonNull UploadGameInputComponentDTO input) {
        final String gameName = input.getGameName();
        final GameComponentDTO game = gamesBuilder.getGameByFilters(GameComponentDTO.builder().gameName(gameName).build());
        if (Objects.nonNull(game)) {
            logger.warn("Game {} already exists", gameName);
            throw new ResponseStatusException(HttpStatus.CONFLICT, String.format("Game with name %s already exists", gameName));
        }
        final Integer franchiseId = input.getFranchiseId();
        final FranchiseComponentDTO franchise = franchisesBuilder.getFranchiseByFilters(FranchiseComponentDTO.builder().franchiseId(franchiseId).build());
        if (Objects.isNull(franchise)) {
            logger.warn("Franchise {} does not exist", franchiseId);
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, String.format("Franchise at id %s does not exist", franchiseId));
        }
        final GetFileNamesForGameOutputComponentDTO uploadedFileNames = gamesBuilder.getFileNamesForGame(gameName);
        if (!uploadedFileNames.getFileNames().equals(input.getFileNames())) {
            /* This case should never happen.
             * A valid flow would have "insertGame" called after the set of files has been uploaded,
             * but this is just in case the "insertGame" API is attempted to be called w/o uploading the files
             */
            logger.warn("List of files has not been uploaded yet for {}", gameName);
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, String.format("List of files has not been uploaded yet for %s", gameName));
        }
        logger.info("Finished validating that the files have been uploaded");
        return gamesBuilder.insertGame(input, franchise.getFranchiseName());
    }

    public GetFileNamesForGameOutputComponentDTO getFileNamesForGame(@NonNull Integer gameId) {
        final GameComponentDTO game = gamesBuilder.getGameByFilters(GameComponentDTO.builder().gameId(gameId).build());
        return gamesBuilder.getFileNamesForGame(game.getGameName());
    }

    public GetInstallerOutputComponentDTO getInstaller() {
        return gamesBuilder.getInstaller();
    }
}
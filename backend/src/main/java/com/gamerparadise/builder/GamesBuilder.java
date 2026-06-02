package com.gamerparadise.builder;

import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;

import lombok.NonNull;
import java.util.List;
import java.util.Objects;

import com.gamerparadise.accessor.S3Accessor;
import com.gamerparadise.builder.converter.GamesBuilderConverter;
import com.gamerparadise.component.dto.GameComponentDTO;
import com.gamerparadise.component.dto.UploadGameInputComponentDTO;
import com.gamerparadise.component.dto.GetFileNamesForGameOutputComponentDTO;
import com.gamerparadise.component.dto.GetInstallerOutputComponentDTO;
import com.gamerparadise.dao.GamesDAO;
import com.gamerparadise.dao.dto.GameDAODTO;

import static com.gamerparadise.shared.Constants.INSTALLER_FILE_NAME;

@Component
public class GamesBuilder {
    @Autowired
    private GamesBuilderConverter gamesBuilderConverter;
    @Autowired
    private GamesDAO gamesDAO;
    @Autowired
    private S3Accessor s3Accessor;
    @Value("${s3.bucket.name.games}")
    private String gameS3BucketName;

    public List<GameComponentDTO> getGames(@NonNull Integer franchiseId) {
        return gamesDAO.getGames(franchiseId)
            .stream()
            .map((game) -> gamesBuilderConverter.convertGameDAODTOToComponentDTO(game))
            .toList();

    }

    public GameComponentDTO getGameByFilters(@NonNull GameComponentDTO gameFilters) {
        final GameDAODTO output = gamesDAO.getGameByFilters(gamesBuilderConverter
            .convertGameComponentDTOToDAODTO(gameFilters));
        if (Objects.isNull(output)) {
            return null;
        }
        return gamesBuilderConverter.convertGameDAODTOToComponentDTO(output);
    }

    public GameComponentDTO insertGame(@NonNull UploadGameInputComponentDTO input, @NonNull String franchiseName) {
        final GameDAODTO daoInput = gamesBuilderConverter.convertGameUploadInputComponentDTOToDAODTO(input, franchiseName);
        final GameComponentDTO output = gamesBuilderConverter.convertGameDAODTOToComponentDTO(gamesDAO.insertGame(daoInput));
        return output;
    }

    public GetFileNamesForGameOutputComponentDTO getFileNamesForGame(@NonNull String gameName) {
        return GetFileNamesForGameOutputComponentDTO.builder().fileNames(s3Accessor.getFileNames(gameName, gameS3BucketName)).build();
    }

    public GetInstallerOutputComponentDTO getInstaller() {
        return GetInstallerOutputComponentDTO.builder().installer(s3Accessor.generatePresignedUrl(INSTALLER_FILE_NAME, "GET", gameS3BucketName)).build();
    }
}
package com.gamerparadise.activity.converter;
import org.springframework.stereotype.Component;

import lombok.NonNull;

import com.gamerparadise.activity.dto.GameActivityDTO;
import com.gamerparadise.activity.dto.UploadGameInputActivityDTO;
import com.gamerparadise.activity.dto.GetFileNamesForGameOutputActivityDTO;
import com.gamerparadise.component.dto.GameComponentDTO;
import com.gamerparadise.component.dto.UploadGameInputComponentDTO;
import com.gamerparadise.component.dto.GetFileNamesForGameOutputComponentDTO;

@Component
public class GamesActivityConverter {
    public GameActivityDTO convertGameComponentDTOToActivityDTO(@NonNull GameComponentDTO input) {
        return GameActivityDTO.builder()
            .gameName(input.getGameName())
            .franchiseId(input.getFranchiseId())
            .build();
    }

    public GameComponentDTO convertGameActivityDTOToComponentDTO(@NonNull GameActivityDTO input) {
        return GameComponentDTO.builder()
            .gameId(input.getGameId())
            .gameName(input.getGameName())
            .franchiseId(input.getFranchiseId())
            .franchiseName(input.getFranchiseName())
            .build();
    }

    public UploadGameInputComponentDTO convertUploadGameActivityDTOToComponentDTO(@NonNull UploadGameInputActivityDTO input) {
        return UploadGameInputComponentDTO.builder()
            .gameName(input.getGameName())
            .fileNames(input.getFileNames())
            .build();
    }

    public GetFileNamesForGameOutputActivityDTO convertGetFileNamesForGameOutputActivityDTOToComponentDTO(@NonNull GetFileNamesForGameOutputComponentDTO input) {
        return GetFileNamesForGameOutputActivityDTO.builder()
            .fileNames(input.getFileNames())
            .build();
    }
}
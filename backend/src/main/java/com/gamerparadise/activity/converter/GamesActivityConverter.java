package com.gamerparadise.activity.converter;
import org.springframework.stereotype.Component;
import lombok.NonNull;
import com.gamerparadise.activity.dto.GameActivityDTO;
import com.gamerparadise.component.dto.GameComponentDTO;
@Component
public class GamesActivityConverter {
    public GameActivityDTO convertGameComponentDTOToActivityDTO(@NonNull GameComponentDTO input) {
        return GameActivityDTO.builder()
            .gameId(input.getGameId())
            .gameName(input.getGameName())
            .build();
    }
}
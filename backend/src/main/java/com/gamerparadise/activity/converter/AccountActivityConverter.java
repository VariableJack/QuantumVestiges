package com.gamerparadise.activity.converter;
import org.springframework.stereotype.Component;

import lombok.NonNull;

import com.gamerparadise.activity.dto.CartActivityDTO;
import com.gamerparadise.activity.dto.UpdateCartActivityInputDTO;
import com.gamerparadise.activity.dto.PurchasedItemActivityDTO;
import com.gamerparadise.component.dto.CartComponentDTO;
import com.gamerparadise.component.dto.UpdateCartComponentInputDTO;
import com.gamerparadise.component.dto.PurchasedItemComponentDTO;

@Component
public class AccountActivityConverter {
    public UpdateCartComponentInputDTO convertCartInputToComponentDTO(@NonNull UpdateCartActivityInputDTO input) {
        return UpdateCartComponentInputDTO.builder().gameId(input.getGameId()).action(input.getAction()).build();
    }
    public CartComponentDTO convertCartActivityDTOToComponentDTO(@NonNull CartActivityDTO input) {
        return CartComponentDTO.builder()
            .gameId(input.getGameId())
            .gameName(input.getGameName())
            .franchiseId(input.getFranchiseId())
            .franchiseName(input.getFranchiseName())
            .build();
    }

    public CartActivityDTO convertCartComponentDTOToActivityDTO(@NonNull CartComponentDTO input) {
        return CartActivityDTO.builder()
            .gameId(input.getGameId())
            .gameName(input.getGameName())
            .franchiseId(input.getFranchiseId())
            .franchiseName(input.getFranchiseName())
            .build();
    }

    public PurchasedItemActivityDTO convertPurchasedItemComponentDTOToActivityDTO(@NonNull PurchasedItemComponentDTO input) {
        return PurchasedItemActivityDTO.builder()
            .id(input.getId())
            .name(input.getName())
            .type(input.getType())
            .build();
    }
}
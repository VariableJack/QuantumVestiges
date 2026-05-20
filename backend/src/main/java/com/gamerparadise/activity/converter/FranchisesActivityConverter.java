package com.gamerparadise.activity.converter;
import org.springframework.stereotype.Component;

import lombok.NonNull;

import com.gamerparadise.activity.dto.FranchiseActivityDTO;
import com.gamerparadise.component.dto.FranchiseComponentDTO;

@Component
public class FranchisesActivityConverter {
    public FranchiseComponentDTO convertFranchiseActivityDTOToComponentDTO(@NonNull FranchiseActivityDTO input) {
        return FranchiseComponentDTO.builder()
            .franchiseName(input.getFranchiseName())
            .build();
    }

    public FranchiseActivityDTO convertFranchiseComponentDTOToActivityDTO(@NonNull FranchiseComponentDTO input) {
        return FranchiseActivityDTO.builder()
            .franchiseId(input.getFranchiseId())
            .franchiseName(input.getFranchiseName())
            .build();
    }
}
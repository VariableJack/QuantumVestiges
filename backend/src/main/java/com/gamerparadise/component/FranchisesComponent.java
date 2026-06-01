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

import com.gamerparadise.builder.FranchisesBuilder;
import com.gamerparadise.component.dto.FranchiseComponentDTO;

@Component
public class FranchisesComponent {
    @Autowired
    private FranchisesBuilder franchisesBuilder;
    private static final Logger logger = LogManager.getLogger(FranchisesComponent.class);

    public List<FranchiseComponentDTO> getFranchises() {
        return franchisesBuilder.getFranchises();
    }

    public FranchiseComponentDTO getFranchiseById(@NonNull Integer franchiseId) {
        final FranchiseComponentDTO output = franchisesBuilder.getFranchiseByFilters(FranchiseComponentDTO.builder().franchiseId(franchiseId).build());
        if (Objects.isNull(output)) {
            logger.warn("Franchise {} does not exist", franchiseId);
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, String.format("Franchise at id %s does not exist", franchiseId));
        }
        return output;
    }

    public FranchiseComponentDTO insertFranchise(@NonNull FranchiseComponentDTO input) {
        final String franchiseName = input.getFranchiseName();
        final FranchiseComponentDTO output = franchisesBuilder.getFranchiseByFilters(input);
        if (Objects.nonNull(output)) {
            logger.warn("Franchise {} already exists", franchiseName);
            throw new ResponseStatusException(HttpStatus.CONFLICT, String.format("Franchise with name %s already exists", franchiseName));
        }
        return franchisesBuilder.insertFranchise(input);
    }
}
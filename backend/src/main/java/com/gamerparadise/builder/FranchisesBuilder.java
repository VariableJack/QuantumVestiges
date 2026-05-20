package com.gamerparadise.builder;

import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Autowired;

import lombok.NonNull;
import java.util.List;
import java.util.Objects;

import com.gamerparadise.builder.converter.FranchisesBuilderConverter;
import com.gamerparadise.component.dto.FranchiseComponentDTO;
import com.gamerparadise.dao.FranchisesDAO;
import com.gamerparadise.dao.dto.FranchiseDAODTO;

@Component
public class FranchisesBuilder {
    @Autowired
    private FranchisesBuilderConverter franchisesBuilderConverter;
    @Autowired
    private FranchisesDAO franchisesDAO;

    public List<FranchiseComponentDTO> getFranchises() {
        return franchisesDAO.getFranchises()
            .stream()
            .map((franchise) -> franchisesBuilderConverter.convertFranchiseDAODTOToComponentDTO(franchise))
            .toList();
    }

    public FranchiseComponentDTO getFranchiseById(@NonNull Integer franchiseId) {
        final FranchiseDAODTO output = franchisesDAO.getFranchiseById(franchiseId);
        if (Objects.isNull(output)) {
            return null;
        }
        return franchisesBuilderConverter.convertFranchiseDAODTOToComponentDTO(output);
    }
    
    public void createFranchise(@NonNull FranchiseComponentDTO franchise) {
    }
}

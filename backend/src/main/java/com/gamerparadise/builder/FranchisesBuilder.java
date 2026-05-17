package com.gamerparadise.builder;

import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

import com.gamerparadise.builder.converter.FranchisesBuilderConverter;
import com.gamerparadise.dao.FranchisesDAO;
import com.gamerparadise.component.dto.FranchiseComponentDTO;

@Component
public class FranchisesBuilder {
    @Autowired
    private FranchisesBuilderConverter franchisesBuilderConverter;
    @Autowired
    private FranchisesDAO franchisesDAO;

    public List<FranchiseComponentDTO> getFranchises(Integer franchiseId) {
        return franchisesDAO.getFranchises(franchiseId)
            .stream()
            .map((franchise) -> franchisesBuilderConverter.convertFranchiseComponentDTOToActivityDTO(franchise))
            .toList();
    }
}

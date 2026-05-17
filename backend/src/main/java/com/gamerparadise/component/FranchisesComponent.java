package com.gamerparadise.component;

import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Autowired;

import lombok.NonNull;
import java.util.List;

import com.gamerparadise.builder.FranchisesBuilder;
import com.gamerparadise.component.dto.FranchiseComponentDTO;

@Component
public class FranchisesComponent {
    @Autowired
    private FranchisesBuilder franchisesBuilder;

    public List<FranchiseComponentDTO> getFranchises(Integer franchiseId) {
        return franchisesBuilder.getFranchises(franchiseId);
    }
}
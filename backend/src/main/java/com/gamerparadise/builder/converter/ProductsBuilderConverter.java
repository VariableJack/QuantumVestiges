package com.gamerparadise.builder.converter;
import org.springframework.stereotype.Component;

import lombok.NonNull;

import com.gamerparadise.component.dto.ProductComponentDTO;
import com.gamerparadise.dao.dto.ProductDAODTO;

@Component
public class ProductsBuilderConverter {
    public ProductComponentDTO convertProductDAODTOToComponentDTO(@NonNull ProductDAODTO input) {
        return ProductComponentDTO.builder()
            .productId(input.getProductId())
            .productName(input.getProductName())
            .parentProductId(input.getParentProductId())
            .productType(input.getProductType())
            .franchiseId(input.getFranchiseId())
            .franchiseName(input.getFranchiseName())
            .price(input.getPrice())
            .build();
    }

    public ProductDAODTO convertProductComponentDTOToDAODTO(@NonNull ProductComponentDTO input, @NonNull String franchiseName) {
        return ProductDAODTO.builder()
            .productName(input.getProductName())
            .productId(input.getProductId())
            .parentProductId(input.getParentProductId())
            .productType(input.getProductType())
            .franchiseId(input.getFranchiseId())
            .franchiseName(franchiseName)
            .price(input.getPrice())
            .build();
    }
}
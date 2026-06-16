package com.gamerparadise.activity.converter;
import org.springframework.stereotype.Component;

import lombok.NonNull;

import com.gamerparadise.activity.dto.ProductActivityDTO;
import com.gamerparadise.activity.dto.GetFileNamesForGameOutputActivityDTO;
import com.gamerparadise.activity.dto.GetInstallerOutputActivityDTO;
import com.gamerparadise.component.dto.ProductComponentDTO;
import com.gamerparadise.component.dto.GetFileNamesForGameOutputComponentDTO;
import com.gamerparadise.component.dto.GetInstallerOutputComponentDTO;

@Component
public class ProductsActivityConverter {
    public ProductActivityDTO convertProductComponentDTOToActivityDTO(@NonNull ProductComponentDTO input) {
        return ProductActivityDTO.builder()
            .productId(input.getProductId())
            .productName(input.getProductName())
            .parentProductId(input.getParentProductId())
            .productType(input.getProductType())
            .franchiseId(input.getFranchiseId())
            .franchiseName(input.getFranchiseName())
            .price(input.getPrice())
            .build();
    }

    public ProductComponentDTO convertProductActivityDTOToComponentDTO(@NonNull ProductActivityDTO input) {
        return ProductComponentDTO.builder()
            .productName(input.getProductName())
            .parentProductId(input.getParentProductId())
            .productType(input.getProductType())
            .franchiseId(input.getFranchiseId())
            .franchiseName(input.getFranchiseName())
            .price(input.getPrice())
            .build();
    }

    public GetFileNamesForGameOutputActivityDTO convertGetFileNamesForGameOutputActivityDTOToComponentDTO(@NonNull GetFileNamesForGameOutputComponentDTO input) {
        return GetFileNamesForGameOutputActivityDTO.builder()
            .fileNames(input.getFileNames())
            .build();
    }

    public GetInstallerOutputActivityDTO convertGetInstallerOutputComponentDTOToActivityDTO(@NonNull GetInstallerOutputComponentDTO input) {
        return GetInstallerOutputActivityDTO.builder()
            .installer(input.getInstaller())
            .build();
    }
}
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

import com.gamerparadise.builder.ProductsBuilder;
import com.gamerparadise.builder.FranchisesBuilder;
import com.gamerparadise.component.dto.ProductComponentDTO;
import com.gamerparadise.component.dto.FranchiseComponentDTO;
import com.gamerparadise.component.dto.GetFileNamesForGameOutputComponentDTO;
import com.gamerparadise.component.dto.GetInstallerOutputComponentDTO;

@Component
public class ProductsComponent {
    @Autowired
    private ProductsBuilder productsBuilder;
    @Autowired
    private FranchisesBuilder franchisesBuilder;
    private static final Logger logger = LogManager.getLogger(ProductsComponent.class);

    public List<ProductComponentDTO> getProducts(@NonNull Integer franchiseId) {
        return productsBuilder.getProducts(franchiseId);
    }

    public ProductComponentDTO getProductById(@NonNull Integer productId) {
        final ProductComponentDTO output = productsBuilder.getProductByFilters(ProductComponentDTO.builder().productId(productId).build());
        if (Objects.isNull(output)) {
            logger.warn("Game {} does not exist", productId);
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, String.format("Product at id %s does not exist", productId));
        }
        return output;
    }

    public ProductComponentDTO insertProduct(@NonNull ProductComponentDTO input) {
        final String productName = input.getProductName();
        final ProductComponentDTO product = productsBuilder.getProductByFilters(ProductComponentDTO.builder().productName(productName).build());
        if (Objects.nonNull(product)) {
            logger.warn("Product {} already exists", productName);
            throw new ResponseStatusException(HttpStatus.CONFLICT, String.format("Product with name %s already exists", productName));
        }
        final Integer franchiseId = input.getFranchiseId();
        final FranchiseComponentDTO franchise = franchisesBuilder.getFranchiseByFilters(FranchiseComponentDTO.builder().franchiseId(franchiseId).build());
        if (Objects.isNull(franchise)) {
            logger.warn("Franchise {} does not exist", franchiseId);
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, String.format("Franchise at id %s does not exist", franchiseId));
        }
        return productsBuilder.insertProduct(input, franchise.getFranchiseName());
    }

    public GetFileNamesForGameOutputComponentDTO getFileNamesForProduct(@NonNull Integer productId) {
        final ProductComponentDTO filter = ProductComponentDTO
            .builder()
            .productId(productId)
            .build();
        final ProductComponentDTO product = productsBuilder.getProductByFilters(filter);
        return productsBuilder.getFileNamesForProduct(product.getProductName());
    }

    public GetInstallerOutputComponentDTO getInstaller() {
        return productsBuilder.getInstaller();
    }
}
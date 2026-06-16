package com.gamerparadise.builder;

import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;

import lombok.NonNull;
import java.util.List;
import java.util.Objects;

import com.gamerparadise.accessor.S3Accessor;
import com.gamerparadise.builder.converter.ProductsBuilderConverter;
import com.gamerparadise.component.dto.ProductComponentDTO;
import com.gamerparadise.component.dto.GetFileNamesForGameOutputComponentDTO;
import com.gamerparadise.component.dto.GetInstallerOutputComponentDTO;
import com.gamerparadise.dao.ProductsDAO;
import com.gamerparadise.dao.dto.ProductDAODTO;

import static com.gamerparadise.shared.Constants.INSTALLER_FILE_NAME;

@Component
public class ProductsBuilder {
    @Autowired
    private ProductsBuilderConverter productsBuilderConverter;
    @Autowired
    private ProductsDAO productsDAO;
    @Autowired
    private S3Accessor s3Accessor;
    @Value("${s3.bucket.name.games}")
    private String gameS3BucketName;

    public List<ProductComponentDTO> getProducts(@NonNull Integer franchiseId) {
        return productsDAO.getProducts(franchiseId)
            .stream()
            .map((product) -> productsBuilderConverter.convertProductDAODTOToComponentDTO(product))
            .toList();
    }

    public ProductComponentDTO getProductByFilters(@NonNull ProductComponentDTO productFilters) {
        final ProductDAODTO output = productsDAO.getProductByFilters(productsBuilderConverter
            .convertProductComponentDTOToDAODTO(productFilters, ""));
        if (Objects.isNull(output)) {
            return null;
        }
        return productsBuilderConverter.convertProductDAODTOToComponentDTO(output);
    }

    public ProductComponentDTO insertProduct(@NonNull ProductComponentDTO input, @NonNull String franchiseName) {
        final ProductDAODTO daoInput = productsBuilderConverter.convertProductComponentDTOToDAODTO(input, franchiseName);
        final ProductComponentDTO output = productsBuilderConverter.convertProductDAODTOToComponentDTO(productsDAO.insertProduct(daoInput));
        return output;
    }

    public GetFileNamesForGameOutputComponentDTO getFileNamesForProduct(@NonNull String productName) {
        return GetFileNamesForGameOutputComponentDTO.builder().fileNames(s3Accessor.getFileNames(productName, gameS3BucketName)).build();
    }

    public GetInstallerOutputComponentDTO getInstaller() {
        return GetInstallerOutputComponentDTO.builder().installer(s3Accessor.generatePresignedUrl(INSTALLER_FILE_NAME, "GET", gameS3BucketName)).build();
    }
}
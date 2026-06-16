package com.gamerparadise.activity;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import lombok.NonNull;
import java.util.List;
import java.util.Objects;
import java.util.Map;

import com.gamerparadise.activity.converter.ProductsActivityConverter;
import com.gamerparadise.activity.dto.ProductActivityDTO;
import com.gamerparadise.activity.dto.GetFileNamesForGameOutputActivityDTO;
import com.gamerparadise.activity.dto.GetInstallerOutputActivityDTO;
import com.gamerparadise.accessor.CognitoAccessor;
import com.gamerparadise.component.ProductsComponent;
import com.gamerparadise.component.dto.ProductComponentDTO;
import com.gamerparadise.component.dto.GetFileNamesForGameOutputComponentDTO;
import com.gamerparadise.component.dto.GetInstallerOutputComponentDTO;

@RestController
public class ProductsActivity {
    @Autowired
    private ProductsActivityConverter productsActivityConverter;
    @Autowired
    private ProductsComponent productsComponent;
    @Autowired
    private CognitoAccessor cognitoAccessor;
    private static final Logger logger = LogManager.getLogger(ProductsActivity.class);

    @GetMapping(name="GetProducts",path="/products")
    public List<ProductActivityDTO> getProducts(@RequestParam(name="franchiseId",required=true) Integer franchiseId) {
        logger.info("Beginning to process getProducts for franchise ID {}", franchiseId.toString());
        final List<ProductComponentDTO> getProductsComponentOutput = productsComponent.getProducts(franchiseId);
        final List<ProductActivityDTO> convertedOutput = getProductsComponentOutput
            .stream()
            .map((game) -> productsActivityConverter.convertProductComponentDTOToActivityDTO(game))
            .toList();
        logger.info("Finished fetching {} products(s)", convertedOutput.size());
        return convertedOutput;

    }

    @GetMapping(name="GetProductById",path="/product")
    public ProductActivityDTO getProductById(@RequestParam(name="productId",required=true) Integer productId) {
        logger.info("Beginning to process getProductById for product ID {}", productId.toString());
        final ProductComponentDTO output = productsComponent.getProductById(productId);
        final ProductActivityDTO convertedOutput = productsActivityConverter.convertProductComponentDTOToActivityDTO(output);
        logger.info("Finished fetching product {}", convertedOutput);
        return convertedOutput;
    }

    @PostMapping(name="UploadProduct",path="/products")
    public ProductActivityDTO uploadProduct(@NonNull @RequestHeader(HttpHeaders.AUTHORIZATION) String accessToken, @NonNull @RequestBody ProductActivityDTO input) {
        final Map<String, String> auth = cognitoAccessor.getUserDetailsFromAccessToken(accessToken);
        final String username = auth.get("username");
        final String group = auth.get("group");
        if (!group.equals("admin")) {
            logger.warn("User {} cannot create a new product", username);
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "You are not permitted to create a new product");
        }
        logger.info("Beginning to process uploadProduct with input {} for user {} under group", input, username, group);
        final ProductComponentDTO convertedInput = productsActivityConverter.convertProductActivityDTOToComponentDTO(input);
        final ProductComponentDTO output = productsComponent.insertProduct(convertedInput);
        final ProductActivityDTO convertedOutput = productsActivityConverter.convertProductComponentDTOToActivityDTO(output);
        logger.info("Finished processing uploadProduct on {}", convertedOutput);
        return convertedOutput;
    }

    @GetMapping(name="GetFileNamesForProduct",path="/products/files")
    public GetFileNamesForGameOutputActivityDTO getFileNamesForProduct(@RequestParam(name="productId",required=true) Integer productId) {
        logger.info("Beginning to process getFileNamesForProduct for productId {}", productId);
        final GetFileNamesForGameOutputComponentDTO output = productsComponent.getFileNamesForProduct(productId);
        final GetFileNamesForGameOutputActivityDTO convertedOutput = productsActivityConverter.convertGetFileNamesForGameOutputActivityDTOToComponentDTO(output);
        logger.info("Finished processing getFileNamesForProduct on {}", convertedOutput);
        return convertedOutput;
    }

    @GetMapping(name="GetInstaller",path="/installer")
    public GetInstallerOutputActivityDTO getInstaller() {
        logger.info("Beginning to process getInstaller");
        final GetInstallerOutputComponentDTO output = productsComponent.getInstaller();
        final GetInstallerOutputActivityDTO convertedOutput = productsActivityConverter.convertGetInstallerOutputComponentDTOToActivityDTO(output);
        logger.info("Finished processing getInstaller on {}", convertedOutput);
        return convertedOutput;
    }
}
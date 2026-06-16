package com.gamerparadise.activity;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import lombok.NonNull;
import java.util.List;
import java.util.Objects;

import com.gamerparadise.activity.converter.ProductsActivityConverter;
import com.gamerparadise.activity.dto.ProductActivityDTO;
import com.gamerparadise.activity.dto.GetFileNamesForGameOutputActivityDTO;
import com.gamerparadise.activity.dto.GetInstallerOutputActivityDTO;
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
    private static final Logger logger = LogManager.getLogger(ProductsActivity.class);

    @GetMapping(name="GetGames",path="/games")
    public List<ProductActivityDTO> getGames(@RequestParam(name="franchiseId",required=true) Integer franchiseId) {
        logger.info("Beginning to process getGames for franchise ID {}", franchiseId.toString());
        final List<ProductComponentDTO> getProductsComponentOutput = productsComponent.getProducts(franchiseId);
        final List<ProductActivityDTO> convertedOutput = getProductsComponentOutput
            .stream()
            .map((game) -> productsActivityConverter.convertProductComponentDTOToActivityDTO(game))
            .toList();
        logger.info("Finished fetching {} games(s)", convertedOutput.size());
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

    @PostMapping(name="UploadProduct",path="/games")
    public ProductActivityDTO uploadProduct(@NonNull @RequestBody ProductActivityDTO input) {
        logger.info("Beginning to process uploadProduct with input {}", input);
        final ProductComponentDTO convertedInput = productsActivityConverter.convertProductActivityDTOToComponentDTO(input);
        final ProductComponentDTO output = productsComponent.insertProduct(convertedInput);
        final ProductActivityDTO convertedOutput = productsActivityConverter.convertProductComponentDTOToActivityDTO(output);
        logger.info("Finished processing uploadProduct on {}", convertedOutput);
        return convertedOutput;
    }

    @GetMapping(name="GetFileNamesForProduct",path="/game/files")
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
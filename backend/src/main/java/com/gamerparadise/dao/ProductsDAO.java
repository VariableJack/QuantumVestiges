package com.gamerparadise.dao;

import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Autowired;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import lombok.NonNull;

import java.util.Date;
import java.util.List;
import java.util.Objects;

import com.gamerparadise.dao.mapper.ProductsDAOMapper;
import com.gamerparadise.dao.dto.ProductDAODTO;
import com.gamerparadise.shared.Utility;

@Component
public class ProductsDAO {
    @Autowired
    private ProductsDAOMapper mapper;
    private static final Logger logger = LogManager.getLogger(ProductsDAO.class);

    public List<ProductDAODTO> getProducts(@NonNull Integer franchiseId) {
        final Date startDate = new Date();
        logger.info("Fetching products by franchiseId {}", franchiseId);
        try {
            return mapper.getProducts(franchiseId);
        } catch (Exception e) {
            throw e;
        } finally {
            logger.info("Finished running SQL query in {} ms", Utility.getElapsedTime(startDate));
        }
    }

    public ProductDAODTO getProductByFilters(@NonNull ProductDAODTO productFilters) {
        final Date startDate = new Date();
        logger.info("Fetching game by productFilters {}", productFilters);
        try {
            return mapper.getProductByFilters(productFilters);
        } catch (Exception e) {
            throw e;
        } finally {
            logger.info("Finished running SQL query in {} ms", Utility.getElapsedTime(startDate));
        }
    }

    public ProductDAODTO insertProduct(@NonNull ProductDAODTO product) {
        final Date startDate = new Date();
        logger.info("Inserting product {}", product);
        try {
            mapper.insertProduct(product);
            return mapper.getProductByFilters(product);
        } catch (Exception e) {
            throw e;
        } finally {
            logger.info("Finished running SQL query in {} ms", Utility.getElapsedTime(startDate));
        }
    }
}

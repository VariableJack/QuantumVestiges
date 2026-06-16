package com.gamerparadise.dao.mapper;

import org.springframework.stereotype.Component;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import lombok.NonNull;
import java.util.List;

import com.gamerparadise.dao.dto.ProductDAODTO;

@Component
@Mapper
public interface ProductsDAOMapper {
    public List<ProductDAODTO> getProducts(@Param("franchiseId") @NonNull Integer franchiseId);
    public ProductDAODTO getProductByFilters(@Param("product") @NonNull ProductDAODTO productFilters);
    public ProductDAODTO insertProduct(@Param("product") @NonNull ProductDAODTO product);
}

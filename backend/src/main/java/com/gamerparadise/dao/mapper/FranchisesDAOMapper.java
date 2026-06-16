package com.gamerparadise.dao.mapper;

import org.springframework.stereotype.Component;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import lombok.NonNull;
import java.util.List;

import com.gamerparadise.dao.dto.FranchiseDAODTO;

@Component
@Mapper
public interface FranchisesDAOMapper {
    public List<FranchiseDAODTO> getFranchises();
    public FranchiseDAODTO getFranchiseByFilters(@Param("franchise") @NonNull FranchiseDAODTO franchise);
    public void insertFranchise(@Param("franchise") FranchiseDAODTO franchise);
}

package com.gamerparadise.dao.mapper;

import org.springframework.stereotype.Component;
import lombok.NonNull;
import java.util.List;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.gamerparadise.dao.dto.FranchiseDAODTO;

@Component
@Mapper
public interface FranchisesDAOMapper {
	public List<FranchiseDAODTO> getFranchises(@Param("franchiseId") Integer franchiseId);
	public void insertFranchise(@Param("franchise") FranchiseDAODTO franchise);
}

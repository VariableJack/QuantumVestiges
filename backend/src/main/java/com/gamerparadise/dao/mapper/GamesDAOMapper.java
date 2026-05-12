package com.gamerparadise.dao.mapper;

import org.springframework.stereotype.Component;
import lombok.NonNull;
import java.util.List;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.gamerparadise.dao.dto.GameDAODTO;

@Component
@Mapper
public interface GamesDAOMapper {
	public List<GameDAODTO> getGames(@Param("franchiseId") @NonNull Integer franchiseId, @Param("gameId") Integer gameId);
	public GameDAODTO getGameById(@Param("gameId") @NonNull Integer gameId);
}

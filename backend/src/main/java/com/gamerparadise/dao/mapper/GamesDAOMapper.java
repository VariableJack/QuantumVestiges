package com.gamerparadise.dao.mapper;

import org.springframework.stereotype.Component;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import lombok.NonNull;
import java.util.List;

import com.gamerparadise.dao.dto.GameDAODTO;

@Component
@Mapper
public interface GamesDAOMapper {
    public List<GameDAODTO> getGames(@Param("franchiseId") @NonNull Integer franchiseId);
    public GameDAODTO getGameById(@Param("gameId") @NonNull Integer gameId);
    public void insertGame(@Param("game") @NonNull GameDAODTO game);
}

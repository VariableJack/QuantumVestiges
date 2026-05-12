package com.gamerparadise.dao;

import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Autowired;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import lombok.NonNull;

import java.util.List;
import java.util.Objects;

import com.gamerparadise.dao.mapper.GamesDAOMapper;
import com.gamerparadise.dao.dto.GameDAODTO;

@Component
public class GamesDAO {
	@Autowired
	private GamesDAOMapper mapper;
	private static final Logger logger = LogManager.getLogger(GamesDAO.class);
	public List<GameDAODTO> getGames(@NonNull Integer franchiseId, Integer gameId) {
		logger.info("Fetching games by franchiseId {}{}", franchiseId, Objects.isNull(gameId) ? "" : " and gameId" + gameId.toString());
		try {
			return mapper.getGames(franchiseId, gameId);
		} catch (Exception e) {
			throw e;
		}
	}
	public GameDAODTO getGameById(@NonNull Integer gameId) {
		logger.info("Fetching game by gameId {}{}", gameId);
		try {
			return mapper.getGameById(gameId);
		} catch (Exception e) {
			throw e;
		}
	}
}

package com.gamerparadise.dao;

import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Autowired;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import lombok.NonNull;

import java.util.Date;
import java.util.List;
import java.util.Objects;

import com.gamerparadise.dao.mapper.GamesDAOMapper;
import com.gamerparadise.dao.dto.GameDAODTO;
import com.gamerparadise.shared.Utility;

@Component
public class GamesDAO {
    @Autowired
    private GamesDAOMapper mapper;
    private static final Logger logger = LogManager.getLogger(GamesDAO.class);

    public List<GameDAODTO> getGames(@NonNull Integer franchiseId) {
        final Date startDate = new Date();
        logger.info("Fetching games by franchiseId {}", franchiseId);
        try {
            return mapper.getGames(franchiseId);
        } catch (Exception e) {
            throw e;
        } finally {
            logger.info("Finished running SQL query in {} ms", Utility.getElapsedTime(startDate));
        }
    }

    public GameDAODTO getGameByFilters(@NonNull GameDAODTO gameFilters) {
        final Date startDate = new Date();
        logger.info("Fetching game by gameFilters {}", gameFilters);
        try {
            return mapper.getGameByFilters(gameFilters);
        } catch (Exception e) {
            throw e;
        } finally {
            logger.info("Finished running SQL query in {} ms", Utility.getElapsedTime(startDate));
        }
    }

    public GameDAODTO insertGame(@NonNull GameDAODTO game) {
        final Date startDate = new Date();
        logger.info("Inserting game {}", game);
        try {
            return mapper.insertGame(game);
        } catch (Exception e) {
            throw e;
        } finally {
            logger.info("Finished running SQL query in {} ms", Utility.getElapsedTime(startDate));
        }
    }
}

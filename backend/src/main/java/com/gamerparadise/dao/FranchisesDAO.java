package com.gamerparadise.dao;

import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Autowired;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import lombok.NonNull;
import java.util.Date;
import java.util.List;
import java.util.Objects;

import com.gamerparadise.dao.mapper.FranchisesDAOMapper;
import com.gamerparadise.dao.dto.FranchiseDAODTO;
import com.gamerparadise.shared.Utility;

@Component
public class FranchisesDAO {
    @Autowired
    private FranchisesDAOMapper mapper;
    private static final Logger logger = LogManager.getLogger(FranchisesDAO.class);

    public List<FranchiseDAODTO> getFranchises() {
        final Date startDate = new Date();
        logger.info("Fetching franchises");
        try {
            return mapper.getFranchises();
        } catch (Exception e) {
            throw e;
        } finally {
            logger.info("Finished running SQL query in {} ms", Utility.getElapsedTime(startDate));
        }
    }

    public FranchiseDAODTO getFranchiseByFilters(@NonNull FranchiseDAODTO franchiseFilters) {
        final Date startDate = new Date();
        logger.info("Fetching franchise by franchiseFilters {}", franchiseFilters);
        try {
            return mapper.getFranchiseByFilters(franchiseFilters);
        } catch (Exception e) {
            throw e;
        } finally {
            logger.info("Finished running SQL query in {} ms", Utility.getElapsedTime(startDate));
        }
    }
    
    public FranchiseDAODTO insertFranchise(@NonNull FranchiseDAODTO franchise) {
        final Date startDate = new Date();
        logger.info("Inserting franchise {}", franchise);
        try {
            return mapper.insertFranchise(franchise);
        } catch (Exception e) {
            throw e;
        } finally {
            logger.info("Finished running SQL query in {} ms", Utility.getElapsedTime(startDate));
        }
    }
}

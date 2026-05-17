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

    public List<FranchiseDAODTO> getFranchises(Integer franchiseId) {
        final Date startDate = new Date();
        logger.info("Fetching franchises by franchiseId {}", franchiseId);
        try {
            return mapper.getFranchises(franchiseId);
        } catch (Exception e) {
            throw e;
        } finally {
            logger.info("Finished running SQL query in {} ms", Utility.getElapsedTime(startDate));
        }
    }
    
    public void insertFranchise(@NonNull FranchiseDAODTO franchise) {
        final Date startDate = new Date();
        logger.info("Inserting franchise {}", franchise);
        try {
            mapper.insertFranchise(franchise);
        } catch (Exception e) {
            throw e;
        } finally {
            logger.info("Finished running SQL query in {} ms", Utility.getElapsedTime(startDate));
        }
    }
}

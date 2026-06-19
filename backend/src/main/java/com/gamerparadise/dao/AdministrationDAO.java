package com.gamerparadise.dao;

import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Autowired;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import lombok.NonNull;
import java.util.Date;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

import com.gamerparadise.dao.mapper.AdministrationDAOMapper;
import com.gamerparadise.dao.dto.UserDAODTO;
import com.gamerparadise.dao.dto.UserNotificationDAODTO;
import com.gamerparadise.dao.dto.UserSubscriptionDAODTO;
import com.gamerparadise.shared.Utility;

@Component
public class AdministrationDAO {
    @Autowired
    private AdministrationDAOMapper mapper;
    private static final Logger logger = LogManager.getLogger(AdministrationDAO.class);
    public UserDAODTO getUser(@NonNull String username) {
        final Date startDate = new Date();
        logger.info("Fetching user {}", username);
        try {
            return mapper.getUser(username);
        } catch (Exception e) {
            logger.error("getUser failed due to ", e);
            throw e;
        } finally {
            logger.info("Finished running SQL query in {} ms", Utility.getElapsedTime(startDate));
        }
    }

    public List<UserNotificationDAODTO> getUserNotificationPreferences(@NonNull String username) {
        final Date startDate = new Date();
        logger.info("Fetching notification preferences for user {}", username);
        try {
            final List<UserNotificationDAODTO> output = mapper.getUserNotificationPreferences(username);
            if (Objects.isNull(output)) {
                return new ArrayList<UserNotificationDAODTO>();
            }
            return output;
        } catch (Exception e) {
            logger.error("getUserNotificationPreferences failed due to ", e);
            throw e;
        } finally {
            logger.info("Finished running SQL query in {} ms", Utility.getElapsedTime(startDate));
        }
    }

    public List<UserSubscriptionDAODTO> getUserSubscriptions(@NonNull String username) {
        final Date startDate = new Date();
        logger.info("Fetching subscriptions for user {}", username);
        try {
            final List<UserSubscriptionDAODTO> output = mapper.getUserSubscriptions(username);
            if (Objects.isNull(output)) {
                return new ArrayList<UserSubscriptionDAODTO>();
            }
            return output;
        } catch (Exception e) {
            logger.error("getUserSubscriptions failed due to ", e);
            throw e;
        } finally {
            logger.info("Finished running SQL query in {} ms", Utility.getElapsedTime(startDate));
        }
    }

    public UserDAODTO createUser(@NonNull String username) {
        final Date startDate = new Date();
        logger.info("Creating user {}", username);
        try {
            mapper.createUser(username);
            return mapper.getUser(username);
        } catch (Exception e) {
            logger.error("createUser failed due to ", e);
            throw e;
        } finally {
            logger.info("Finished running SQL query in {} ms", Utility.getElapsedTime(startDate));
        }
    }

    public void saveUserPayment(@NonNull String username, @NonNull String stripeCustomerId) {
        final Date startDate = new Date();
        logger.info("Saving Stripe ID for user {}", username);
        try {
            mapper.saveUserPayment(username, stripeCustomerId);
        } catch (Exception e) {
            logger.error("saveUserPayment failed due to ", e);
            throw e;
        } finally {
            logger.info("Finished running SQL query in {} ms", Utility.getElapsedTime(startDate));
        }
    }

    public void updateNotificationPreference(@NonNull UserNotificationDAODTO input) {
        final Date startDate = new Date();
        logger.info("Updating notification preference {}", input);
        try {
            mapper.updateNotificationPreference(input);
        } catch (Exception e) {
            logger.error("updateNotificationPreference failed due to ", e);
            throw e;
        } finally {
            logger.info("Finished running SQL query in {} ms", Utility.getElapsedTime(startDate));
        }
    }

    public void createSubscription(@NonNull UserSubscriptionDAODTO input) {
        final Date startDate = new Date();
        logger.info("Creating subscription {}", input);
        try {
            mapper.createSubscription(input);
        } catch (Exception e) {
            logger.error("createSubscription failed due to ", e);
            throw e;
        } finally {
            logger.info("Finished running SQL query in {} ms", Utility.getElapsedTime(startDate));
        }
    }

    public void updateSubscription(@NonNull UserSubscriptionDAODTO input) {
        final Date startDate = new Date();
        logger.info("Updating subscription {}", input);
        try {
            mapper.updateSubscription(input);
        } catch (Exception e) {
            logger.error("updateSubscription failed due to ", e);
            throw e;
        } finally {
            logger.info("Finished running SQL query in {} ms", Utility.getElapsedTime(startDate));
        }
    }
}

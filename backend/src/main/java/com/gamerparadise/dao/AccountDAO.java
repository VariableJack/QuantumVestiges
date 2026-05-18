package com.gamerparadise.dao;

import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Autowired;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import lombok.NonNull;
import java.util.Date;
import java.util.List;
import java.util.Objects;

import com.gamerparadise.dao.mapper.AccountDAOMapper;
import com.gamerparadise.dao.dto.CartDAODTO;
import com.gamerparadise.dao.dto.PurchasedItemDAODTO;
import com.gamerparadise.shared.Utility;

@Component
public class AccountDAO {
    @Autowired
    private AccountDAOMapper mapper;
    private static final Logger logger = LogManager.getLogger(GamesDAO.class);
    public List<CartDAODTO> getCart(@NonNull String username) {
        final Date startDate = new Date();
        logger.info("Fetching cart for user {}", username);
        try {
            return mapper.getCart(username);
        } catch (Exception e) {
            throw e;
        }
    }

    public void insertItem(@NonNull CartDAODTO cartItem) {
        final Date startDate = new Date();
        logger.info("Inserting item to cart {}", cartItem);
        try {
            mapper.insertItem(cartItem);
        } catch (Exception e) {
            throw e;
        } finally {
            logger.info("Finished running SQL query in {} ms", Utility.getElapsedTime(startDate));
        }
    }

    public void removeItem(@NonNull CartDAODTO cartItem) {
        final Date startDate = new Date();
        logger.info("Removing item from cart {}", cartItem);
        try {
            mapper.removeItem(cartItem);
        } catch (Exception e) {
            throw e;
        } finally {
            logger.info("Finished running SQL query in {} ms", Utility.getElapsedTime(startDate));
        }
    }
    
    public void clearCart(@NonNull String username) {
        final Date startDate = new Date();
        logger.info("Clearing cart for user {}", username);
        try {
            mapper.clearCart(username);
        } catch (Exception e) {
            throw e;
        } finally {
            logger.info("Finished running SQL query in {} ms", Utility.getElapsedTime(startDate));
        }
    }
    
    public void addItemsToAccount(@NonNull List<PurchasedItemDAODTO> input, @NonNull String username) {
        final Date startDate = new Date();
        logger.info("Adding {} items to user {}'s account", username);
        try {
            mapper.addItemsToAccount(input, username);
        } catch (Exception e) {
            throw e;
        } finally {
            logger.info("Finished running SQL query in {} ms", Utility.getElapsedTime(startDate));
        }
    }

	public List<PurchasedItemDAODTO> getPurchasedItems(@NonNull String username) {
        final Date startDate = new Date();
        logger.info("Fetching purchased items for user {}", username);
        try {
            return mapper.getPurchasedItems(username);
        } catch (Exception e) {
            throw e;
        } finally {
            logger.info("Finished running SQL query in {} ms", Utility.getElapsedTime(startDate));
        }
	}
}

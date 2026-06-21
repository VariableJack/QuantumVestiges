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

import com.gamerparadise.dao.mapper.AccountDAOMapper;
import com.gamerparadise.dao.dto.OrderDAODTO;
import com.gamerparadise.dao.dto.OrderItemDAODTO;
import com.gamerparadise.dao.dto.PurchasedItemDAODTO;
import com.gamerparadise.shared.Utility;

@Component
public class AccountDAO {
    @Autowired
    private AccountDAOMapper mapper;
    private static final Logger logger = LogManager.getLogger(AccountDAO.class);

    public OrderDAODTO getOrCreateOrder(@NonNull String username) {
        final Date startDate = new Date();
        logger.info("Fetching or creating order for user {}", username);
        try {
            OrderDAODTO order = mapper.getOrder(username);
            if (Objects.isNull(order)) {
                mapper.createOrder(username);
                order = mapper.getOrder(username);
            }
            if (Objects.isNull(order.getItems())) {
                order.setItems(new ArrayList<OrderItemDAODTO>());
            }
            return order;
        } catch (Exception e) {
            logger.error("getOrCreateOrder failed due to ", e);
            throw e;
        } finally {
            logger.info("Finished running SQL query in {} ms", Utility.getElapsedTime(startDate));
        }
    }

    public void insertItem(@NonNull OrderItemDAODTO item) {
        final Date startDate = new Date();
        logger.info("Inserting item to cart {}", item);
        try {
            mapper.insertItem(item);
        } catch (Exception e) {
            logger.error("insertItem failed due to ", e);
            throw e;
        } finally {
            logger.info("Finished running SQL query in {} ms", Utility.getElapsedTime(startDate));
        }
    }

    public void removeItem(@NonNull OrderItemDAODTO item) {
        final Date startDate = new Date();
        logger.info("Removing item from cart {}", item);
        try {
            mapper.removeItem(item);
        } catch (Exception e) {
            logger.error("removeItem failed due to ", e);
            throw e;
        } finally {
            logger.info("Finished running SQL query in {} ms", Utility.getElapsedTime(startDate));
        }
    }
    
    public void closeOrder(long orderId, @NonNull String status) {
        final Date startDate = new Date();
        logger.info("Closing cart for user {} with status {}", orderId, status);
        try {
            mapper.closeOrder(orderId, status);
        } catch (Exception e) {
            logger.error("closeOrder failed due to ", e);
            throw e;
        } finally {
            logger.info("Finished running SQL query in {} ms", Utility.getElapsedTime(startDate));
        }
    }
    
    public void addItemsToAccount(@NonNull List<PurchasedItemDAODTO> input, @NonNull String username) {
        final Date startDate = new Date();
        logger.info("Adding {} items to user {}'s account", input.size(), username);
        try {
            mapper.addItemsToAccount(input, username);
        } catch (Exception e) {
            logger.error("addItemsToAccount failed due to ", e);
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
            logger.error("getPurchasedItems failed due to ", e);
            throw e;
        } finally {
            logger.info("Finished running SQL query in {} ms", Utility.getElapsedTime(startDate));
        }
    }
}

package com.gamerparadise.builder;

import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Autowired;

import lombok.NonNull;
import java.util.List;
import java.util.Objects;

import com.gamerparadise.builder.converter.AccountBuilderConverter;
import com.gamerparadise.component.dto.OrderComponentDTO;
import com.gamerparadise.component.dto.OrderItemComponentDTO;
import com.gamerparadise.component.dto.PurchasedItemComponentDTO;
import com.gamerparadise.dao.AccountDAO;
import com.gamerparadise.dao.AdministrationDAO;
import com.gamerparadise.dao.dto.UserDAODTO;

@Component
public class AccountBuilder {
    @Autowired
    private AccountDAO accountDAO;
    @Autowired
    private AdministrationDAO administrationDAO;
    @Autowired
    private AccountBuilderConverter accountBuilderConverter;
    public OrderComponentDTO getOrCreateOrder(@NonNull String username) {
        UserDAODTO user = administrationDAO.getUser(username);
        if (Objects.isNull(user)) {
            user = administrationDAO.createUser(username);
        }
        return accountBuilderConverter.convertOrderDAODTOToComponentDTO(accountDAO.getOrCreateOrder(username));
    }
    public void insertItem(@NonNull OrderItemComponentDTO orderItem) {
        accountDAO.insertItem(accountBuilderConverter.convertOrderItemComponentDTOToDAODTO(orderItem));
    }
    public void removeItem(@NonNull OrderItemComponentDTO orderItem) {
        accountDAO.removeItem(accountBuilderConverter.convertOrderItemComponentDTOToDAODTO(orderItem));
    }
    public void closeOrder(long orderId, @NonNull String status) {
        accountDAO.closeOrder(orderId, status);
    }
    public void addItemsToAccount(@NonNull OrderComponentDTO order, @NonNull String username) {
        accountDAO.addItemsToAccount(order.getItems()
            .stream()
            .map((orderItem) -> accountBuilderConverter.convertOrderComponentDTOToPurchasedItemDAODTO(orderItem))
            .toList(), username);
    }
    public List<PurchasedItemComponentDTO> getPurchasedItems(@NonNull String username) {
        return accountDAO.getPurchasedItems(username)
            .stream()
            .map((purchasedItem) -> accountBuilderConverter.convertPurchasedItemDAODTOToComponentDTO(purchasedItem))
            .toList();
    }
    public List<OrderComponentDTO> getOrderHistory(@NonNull String username) {
        return accountDAO.getOrderHistory(username)
            .stream()
            .map((order) -> accountBuilderConverter.convertOrderDAODTOToComponentDTO(order))
            .toList();
    }
}

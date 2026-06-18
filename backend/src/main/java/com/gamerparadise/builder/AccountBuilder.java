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
    public OrderComponentDTO getCart(@NonNull String username) {
        return accountBuilderConverter.convertOrderDAODTOToComponentDTO(accountDAO.getCart(username));
    }
    public OrderComponentDTO createOrder(@NonNull String username) {
        UserDAODTO user = administrationDAO.getUser(username);
        if (Objects.isNull(user)) {
            user = administrationDAO.createUser(username);
        }
        return accountBuilderConverter.convertOrderDAODTOToComponentDTO(accountDAO.createOrder(username));
    }
    public OrderComponentDTO getOrder(@NonNull String username) {
        return accountBuilderConverter.convertOrderDAODTOToComponentDTO(accountDAO.getOrder(username));
        
    }
    public void insertItem(@NonNull OrderItemComponentDTO cartItem) {
        accountDAO.insertItem(accountBuilderConverter.convertOrderItemComponentDTOToDAODTO(cartItem));
    }
    public void removeItem(@NonNull OrderItemComponentDTO cartItem) {
        accountDAO.removeItem(accountBuilderConverter.convertOrderItemComponentDTOToDAODTO(cartItem));
    }
    public void closeOrder(long orderId, @NonNull String status) {
        accountDAO.closeOrder(orderId, status);
    }
    public void addItemsToAccount(@NonNull OrderComponentDTO cart, @NonNull String username) {
        accountDAO.addItemsToAccount(cart.getItems()
            .stream()
            .map((cartItem) -> accountBuilderConverter.convertOrderComponentDTOToPurchasedItemDAODTO(cartItem))
            .toList(), username);
    }
    public List<PurchasedItemComponentDTO> getPurchasedItems(@NonNull String username) {
        return accountDAO.getPurchasedItems(username)
            .stream()
            .map((purchasedItem) -> accountBuilderConverter.convertPurchasedItemDAODTOToComponentDTO(purchasedItem))
            .toList();
    }
}

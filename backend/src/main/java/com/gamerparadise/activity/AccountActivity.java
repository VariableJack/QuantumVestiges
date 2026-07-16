package com.gamerparadise.activity;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import lombok.NonNull;
import java.util.Objects;
import java.util.List;
import java.util.Map;

import com.gamerparadise.activity.dto.OrderActivityDTO;
import com.gamerparadise.activity.dto.UpdateOrderActivityInputDTO;
import com.gamerparadise.activity.dto.PurchasedItemActivityDTO;
import com.gamerparadise.activity.converter.AccountActivityConverter;
import com.gamerparadise.component.AccountComponent;

@RestController
public class AccountActivity {
    @Autowired
    private AccountActivityConverter accountActivityConverter;
    @Autowired
    private AccountComponent accountComponent;
    private static final Logger logger = LogManager.getLogger(AccountActivity.class);

    @GetMapping(name="GetOrder",path="/order")
    public OrderActivityDTO getOrder(@AuthenticationPrincipal Jwt jwt) throws AccessDeniedException {
        final String username = jwt.getClaimAsString("username");
        logger.info("Beginning to process getOrder for user {}", username);
        final OrderActivityDTO order = accountActivityConverter.convertOrderComponentDTOToActivityDTO(accountComponent.getOrCreateOrder(username));
        logger.info("Finished processing getOrder, returning {} items", order.getItems().size());
        return order;
    }

    @PostMapping(name="UpdateOrder",path="/update-order")
    public void updateOrder(
        @AuthenticationPrincipal Jwt jwt,
        @NonNull @RequestBody UpdateOrderActivityInputDTO input) throws AccessDeniedException {
        final String username = jwt.getClaimAsString("username");
        logger.info("Beginning to process updateOrder for user {}, with input {}", username, input);
        if (Objects.isNull(input.getAction()) || Objects.isNull(input.getProductId())) {
            return;
        }
        accountComponent.updateOrder(accountActivityConverter.convertOrderInputToComponentDTO(input), username);
        logger.info("Finished processing updateOrder");
    }

    @PostMapping(name="CheckoutOrder",path="/checkout-order")
    public void checkoutOrder(@AuthenticationPrincipal Jwt jwt) throws AccessDeniedException {
        final String username = jwt.getClaimAsString("username");
        logger.info("Beginning to process checkoutOrder for user {}", username);
        accountComponent.checkoutOrder(username);
        logger.info("Finished processing checkoutOrder");
        return;
    }

    @GetMapping(name="GetPurchasedItems",path="/purchased-games")
    public List<PurchasedItemActivityDTO> getPurchasedItems(@AuthenticationPrincipal Jwt jwt) throws AccessDeniedException {
        final String username = jwt.getClaimAsString("username");
        logger.info("Beginning to process getPurchasedItems for user {}", username);
        final List<PurchasedItemActivityDTO> purchasedItems = accountComponent.getPurchasedItems(username)
            .stream()
            .map((purchasedItem) -> accountActivityConverter.convertPurchasedItemComponentDTOToActivityDTO(purchasedItem))
            .toList();
        logger.info("Finished processing getPurchasedItems, returning {} items", purchasedItems.size());
        return purchasedItems;
    }

    @GetMapping(name="GetOrderHistory",path="/order-history")
    public List<OrderActivityDTO> getOrderHistory(@AuthenticationPrincipal Jwt jwt) throws AccessDeniedException {
        final String username = jwt.getClaimAsString("username");
        logger.info("Beginning to process getOrderHistory for user {}", username);
        final List<OrderActivityDTO> orderHistory = accountComponent.getOrderHistory(username)
            .stream()
            .map(order -> accountActivityConverter.convertOrderComponentDTOToActivityDTO(order))
            .toList();
        logger.info("Finished processing getOrderHistory, returning {} orders", orderHistory.size());
        return orderHistory;
    }
}
package com.gamerparadise.component;

import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.transaction.support.TransactionTemplate;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import lombok.NonNull;
import java.util.Objects;
import java.util.List;

import com.gamerparadise.builder.AccountBuilder;
import com.gamerparadise.builder.ProductsBuilder;
import com.gamerparadise.component.dto.UpdateOrderComponentInputDTO;
import com.gamerparadise.component.dto.OrderComponentDTO;
import com.gamerparadise.component.dto.OrderItemComponentDTO;
import com.gamerparadise.component.dto.ProductComponentDTO;
import com.gamerparadise.component.dto.PurchasedItemComponentDTO;


@Component
public class AccountComponent {
    @Autowired
    private AccountBuilder accountBuilder;
    @Autowired
    private ProductsBuilder productsBuilder;
    @Autowired
    private TransactionTemplate transactionTemplate;
    private static final Logger logger = LogManager.getLogger(AccountComponent.class);

    public OrderComponentDTO getOrCreateOrder(@NonNull String username) {
        return accountBuilder.getOrCreateOrder(username);
    }

    public void updateOrder(@NonNull UpdateOrderComponentInputDTO input, @NonNull String username) {
        final OrderComponentDTO existingOrder = this.getOrCreateOrder(username);
        ProductComponentDTO product;
        OrderItemComponentDTO orderItem;
        final Integer productId = input.getProductId();
        final ProductComponentDTO productFilter = ProductComponentDTO.builder().productId(productId).build();
        switch(input.getAction()) {
            case "add":
                if (existingOrder.getItems().stream().filter((existingOrderItem) -> existingOrderItem.getProductId() == productId).count() > 0) {
                    logger.warn("Item {} already in user's order. Cannot add.", input);
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Warning: cannot add the same item to your order");
                }
                product = productsBuilder.getProductByFilters(productFilter);
                logger.info("Adding {} to {} order", product, username);
                orderItem = OrderItemComponentDTO.builder()
                    .orderId(existingOrder.getOrderId())
                    .productId(product.getProductId())
                    .purchasePrice(product.getPrice())
                    .quantity(input.getQuantity())
                    .build();
                try {
                    accountBuilder.insertItem(orderItem);
                } catch (Exception e) {
                    logger.error("Failed to add item {} to order. Error: ", orderItem, e);
                    throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to add the game to your order. Please try again. If this error persists, please cut us a support ticket");
                }
                break;
            case "remove":
                if (existingOrder.getItems().stream().filter((existingOrderItem) -> existingOrderItem.getProductId() == productId).count() == 0) {
                    logger.warn("Item {} not in user's order. Cannot remove.", input);
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Warning: cannot remove an item that is not in your order");
                }
                product = productsBuilder.getProductByFilters(productFilter);
                orderItem = OrderItemComponentDTO.builder()
                    .orderId(existingOrder.getOrderId())
                    .productId(product.getProductId())
                    .purchasePrice(product.getPrice())
                    .build();
                try {
                    accountBuilder.removeItem(orderItem);
                } catch (Exception e) {
                    logger.error("Failed to remove item {} from order. Error: ", orderItem, e);
                    throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to remove the game from your order. Please try again. If this error persists, please cut us a support ticket");
                }
                break;
            default:
                logger.warn("Invalid order action. Will not process");
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Warning: request does not ");
        }
    }

    public void checkoutOrder(@NonNull String username) {
        final OrderComponentDTO existingOrder = this.getOrCreateOrder(username);
        Boolean success = transactionTemplate.execute(status -> {
            try {
                accountBuilder.addItemsToAccount(existingOrder, username);
                accountBuilder.closeOrder(existingOrder.getOrderId(), "COMPLETED");
                return true;
            } catch (Exception e) {
                return false;
            }
        });
        //if (success) {
        //} else {
        //    logger.error("Failed to successfully check out the order");
        //    accountBuilder.closeOrder(existingOrder.getOrderId(), "FAILED");
        //}
    }

    public List<PurchasedItemComponentDTO> getPurchasedItems(@NonNull String username) {
        return accountBuilder.getPurchasedItems(username);
    }
}
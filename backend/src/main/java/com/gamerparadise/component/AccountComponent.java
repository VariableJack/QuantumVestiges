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
import com.gamerparadise.component.dto.UpdateCartComponentInputDTO;
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

    public OrderComponentDTO getCart(@NonNull String username) {
        return accountBuilder.getCart(username);
    }

    public void updateCart(@NonNull UpdateCartComponentInputDTO input, @NonNull String username) {
        final OrderComponentDTO existingCart = this.getCart(username);
        ProductComponentDTO product;
        OrderItemComponentDTO cartItem;
        final Integer productId = input.getProductId();
        final ProductComponentDTO productFilter = ProductComponentDTO.builder().productId(productId).build();
        // Find a currently open order
        OrderComponentDTO order = accountBuilder.getOrder(username);
        switch(input.getAction()) {
            case "add":
                if (Objects.isNull(order)) {
                    order = accountBuilder.createOrder(username);
                }
                if (existingCart.getItems().stream().filter((existingCartItem) -> existingCartItem.getProductId() == productId).count() > 0) {
                    logger.warn("Item {} already in user's cart. Cannot add.", input);
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Warning: cannot add the same item to your cart");
                }
                product = productsBuilder.getProductByFilters(productFilter);
                logger.info("Adding {} to {} cart", product, username);
                cartItem = OrderItemComponentDTO.builder()
                    .orderId(order.getOrderId())
                    .productId(product.getProductId())
                    .purchasePrice(product.getPrice())
                    .build();
                try {
                    accountBuilder.insertItem(cartItem);
                } catch (Exception e) {
                    logger.error("Failed to add item {} to cart. Error: ", cartItem, e);
                    throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to add the game to your cart. Please try again. If this error persists, please cut us a support ticket");
                }
                break;
            case "remove":
                if (Objects.isNull(order)) {
                    logger.warn("User {} does not have an open order. Cannot remove", username);
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Warning: cannot remove when you don't have an open order");
                }
                if (existingCart.getItems().stream().filter((existingCartItem) -> existingCartItem.getProductId() == productId).count() == 0) {
                    logger.warn("Item {} not in user's cart. Cannot remove.", input);
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Warning: cannot remove an item that is not in your cart");
                }
                product = productsBuilder.getProductByFilters(productFilter);
                cartItem = OrderItemComponentDTO.builder()
                    .orderId(order.getOrderId())
                    .productId(product.getProductId())
                    .purchasePrice(product.getPrice())
                    .build();
                try {
                    accountBuilder.removeItem(cartItem);
                } catch (Exception e) {
                    logger.error("Failed to add item {} to cart. Error: ", cartItem, e);
                    throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to remove the game from your cart. Please try again. If this error persists, please cut us a support ticket");
                }
                break;
            default:
                logger.warn("Invalid cart action. Will not process");
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Warning: request does not ");
        }
    }

    public void checkoutCart(@NonNull String username) {
        final OrderComponentDTO existingCart = this.getCart(username);
        Boolean success = transactionTemplate.execute(status -> {
            try {
                accountBuilder.addItemsToAccount(existingCart, username);
                accountBuilder.closeOrder(existingCart.getOrderId(), "COMPLETED");
                return true;
            } catch (Exception e) {
                return false;
            }
        });
        if (success) {
        } else {
            logger.error("Failed to successfully check out the cart");
            accountBuilder.closeOrder(existingCart.getOrderId(), "FAILED");
        }
    }

    public List<PurchasedItemComponentDTO> getPurchasedItems(@NonNull String username) {
        return accountBuilder.getPurchasedItems(username);
    }
}
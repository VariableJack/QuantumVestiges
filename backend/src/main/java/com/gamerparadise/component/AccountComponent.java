package com.gamerparadise.component;

import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import lombok.NonNull;
import java.util.List;

import com.gamerparadise.builder.AccountBuilder;
import com.gamerparadise.builder.GamesBuilder;
import com.gamerparadise.component.dto.UpdateCartComponentInputDTO;
import com.gamerparadise.component.dto.CartComponentDTO;
import com.gamerparadise.component.dto.GameComponentDTO;

@Component
public class AccountComponent {
    @Autowired
    private AccountBuilder accountBuilder;
    @Autowired
    private GamesBuilder gamesBuilder;
    private static final Logger logger = LogManager.getLogger(AccountComponent.class);

    public List<CartComponentDTO> getCart(@NonNull String username) {
        return accountBuilder.getCart(username);
    }

    public void updateCart(@NonNull UpdateCartComponentInputDTO input, @NonNull String username) {
        final List<CartComponentDTO> existingCart = this.getCart(username);
        GameComponentDTO game;
        CartComponentDTO cartItem;
        switch(input.getAction()) {
            case "add":
                if (existingCart.stream().filter((existingCartItem) -> existingCartItem.getGameId().equals(input.getGameId())).count() > 0) {
                    logger.warn("Item {} already in user's cart. Cannot add.", input);
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Warning: cannot add the same item to your cart");
                }
                game = gamesBuilder.getGameById(input.getGameId());
                logger.info("Adding {} to {} cart", game, username);
                cartItem = CartComponentDTO.builder()
                    .username(username)
                    .gameId(game.getGameId())
                    .gameName(game.getGameName())
                    .franchiseId(game.getFranchiseId())
                    .franchiseName(game.getFranchiseName())
                    .build();
                try {
                    accountBuilder.insertItem(cartItem);
                } catch (Exception e) {
                    logger.error("Failed to add item {} to cart. Error: ", cartItem, e);
                    throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to add the game to your cart. Please try again. If this error persists, please cut us a support ticket");
                }
                break;
            case "remove":
                if (existingCart.stream().filter((existingCartItem) -> existingCartItem.getGameId().equals(input.getGameId())).count() == 0) {
                    logger.warn("Item {} not in user's cart. Cannot remove.", input);
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Warning: cannot remove an item that is not in your cart");
                }
                game = gamesBuilder.getGameById(input.getGameId());
                cartItem = CartComponentDTO.builder()
                    .username(username)
                    .gameId(game.getGameId())
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
        final List<CartComponentDTO> existingCart = this.getCart(username);
        accountBuilder.addItemsToAccount(existingCart, username);
        accountBuilder.clearCart(username);
    }
}
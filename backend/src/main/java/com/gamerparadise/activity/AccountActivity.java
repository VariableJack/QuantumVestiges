package com.gamerparadise.activity;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
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
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import lombok.NonNull;
import java.util.Objects;
import java.util.List;
import java.util.Map;

import com.gamerparadise.activity.dto.CartActivityDTO;
import com.gamerparadise.activity.dto.UpdateCartActivityInputDTO;
import com.gamerparadise.activity.converter.AccountActivityConverter;
import com.gamerparadise.accessor.CognitoAccessor;
import com.gamerparadise.component.AccountComponent;

@RestController
public class AccountActivity {
    @Autowired
    private AccountActivityConverter accountActivityConverter;
    @Autowired
    private AccountComponent accountComponent;
    @Autowired
    private CognitoAccessor cognitoAccessor;
    private static final Logger logger = LogManager.getLogger(AccountActivity.class);

    @GetMapping(name="GetCart",path="/cart")
    public String getCart(@NonNull @RequestHeader(HttpHeaders.AUTHORIZATION) String accessToken) throws AccessDeniedException {
        final Map<String, String> auth = cognitoAccessor.getUserDetailsFromAccessToken(accessToken);
        logger.info("Beginning to process getCart for user {}", auth.get("username"));
        return "Cart";
    }

    @PostMapping(name="UpdateCart",path="/update-cart")
    public void updateCart(
        @NonNull @RequestHeader(HttpHeaders.AUTHORIZATION) String accessToken,
        @NonNull @RequestBody UpdateCartActivityInputDTO input) throws AccessDeniedException {
        final Map<String, String> auth = cognitoAccessor.getUserDetailsFromAccessToken(accessToken);
        final String username = auth.get("username");
        logger.info("Beginning to process updateCart for user {}, with input {}", username, input);
        if (Objects.isNull(input.getAction()) || Objects.isNull(input.getGameId())) {
            return;
        }
        accountComponent.updateCart(accountActivityConverter.convertCartInputToComponentDTO(input), username);
    }

    @PostMapping(name="CheckoutCart",path="/checkout-cart")
    public void checkoutCart(@NonNull @RequestHeader(HttpHeaders.AUTHORIZATION) String accessToken) throws AccessDeniedException {
        final Map<String, String> auth = cognitoAccessor.getUserDetailsFromAccessToken(accessToken);
        final String username = auth.get("username");
        logger.info("Beginning to process checkoutCart for user {}", username);
        accountComponent.checkoutCart(username);
        logger.info("Finished processing checkoutCart");
        return;
    }

    @GetMapping(name="GetPurchasedItems",path="/purchased-games")
    public List<PurchasedItemActivityDTO> getPurchasedItems(@NonNull @RequestHeader(HttpHeaders.AUTHORIZATION) String accessToken) throws AccessDeniedException {
        final Map<String, String> auth = cognitoAccessor.getUserDetailsFromAccessToken(accessToken);
        final String username = auth.get("username");
        logger.info("Beginning to process getPurchasedItemsfor user {}", username);
        final List<PurchasedItemActivityDTO> purchasedItems = accountComponent.getPurchasedItems(username)
			.stream()
			.map((purchasedItem) -> accountActivityConverter.convertPurchasedItemComponentDTOToActivityDTO(purchasedItem))
			.toList();
        logger.info("Finished processing getPurchasedItems, returning {} items", purchasedItems.size());
        return purchasedItems;
    }
}
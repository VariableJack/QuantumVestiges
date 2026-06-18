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

import com.gamerparadise.activity.dto.UserActivityDTO;
import com.gamerparadise.activity.dto.UserNotificationActivityDTO;
import com.gamerparadise.activity.dto.UserSubscriptionActivityDTO;
import com.gamerparadise.activity.converter.AdministrationActivityConverter;
import com.gamerparadise.component.AdministrationComponent;
import com.gamerparadise.component.dto.UserComponentDTO;
import com.gamerparadise.component.dto.UserNotificationComponentDTO;
import com.gamerparadise.component.dto.UserSubscriptionComponentDTO;

@RestController
public class AdministrationActivity {
    @Autowired
    private AdministrationActivityConverter administrationActivityConverter;
    @Autowired
    private AdministrationComponent administrationComponent;
    private static final Logger logger = LogManager.getLogger(AccountActivity.class);

    @GetMapping(name="GetSettings",path="/settings")
    public UserActivityDTO getSettings(@AuthenticationPrincipal Jwt jwt) throws AccessDeniedException {
        final String username = jwt.getClaimAsString("username");
        logger.info("Beginning to process getSettings for user {}", username);
		final UserComponentDTO userComponentDTO = administrationComponent.getOrCreateUser(username);
        final UserActivityDTO userActivityDTO = administrationActivityConverter.convertUserComponentDTOToActivityDTO(userComponentDTO);
        logger.info("Finished processing getSettings");
        return userActivityDTO;
    }

    @PostMapping(name="UpdateNotificationPreferences",path="/notification-preferences")
    public void updateNotificationPreferences(
        @AuthenticationPrincipal Jwt jwt,
        @NonNull @RequestBody UserActivityDTO input) throws AccessDeniedException {
        final String username = jwt.getClaimAsString("username");
        logger.info("Beginning to process updateNotificationPreferences for user {}, with input {}", username, input);
		final List<UserNotificationComponentDTO> inputNotifications = input.getNotifications()
			.stream()
			.map(notification -> administrationActivityConverter.convertUserNotificationActivityDTOToComponentDTO(notification, username))
			.toList();
        administrationComponent.updateNotificationPreferences(inputNotifications);
        logger.info("Finished processing updateNotificationPreferences");
    }
}
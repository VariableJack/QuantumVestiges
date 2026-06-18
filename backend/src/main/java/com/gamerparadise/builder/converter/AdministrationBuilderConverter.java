package com.gamerparadise.builder.converter;
import org.springframework.stereotype.Component;

import lombok.NonNull;

import com.gamerparadise.component.dto.UserComponentDTO;
import com.gamerparadise.component.dto.UserNotificationComponentDTO;
import com.gamerparadise.component.dto.UserSubscriptionComponentDTO;
import com.gamerparadise.dao.dto.UserDAODTO;
import com.gamerparadise.dao.dto.UserNotificationDAODTO;
import com.gamerparadise.dao.dto.UserSubscriptionDAODTO;

@Component
public class AdministrationBuilderConverter {
    public UserComponentDTO convertUserDAODTOToComponentDTO(@NonNull UserDAODTO input) {
        return UserComponentDTO.builder()
            .userId(input.getUserId())
            .username(input.getUsername())
            .notifications(input.getNotifications()
				.stream()
				.map(notification -> convertUserNotificationDAODTOToComponentDTO(notification))
				.toList())
            .subscriptions(input.getSubscriptions()
				.stream()
				.map(subscription -> convertUserSubscriptionDAODTOToComponentDTO(subscription))
				.toList())
            .build();
    }

    public UserNotificationComponentDTO convertUserNotificationDAODTOToComponentDTO(@NonNull UserNotificationDAODTO input) {
        return UserNotificationComponentDTO.builder()
            .username(input.getUsername())
            .isEnabled(input.isEnabled())
            .notificationType(input.getNotificationType())
            .frequency(input.getFrequency())
            .lastUpdateTime(input.getLastUpdateTime())
            .build();
    }

	public UserSubscriptionComponentDTO convertUserSubscriptionDAODTOToComponentDTO(@NonNull UserSubscriptionDAODTO input) {
		return UserSubscriptionComponentDTO.builder()
			.username(input.getUsername())
			.subscriptionStartDate(input.getSubscriptionStartDate())
			.subscriptionEndDate(input.getSubscriptionEndDate())
			.billingPeriod(input.getBillingPeriod())
			.autoRenewal(input.getAutoRenewal())
			.productId(input.getProductId())
			.productName(input.getProductName())
			.build();
	}

    public UserNotificationDAODTO convertUserNotificationComponentDTOToDAODTO(@NonNull UserNotificationComponentDTO input) {
        return UserNotificationDAODTO.builder()
            .username(input.getUsername())
            .isEnabled(input.isEnabled())
            .notificationType(input.getNotificationType())
            .frequency(input.getFrequency())
            .lastUpdateTime(input.getLastUpdateTime())
            .build();
    }

	public UserSubscriptionDAODTO convertUserSubscriptionComponentDTOToDAODTO(@NonNull UserSubscriptionComponentDTO input) {
		return UserSubscriptionDAODTO.builder()
			.username(input.getUsername())
			.subscriptionStartDate(input.getSubscriptionStartDate())
			.subscriptionEndDate(input.getSubscriptionEndDate())
			.billingPeriod(input.getBillingPeriod())
			.autoRenewal(input.getAutoRenewal())
			.productId(input.getProductId())
			.productName(input.getProductName())
			.build();
	}
}

package com.gamerparadise.activity.converter;
import org.springframework.stereotype.Component;

import lombok.NonNull;

import com.gamerparadise.activity.dto.UserActivityDTO;
import com.gamerparadise.activity.dto.UserNotificationActivityDTO;
import com.gamerparadise.activity.dto.UserSubscriptionActivityDTO;
import com.gamerparadise.component.dto.UserComponentDTO;
import com.gamerparadise.component.dto.UserNotificationComponentDTO;
import com.gamerparadise.component.dto.UserSubscriptionComponentDTO;

@Component
public class AdministrationActivityConverter {
    public UserActivityDTO convertUserComponentDTOToActivityDTO(@NonNull UserComponentDTO input) {
        return UserActivityDTO.builder()
            .userId(input.getUserId())
            .username(input.getUsername())
            .notifications(input.getNotifications()
				.stream()
				.map(notification -> convertUserNotificationComponentDTOToActivityDTO(notification))
				.toList())
            .subscriptions(input.getSubscriptions()
				.stream()
				.map(subscription -> convertUserSubscriptionComponentDTOToActivityDTO(subscription))
				.toList())
            .build();
    }

    public UserNotificationActivityDTO convertUserNotificationComponentDTOToActivityDTO(@NonNull UserNotificationComponentDTO input) {
        return UserNotificationActivityDTO.builder()
            .username(input.getUsername())
            .isEnabled(input.isEnabled())
            .notificationType(input.getNotificationType())
            .frequency(input.getFrequency())
            .lastUpdateTime(input.getLastUpdateTime())
            .build();
    }

	public UserSubscriptionActivityDTO convertUserSubscriptionComponentDTOToActivityDTO(@NonNull UserSubscriptionComponentDTO input) {
		return UserSubscriptionActivityDTO.builder()
			.username(input.getUsername())
			.subscriptionStartDate(input.getSubscriptionStartDate())
			.subscriptionEndDate(input.getSubscriptionEndDate())
			.billingPeriod(input.getBillingPeriod())
			.autoRenewal(input.getAutoRenewal())
			.productId(input.getProductId())
			.productName(input.getProductName())
			.build();
	}

    public UserNotificationComponentDTO convertUserNotificationActivityDTOToComponentDTO(@NonNull UserNotificationActivityDTO input, @NonNull String username) {
        return UserNotificationComponentDTO.builder()
            .username(username)
            .isEnabled(input.isEnabled())
            .notificationType(input.getNotificationType())
            .frequency(input.getFrequency())
            .lastUpdateTime(input.getLastUpdateTime())
            .build();
    }

	public UserSubscriptionComponentDTO convertUserSubscriptionActivityDTOToComponentDTO(@NonNull UserSubscriptionActivityDTO input, @NonNull String username) {
		return UserSubscriptionComponentDTO.builder()
			.username(username)
			.subscriptionStartDate(input.getSubscriptionStartDate())
			.subscriptionEndDate(input.getSubscriptionEndDate())
			.billingPeriod(input.getBillingPeriod())
			.autoRenewal(input.getAutoRenewal())
			.productId(input.getProductId())
			.productName(input.getProductName())
			.build();
	}
}
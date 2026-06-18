package com.gamerparadise.builder;

import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Autowired;

import lombok.NonNull;
import java.util.List;
import java.util.Objects;

import com.gamerparadise.builder.converter.AdministrationBuilderConverter;
import com.gamerparadise.component.dto.UserComponentDTO;
import com.gamerparadise.component.dto.UserNotificationComponentDTO;
import com.gamerparadise.component.dto.UserSubscriptionComponentDTO;
import com.gamerparadise.dao.AdministrationDAO;
import com.gamerparadise.dao.dto.UserDAODTO;
import com.gamerparadise.dao.dto.UserNotificationDAODTO;
import com.gamerparadise.dao.dto.UserSubscriptionDAODTO;

@Component
public class AdministrationBuilder {
    @Autowired
    private AdministrationDAO administrationDAO;
    @Autowired
    private AdministrationBuilderConverter administrationBuilderConverter;
	public UserComponentDTO getOrCreateUser(@NonNull String username) {
		UserDAODTO output = administrationDAO.getUser(username);
		if (Objects.isNull(output)) {
			output = administrationDAO.createUser(username);
		}
		return administrationBuilderConverter
			.convertUserDAODTOToComponentDTO(output);
	}

	public List<UserNotificationComponentDTO> getUserNotificationPreferences(@NonNull String username) {
		return administrationDAO.getUserNotificationPreferences(username)
			.stream()
			.map(notification -> administrationBuilderConverter
				.convertUserNotificationDAODTOToComponentDTO(notification))
			.toList();
	}

	public List<UserSubscriptionComponentDTO> getUserSubscriptions(@NonNull String username) {
		return administrationDAO.getUserSubscriptions(username)
			.stream()
			.map(subscription -> administrationBuilderConverter
				.convertUserSubscriptionDAODTOToComponentDTO(subscription))
			.toList();
	}

	public void saveUserPayment(@NonNull String username, @NonNull String stripeCustomerId) {
		administrationDAO.saveUserPayment(username, stripeCustomerId);
	}

	public void updateNotificationPreference(@NonNull UserNotificationComponentDTO input) {
		final UserNotificationDAODTO convertedInput = administrationBuilderConverter
			.convertUserNotificationComponentDTOToDAODTO(input);
		administrationDAO.updateNotificationPreference(convertedInput);
	}

	public void createSubscription(@NonNull UserSubscriptionComponentDTO input) {
		final UserSubscriptionDAODTO convertedInput = administrationBuilderConverter
			.convertUserSubscriptionComponentDTOToDAODTO(input);
		administrationDAO.createSubscription(convertedInput);
	}

	public void updateSubscription(@NonNull UserSubscriptionComponentDTO input) {
		final UserSubscriptionDAODTO convertedInput = administrationBuilderConverter
			.convertUserSubscriptionComponentDTOToDAODTO(input);
		administrationDAO.updateSubscription(convertedInput);
	}
}

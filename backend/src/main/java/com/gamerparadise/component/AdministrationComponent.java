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
import java.sql.Timestamp;
import com.gamerparadise.builder.AdministrationBuilder;
import com.gamerparadise.component.dto.UserComponentDTO;
import com.gamerparadise.component.dto.UserNotificationComponentDTO;
import com.gamerparadise.component.dto.UserSubscriptionComponentDTO;

@Component
public class AdministrationComponent {
    @Autowired
    private AdministrationBuilder administrationBuilder;
    @Autowired
    private TransactionTemplate transactionTemplate;
    private static final Logger logger = LogManager.getLogger(AdministrationComponent.class);

    public UserComponentDTO getOrCreateUser(@NonNull String username) {
		return administrationBuilder.getOrCreateUser(username);
	}

	public List<UserNotificationComponentDTO> getUserNotificationPreferences(@NonNull String username) {
		return administrationBuilder.getUserNotificationPreferences(username);
	}

	public List<UserSubscriptionComponentDTO> getUserSubscriptions(@NonNull String username) {
		return administrationBuilder.getUserSubscriptions(username);
	}

	public void saveUserPayment(@NonNull String username, @NonNull String stripeCustomerId) {
		administrationBuilder.saveUserPayment(username, stripeCustomerId);
	}

	public void updateNotificationPreferences(@NonNull List<UserNotificationComponentDTO> input) {
        Boolean success = transactionTemplate.execute(status -> {
            try {
				input.stream().forEach(notification ->
					administrationBuilder.updateNotificationPreference(notification)
				);
                return true;
            } catch (Exception e) {
                return false;
            }
        });
        if (success) {
        } else {
            logger.error("Failed to successfully update preferences");
        }
	}

    public void createSubscription(@NonNull UserSubscriptionComponentDTO input) {
		Timestamp subscriptionEndDate = new Timestamp(0);
		switch(input.getBillingPeriod()) {
			case "1-MONTH":
				subscriptionEndDate = Timestamp.valueOf(input.getSubscriptionStartDate().toLocalDateTime().plusMonths(1));
				break;
			case "3-MONTH":
				subscriptionEndDate = Timestamp.valueOf(input.getSubscriptionStartDate().toLocalDateTime().plusMonths(3));
				break;
			case "6-MONTH":
				subscriptionEndDate = Timestamp.valueOf(input.getSubscriptionStartDate().toLocalDateTime().plusMonths(6));
				break;
			case "12-MONTH":
				subscriptionEndDate = Timestamp.valueOf(input.getSubscriptionStartDate().toLocalDateTime().plusMonths(12));
				break;
			default:
				throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Not a valid billing period");
		}
		input.setSubscriptionEndDate(subscriptionEndDate);
		administrationBuilder.createSubscription(input);
	}

    public void updateSubscription(@NonNull UserSubscriptionComponentDTO input) {
		administrationBuilder.updateSubscription(input);
	}
}
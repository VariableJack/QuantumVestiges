package com.gamerparadise.component.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Builder
@Data
public class UserComponentDTO {
    private long userId;
    private String username;
    private List<UserNotificationComponentDTO> notifications;
    private List<UserSubscriptionComponentDTO> subscriptions;
}

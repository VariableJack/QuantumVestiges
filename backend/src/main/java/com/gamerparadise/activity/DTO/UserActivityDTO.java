package com.gamerparadise.activity.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Builder
@Data
public class UserActivityDTO {
    private long userId;
    private String username;
    private List<UserNotificationActivityDTO> notifications;
    private List<UserSubscriptionActivityDTO> subscriptions;
}

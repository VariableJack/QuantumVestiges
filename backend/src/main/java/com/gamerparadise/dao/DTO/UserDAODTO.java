package com.gamerparadise.dao.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Builder
@Data
public class UserDAODTO {
    private long userId;
    private String username;
    private List<UserNotificationDAODTO> notifications;
    private List<UserSubscriptionDAODTO> subscriptions;
}

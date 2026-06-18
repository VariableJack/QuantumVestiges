package com.gamerparadise.dao.dto;

import lombok.Builder;
import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import java.util.List;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserDAODTO {
    private long userId;
    private String username;
    private List<UserNotificationDAODTO> notifications;
    private List<UserSubscriptionDAODTO> subscriptions;
}

package com.gamerparadise.activity.dto;

import lombok.Builder;
import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class UserActivityDTO {
    private Integer userId;
    private String username;
    private List<UserNotificationActivityDTO> notifications;
    private List<UserSubscriptionActivityDTO> subscriptions;
}

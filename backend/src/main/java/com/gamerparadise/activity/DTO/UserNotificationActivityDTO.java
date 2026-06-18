package com.gamerparadise.activity.dto;

import lombok.Builder;
import lombok.Data;

import java.sql.Timestamp;

@Builder
@Data
public class UserNotificationActivityDTO {
    private String username;
    private boolean isEnabled;
    private String notificationType;
    private String frequency;
    private Timestamp lastUpdateTime;
}

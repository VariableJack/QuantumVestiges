package com.gamerparadise.component.dto;

import lombok.Builder;
import lombok.Data;

import java.sql.Timestamp;

@Builder
@Data
public class UserNotificationComponentDTO {
    private String username;
    private boolean isEnabled;
    private String notificationType;
    private String frequency;
    private Timestamp lastUpdateTime;
}

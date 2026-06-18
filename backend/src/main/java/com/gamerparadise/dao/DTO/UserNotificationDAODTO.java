package com.gamerparadise.dao.dto;

import lombok.Builder;
import lombok.Data;

import java.sql.Timestamp;

@Builder
@Data
public class UserNotificationDAODTO {
    private String username;
    private boolean isEnabled;
    private String notificationType;
    private String frequency;
    private Timestamp lastUpdateTime;
}

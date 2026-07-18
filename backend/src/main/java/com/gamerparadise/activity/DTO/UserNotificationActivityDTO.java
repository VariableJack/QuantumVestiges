package com.gamerparadise.activity.dto;

import lombok.Builder;
import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class UserNotificationActivityDTO {
    private String username;
    private Boolean isEnabled;
    private String notificationType;
    private String frequency;
    private Timestamp lastUpdateTime;
}

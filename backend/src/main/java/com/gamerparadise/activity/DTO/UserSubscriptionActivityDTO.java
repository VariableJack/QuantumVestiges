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
public class UserSubscriptionActivityDTO {
    private String username;
    private Timestamp subscriptionStartDate;
    private Timestamp subscriptionEndDate;
    private String billingPeriod;
    private String autoRenewal;
    private Integer productId;
    private String productName;
}

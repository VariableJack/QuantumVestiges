package com.gamerparadise.component.dto;

import lombok.Builder;
import lombok.Data;

import java.sql.Timestamp;

@Builder
@Data
public class UserSubscriptionComponentDTO {
    private String username;
    private Timestamp subscriptionStartDate;
    private Timestamp subscriptionEndDate;
    private String billingPeriod;
    private String autoRenewal;
    private Integer productId;
    private String productName;
}

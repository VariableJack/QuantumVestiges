package com.gamerparadise.dao.dto;

import lombok.Builder;
import lombok.Data;

import java.sql.Timestamp;

@Builder
@Data
public class UserSubscriptionDAODTO {
    private String username;
    private Timestamp subscriptionStartDate;
    private Timestamp subscriptionEndDate;
    private String billingPeriod;
    private String autoRenewal;
    private Integer productId;
    private String productName;
}

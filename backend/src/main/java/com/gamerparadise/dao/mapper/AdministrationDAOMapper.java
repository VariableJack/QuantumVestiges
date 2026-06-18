package com.gamerparadise.dao.mapper;

import org.springframework.stereotype.Component;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import lombok.NonNull;
import java.util.List;

import com.gamerparadise.dao.dto.UserDAODTO;
import com.gamerparadise.dao.dto.UserNotificationDAODTO;
import com.gamerparadise.dao.dto.UserSubscriptionDAODTO;

@Component
@Mapper
public interface AdministrationDAOMapper {
    public UserDAODTO getUser(@Param("username") @NonNull String username);
    public List<UserNotificationDAODTO> getUserNotificationPreferences(@Param("username") @NonNull String username);
    public List<UserSubscriptionDAODTO> getUserSubscriptions(@Param("username") @NonNull String username);
    public void createUser(@Param("username") @NonNull String username);
    public void saveUserPayment(@NonNull String username, @Param("stripeCustomerId") @NonNull String stripeCustomerId);
    public void updateNotificationPreference(@Param("input") @NonNull UserNotificationDAODTO input);
    public void createSubscription(@Param("input") @NonNull UserSubscriptionDAODTO input);
    public void updateSubscription(@Param("input") @NonNull UserSubscriptionDAODTO input);
}

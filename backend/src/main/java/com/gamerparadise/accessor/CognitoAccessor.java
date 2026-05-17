package com.gamerparadise.accessor;

import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.access.AccessDeniedException;

import software.amazon.awssdk.services.cognitoidentityprovider.CognitoIdentityProviderClient;
import software.amazon.awssdk.services.cognitoidentityprovider.model.GetUserRequest;
import software.amazon.awssdk.services.cognitoidentityprovider.model.GetUserResponse;
import software.amazon.awssdk.services.cognitoidentityprovider.model.AdminListGroupsForUserRequest;
import software.amazon.awssdk.services.cognitoidentityprovider.model.AdminListGroupsForUserResponse;
import software.amazon.awssdk.services.cognitoidentityprovider.model.GroupType;
import software.amazon.awssdk.services.cognitoidentityprovider.model.CognitoIdentityProviderException;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import lombok.NonNull;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

@Component
public class CognitoAccessor {
    @Autowired
    private CognitoIdentityProviderClient cognitoIdentityProviderClient;
    private static final Logger logger = LogManager.getLogger(CognitoAccessor.class);
    @Value("${cognito.user_pool_id}")
    private String userPoolId;

    public Map<String, String> getUserDetailsFromAccessToken(@NonNull String accessToken) {
        final Map<String, String> results = new HashMap<>();
        try {
            final GetUserRequest request = GetUserRequest.builder()
                .accessToken(accessToken)
                .build();
            final GetUserResponse response = cognitoIdentityProviderClient.getUser(request);
            final String username = response.username();
            final AdminListGroupsForUserRequest groupsRequest = AdminListGroupsForUserRequest.builder()
                    .username(username)
                    .userPoolId(userPoolId)
                    .build();
            final AdminListGroupsForUserResponse groupsResponse = cognitoIdentityProviderClient.adminListGroupsForUser(groupsRequest);
            final List<GroupType> groups = groupsResponse.groups();
            results.put("username", username);
            if (groups.size() == 0) {
                results.put("group", "user");
            } else {
                results.put("group", groups.get(0).groupName());
            }
            logger.info("Got results: {}", results);
            return results;
        } catch (CognitoIdentityProviderException e) {
            logger.info("Caught exception e ", e);
            throw new AccessDeniedException("Failed to authorize user");
        }
    }
}
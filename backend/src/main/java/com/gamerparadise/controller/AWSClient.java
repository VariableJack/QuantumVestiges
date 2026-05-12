package com.gamerparadise.controller;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.cognitoidentityprovider.CognitoIdentityProviderClient;
import software.amazon.awssdk.services.secretsmanager.SecretsManagerClient;

@Configuration
class AWSClient {
	@Bean
	public CognitoIdentityProviderClient cognitoIdentityProviderClient() {
		return CognitoIdentityProviderClient.builder()
			.region(Region.US_WEST_1)
			.build();
	}
	@Bean
	public SecretsManagerClient secretsManagerClient() {
		return SecretsManagerClient.builder()
			.region(Region.US_WEST_1)
			.build();
	}
}
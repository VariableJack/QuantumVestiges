package com.gamerparadise.controller;

import org.springframework.core.annotation.Order;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.Customizer;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerMapping;

@Configuration
public class SecurityConfig {
    @Bean
    @Order(1)
    public SecurityFilterChain publicSecurityFilterChain(
            HttpSecurity http, 
            RequestMappingHandlerMapping handlerMapping) throws Exception {
        final AnnotationRequestMatcher publicEndpoints = new AnnotationRequestMatcher(handlerMapping);
        http
            .securityMatcher(publicEndpoints)
            .cors(Customizer.withDefaults())
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth.anyRequest().permitAll());
        return http.build();
    }

    @Bean
    @Order(2)
    public SecurityFilterChain protectedSecurityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors(Customizer.withDefaults())
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth.anyRequest().authenticated())
            .oauth2ResourceServer(oauth2 -> oauth2
                .authenticationEntryPoint(new CustomAuthenticationEntryPoint())
                .jwt(Customizer.withDefaults())
            );
        return http.build();
    }
}
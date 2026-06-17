package com.gamerparadise.controller;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.Customizer;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerMapping;

@Configuration
public class SecurityConfig {
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http,
        RequestMappingHandlerMapping handlerMapping) throws Exception {
        final AnnotationRequestMatcher publicEndpoints = new AnnotationRequestMatcher(handlerMapping);
        http.cors(Customizer.withDefaults())
            .authorizeHttpRequests((requests) -> requests
                .requestMatchers(publicEndpoints).permitAll()
                .anyRequest().authenticated())
            .oauth2ResourceServer(oauth2 -> oauth2
                .authenticationEntryPoint(new CustomAuthenticationEntryPoint())
                .jwt(Customizer.withDefaults()));
        return http.build();
    }
}
package com.gamerparadise.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import tools.jackson.databind.ObjectMapper;
import java.util.List;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Value("${cors.allowed.origins}")
    private List<String> allowedOrigins;

    //@Bean
    //public WebConfig corsConfigurer() {
    //    return new WebConfig() {
    //        @Override
    //        public void addCorsMappings(CorsRegistry registry) {
    //            registry.addMapping("/**")
    //                    .allowedOrigins(allowedOrigins.toArray(new String[0]))
    //                    .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
    //                    .allowedHeaders("*")
    //                    .exposedHeaders("Access-Control-Allow-Origin", "Access-Control-Allow-Credentials")
    //                    .allowCredentials(true);
    //        }
    //    };
    //}

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins(allowedOrigins.toArray(new String[0]))
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .exposedHeaders("Access-Control-Allow-Origin", "Access-Control-Allow-Credentials")
                .allowCredentials(true);
    }

    @Override
    public void configureMessageConverters(List<HttpMessageConverter<?>> converters) {
        converters.add(0, new Jackson3HttpMessageConverter(new ObjectMapper()));
    }
}
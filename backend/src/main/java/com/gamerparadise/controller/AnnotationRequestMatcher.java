package com.gamerparadise.controller;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.web.util.matcher.RequestMatcher;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.HandlerExecutionChain;
import org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerMapping;

import com.gamerparadise.controller.objects.PublicEndpoint;

public class AnnotationRequestMatcher implements RequestMatcher {
    private final RequestMappingHandlerMapping handlerMapping;

    public AnnotationRequestMatcher(RequestMappingHandlerMapping handlerMapping) {
        this.handlerMapping = handlerMapping;
    }

    @Override
    public boolean matches(HttpServletRequest request) {
        try {
            HandlerExecutionChain handlerExecutionChain = handlerMapping.getHandler(request);
            if (handlerExecutionChain == null) {
                return false;
            }

            Object handler = handlerExecutionChain.getHandler();
            if (handler instanceof HandlerMethod handlerMethod) {
                return handlerMethod.hasMethodAnnotation(PublicEndpoint.class) ||
                       handlerMethod.getBeanType().isAnnotationPresent(PublicEndpoint.class);
            }
        } catch (Exception e) {
            return false;
        }
        return false;
    }
}
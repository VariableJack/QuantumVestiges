package com.gamerparadise.controller;

import org.springframework.http.HttpInputMessage;
import org.springframework.http.HttpOutputMessage;
import org.springframework.http.MediaType;
import org.springframework.http.converter.AbstractGenericHttpMessageConverter;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.http.converter.HttpMessageNotWritableException;
import tools.jackson.core.JacksonException;
import tools.jackson.databind.JavaType;
import tools.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.lang.reflect.Type;
import java.nio.charset.StandardCharsets;

public class Jackson3HttpMessageConverter extends AbstractGenericHttpMessageConverter<Object> {
    private final ObjectMapper objectMapper;

    public Jackson3HttpMessageConverter(ObjectMapper objectMapper) {
        super(MediaType.APPLICATION_JSON, new MediaType("application", "*+json", StandardCharsets.UTF_8));
        this.objectMapper = objectMapper;
    }

    @Override
    protected boolean supports(Class<?> clazz) {
        return true;
    }

    @Override
    public Object read(Type type, Class<?> contextClass, HttpInputMessage inputMessage)
            throws IOException, HttpMessageNotReadableException {
        try {
            JavaType javaType = objectMapper.constructType(type);
            return objectMapper.readValue(inputMessage.getBody(), javaType);
        } catch (JacksonException e) {
            throw new HttpMessageNotReadableException("JSON parse error: " + e.getMessage(), e, inputMessage);
        }
    }

    @Override
    protected Object readInternal(Class<?> clazz, HttpInputMessage inputMessage)
            throws IOException, HttpMessageNotReadableException {
        try {
            return objectMapper.readValue(inputMessage.getBody(), clazz);
        } catch (JacksonException e) {
            throw new HttpMessageNotReadableException("JSON parse error: " + e.getMessage(), e, inputMessage);
        }
    }

    @Override
    protected void writeInternal(Object object, Type type, HttpOutputMessage outputMessage)
            throws IOException, HttpMessageNotWritableException {
        try {
            objectMapper.writeValue(outputMessage.getBody(), object);
        } catch (JacksonException e) {
            throw new HttpMessageNotWritableException("Could not write JSON: " + e.getMessage(), e);
        }
    }
}
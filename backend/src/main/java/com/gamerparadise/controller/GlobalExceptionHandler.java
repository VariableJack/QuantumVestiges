package com.gamerparadise.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.server.ResponseStatusException;

import com.gamerparadise.controller.objects.ErrorResponse;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<ErrorResponse> handleResponseStatusException(ResponseStatusException ex) {
        ErrorResponse errorBody = new ErrorResponse(
            ex.getStatusCode().value(),
            ex.getReason()
        );
        
        return new ResponseEntity<>(errorBody, ex.getStatusCode());
    }
}

package com.gamerparadise;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;

import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import com.gamerparadise.accessor.CognitoAccessor;

@RestController
@SpringBootApplication
public class GamerParadise {
	@Autowired
	private CognitoAccessor cognitoAccessor;

	@RequestMapping("/")
	String home() {
		return "Hello World!";
	}
	@GetMapping(path="/login")
	void login(@RequestParam(name="accessToken",required=true) String accessToken) {
		cognitoAccessor.getUserDetailsFromAccessToken(accessToken);
	}

	public static void main(String[] args) {
		SpringApplication.run(GamerParadise.class, args);
	}

}
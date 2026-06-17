package com.gamerparadise.activity;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import lombok.NonNull;
import java.util.List;
import java.util.Objects;
import java.util.Map;

import com.gamerparadise.activity.converter.FranchisesActivityConverter;
import com.gamerparadise.activity.dto.FranchiseActivityDTO;
import com.gamerparadise.component.FranchisesComponent;
import com.gamerparadise.component.dto.FranchiseComponentDTO;

import com.gamerparadise.controller.objects.PublicEndpoint;

@RestController
public class FranchisesActivity {
    @Autowired
    private FranchisesActivityConverter franchisesActivityConverter;
    @Autowired
    private FranchisesComponent franchisesComponent;
    private static final Logger logger = LogManager.getLogger(FranchisesActivity.class);

    @PublicEndpoint
    @GetMapping(name="GetFranchises",path="/franchises")
    public List<FranchiseActivityDTO> getFranchises() {
        logger.info("Beginning to process getFranchises");
        final List<FranchiseComponentDTO> getFranchisesComponentOutput = franchisesComponent.getFranchises();
        final List<FranchiseActivityDTO> convertedOutput = getFranchisesComponentOutput
            .stream()
            .map((franchise) -> franchisesActivityConverter.convertFranchiseComponentDTOToActivityDTO(franchise))
            .toList();
        logger.info("Finished fetching {} franchise(s)", convertedOutput.size());
        return convertedOutput;
    }

    @PublicEndpoint
    @GetMapping(name="GetFranchiseById",path="/franchise")
    public FranchiseActivityDTO getFranchiseById(@RequestParam(name="franchiseId",required=true) Integer franchiseId) {
        logger.info("Beginning to process getFranchiseById for franchise ID" + franchiseId.toString());
        final FranchiseComponentDTO getFranchisesComponentOutput = franchisesComponent.getFranchiseById(franchiseId);
        final FranchiseActivityDTO convertedOutput = franchisesActivityConverter.convertFranchiseComponentDTOToActivityDTO(getFranchisesComponentOutput);
        logger.info("Finished fetching franchise {}", convertedOutput);
        return convertedOutput;
    }

    @PostMapping(name="CreateFranchise",path="/franchise/create")
    public FranchiseActivityDTO createFranchise(@AuthenticationPrincipal Jwt jwt, @NonNull @RequestBody FranchiseActivityDTO input) {
        final String username = jwt.getClaimAsString("username");
        final String group = jwt.getClaimAsStringList("cognito:groups").stream().filter(item -> item.equals("admin")).findFirst().orElse("user");
        if (!group.equals("admin")) {
            logger.warn("User {} cannot create a new franchise", username);
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "You are not permitted to create a new franchise");
        }
        logger.info("Beginning to process createFranchise with input {} for user {} under group", input, username, group);
        final FranchiseComponentDTO output = franchisesComponent.insertFranchise(franchisesActivityConverter.convertFranchiseActivityDTOToComponentDTO(input));
        logger.info("Finished processing createFranchise");
        return franchisesActivityConverter.convertFranchiseComponentDTOToActivityDTO(output);
    }
}
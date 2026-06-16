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
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import lombok.NonNull;
import java.util.List;
import java.util.Objects;
import java.util.Map;

import com.gamerparadise.activity.converter.FranchisesActivityConverter;
import com.gamerparadise.activity.dto.FranchiseActivityDTO;
import com.gamerparadise.accessor.CognitoAccessor;
import com.gamerparadise.component.FranchisesComponent;
import com.gamerparadise.component.dto.FranchiseComponentDTO;

@RestController
public class FranchisesActivity {
    @Autowired
    private FranchisesActivityConverter franchisesActivityConverter;
    @Autowired
    private FranchisesComponent franchisesComponent;
    @Autowired
    private CognitoAccessor cognitoAccessor;
    private static final Logger logger = LogManager.getLogger(FranchisesActivity.class);

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

    @GetMapping(name="GetFranchiseById",path="/franchise")
    public FranchiseActivityDTO getFranchiseById(@RequestParam(name="franchiseId",required=true) Integer franchiseId) {
        logger.info("Beginning to process getFranchiseById for franchise ID" + franchiseId.toString());
        final FranchiseComponentDTO getFranchisesComponentOutput = franchisesComponent.getFranchiseById(franchiseId);
        final FranchiseActivityDTO convertedOutput = franchisesActivityConverter.convertFranchiseComponentDTOToActivityDTO(getFranchisesComponentOutput);
        logger.info("Finished fetching franchise {}", convertedOutput);
        return convertedOutput;
    }

    @PostMapping(name="CreateFranchise",path="/franchises")
    public FranchiseActivityDTO createFranchise(@NonNull @RequestHeader(HttpHeaders.AUTHORIZATION) String accessToken, @NonNull @RequestBody FranchiseActivityDTO input) {
        final Map<String, String> auth = cognitoAccessor.getUserDetailsFromAccessToken(accessToken);
        final String username = auth.get("username");
        final String group = auth.get("group");
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
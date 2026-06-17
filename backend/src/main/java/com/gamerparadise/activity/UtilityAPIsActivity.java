package com.gamerparadise.activity;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import lombok.NonNull;
import java.util.Objects;
import java.util.Arrays;
import java.util.ArrayList;
import java.util.List;

import com.gamerparadise.activity.converter.UtilityAPIsActivityConverter;
import com.gamerparadise.activity.dto.GeneratePresignedUrlsActivityDTO;
import com.gamerparadise.activity.dto.GeneratePresignedUrlsOutputActivityDTO;
import com.gamerparadise.component.dto.GeneratePresignedUrlsComponentDTO;
import com.gamerparadise.component.dto.GeneratePresignedUrlsOutputComponentDTO;
import com.gamerparadise.component.UtilityAPIsComponent;

import com.gamerparadise.controller.objects.PublicEndpoint;

@RestController
public class UtilityAPIsActivity {
    @Autowired
    private UtilityAPIsComponent utilityAPIsComponent;
    @Autowired
    private UtilityAPIsActivityConverter utilityAPIsActivityConverter;
    @Value("${s3.bucket.name.games}")
    private String gameS3BucketName;
    private static final Logger logger = LogManager.getLogger(UtilityAPIsActivity.class);

    private static final List<String> validMethods = new ArrayList<>(Arrays.asList("PUT", "GET"));
    private static final List<String> validTypes = new ArrayList<>(Arrays.asList("GAME"));

    private static final <T> boolean checkEntryInList(List<T> list, T entry) {
        return Objects.nonNull(entry) && list.contains(entry);
    }

    @PublicEndpoint
    @PostMapping(name="GeneratePresignedUrls",path="/presigned-urls")
    public GeneratePresignedUrlsOutputActivityDTO generatePresignedUrls(@RequestBody @NonNull GeneratePresignedUrlsActivityDTO input) {
        if (!checkEntryInList(validMethods, input.getMethod())
            || Objects.isNull(input.getFileNames()) || !checkEntryInList(validTypes, input.getType())) {
            logger.warn("generatePresignedUrls encounted invalid input\n" +
                "Method must be non-null and must be either PUT or GET.\n" +
                "List of file names must be non-null.\n" +
                "Type must be GAME");
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid input:\n" +
                "Method must be non-null and must be either PUT or GET.\n" +
                "List of file names must be non-null.\n" +
                "Type must be GAME");
        }
        logger.info("Beginning to process generatePresignedUrls for input {}", input);
        String bucketName;
        switch (input.getType()) {
            case "GAME":
                bucketName = gameS3BucketName;
                break;
            default:
                bucketName = "";
                break;
        }
        final GeneratePresignedUrlsComponentDTO convertedInput = utilityAPIsActivityConverter
            .convertGeneratePresignedUrlsActivityDTOToComponentDTO(input, bucketName);
        final GeneratePresignedUrlsOutputComponentDTO output = utilityAPIsComponent.generatePresignedUrls(convertedInput);
        logger.info("Finished processing generatePresignedUrls with output {}", output);
        return utilityAPIsActivityConverter.convertGeneratePresignedUrlsOutputComponentDTOToActivityDTO(output);
    }
}
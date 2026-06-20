package com.gamerparadise.activity;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import lombok.NonNull;
import java.util.Objects;
import java.util.List;
import java.util.Map;

import com.gamerparadise.activity.converter.DiscussionsActivityConverter;
import com.gamerparadise.activity.dto.ThreadActivityDTO;
import com.gamerparadise.activity.dto.ThreadCommentActivityDTO;
import com.gamerparadise.component.DiscussionsComponent;
import com.gamerparadise.component.dto.ThreadComponentDTO;
import com.gamerparadise.component.dto.ThreadCommentComponentDTO;

import com.gamerparadise.controller.objects.PublicEndpoint;

@RestController
public class DiscussionsActivity {
    @Autowired
    private DiscussionsActivityConverter discussionsActivityConverter;
    @Autowired
    private DiscussionsComponent discussionsComponent;
    private static final Logger logger = LogManager.getLogger(DiscussionsActivity.class);

    /* Validation helpers */
    private void validateThread(ThreadActivityDTO input, String type) {
        if (Objects.isNull(input.getTitle()) || input.getTitle().trim().isEmpty() ||
            Objects.isNull(input.getDescription()) || input.getDescription().trim().isEmpty()) {
            logger.warn("{} thread is missing a title and/or a description", type);
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, String.format("%s thread is missing a title and/or a description", type));
        }
    }

    private void validateThreadComment(ThreadCommentActivityDTO input, String type) {
        if (Objects.isNull(input.getDescription()) || input.getDescription().trim().isEmpty()) {
            logger.warn("{} comment is missing a description", type);
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, String.format("%s comment is missing a description", type));
        }
    }
    /* Support Request APIs */
    @GetMapping(name="GetSupportRequests",path="/support-requests")
    public List<ThreadActivityDTO> getSupportRequests(@AuthenticationPrincipal Jwt jwt) throws AccessDeniedException {
        final String username = jwt.getClaimAsString("username");
        logger.info("Beginning to process getSupportRequests for user {}", username);
        final List<ThreadActivityDTO> supportRequests = discussionsComponent.getSupportRequests(username)
            .stream()
            .map((supportRequest) -> discussionsActivityConverter.convertThreadComponentDTOToActivityDTO(supportRequest))
            .toList();
        logger.info("Finished processing getSupportRequests. Found {} support requests", supportRequests.size());
        return supportRequests;
    }

    @GetMapping(name="GetDetailedSupportRequest",path="/support-request")
    public ThreadActivityDTO getDetailedSupportRequest(
        @AuthenticationPrincipal Jwt jwt,
        @NonNull @RequestParam Integer threadId) throws AccessDeniedException {
        final String username = jwt.getClaimAsString("username");
        final String group = jwt.getClaimAsStringList("cognito:groups").stream().filter(item -> item.equals("admin")).findFirst().orElse("user");
        logger.info("Beginning to process getDetailedSupportRequest for user {} and ID {}", username, threadId);
        final ThreadActivityDTO supportRequest = discussionsActivityConverter
            .convertThreadComponentDTOToActivityDTO(discussionsComponent.getDetailedSupportRequest(username, group, threadId));
        logger.info("Finished processing getDetailedSupportRequest");
        return supportRequest;
    }

    @PostMapping(name="CreateSupportRequest",path="/support-request")
    public ThreadActivityDTO createSupportRequest(
        @AuthenticationPrincipal Jwt jwt,
        @NonNull @RequestBody ThreadActivityDTO input) {
        final String username = jwt.getClaimAsString("username");
        logger.info("Beginning to process createSupportRequest for user {}, with input {}", username, input);
        this.validateThread(input, "Support Request");
        final ThreadComponentDTO convertedInput = discussionsActivityConverter.convertThreadActivityDTOToComponentDTO(input, username);
        final ThreadComponentDTO output = discussionsComponent.createSupportRequest(convertedInput);
        final ThreadActivityDTO supportRequest = discussionsActivityConverter.convertThreadComponentDTOToActivityDTO(output);
        logger.info("Finished processing createSupportRequest");
        return supportRequest;
    }

    @PostMapping(name="AddSupportRequestComment",path="/support-request/comment")
    public ThreadCommentActivityDTO addSupportRequestComment(
        @AuthenticationPrincipal Jwt jwt,
        @NonNull @RequestBody ThreadCommentActivityDTO input) throws AccessDeniedException {
        final String username = jwt.getClaimAsString("username");
        final String group = jwt.getClaimAsStringList("cognito:groups").stream().filter(item -> item.equals("admin")).findFirst().orElse("user");
        logger.info("Beginning to process addSupportRequestComment for user {}, with input {}", username, input);
        this.validateThreadComment(input, "Support Request");
        final ThreadCommentComponentDTO output = discussionsComponent.addSupportRequestComment(discussionsActivityConverter.convertThreadCommentActivityDTOToComponentDTO(input, username), group);
        final ThreadCommentActivityDTO supportRequestComment = discussionsActivityConverter.convertThreadCommentComponentDTOToActivityDTO(output);
        logger.info("Finished processing addSupportRequestComment");
        return supportRequestComment;
    }

    @PostMapping(name="CloseSupportRequest",path="/support-request/close")
    public ThreadCommentActivityDTO closeSupportRequest(
        @AuthenticationPrincipal Jwt jwt,
        @NonNull @RequestBody ThreadCommentActivityDTO input) {
        final String username = jwt.getClaimAsString("username");
        final String group = jwt.getClaimAsStringList("cognito:groups").stream().filter(item -> item.equals("admin")).findFirst().orElse("user");
        logger.info("Beginning to process closeSupportRequest for user {}, with input {}", username, input);
        final ThreadCommentComponentDTO output = discussionsComponent.closeSupportRequest(discussionsActivityConverter.convertThreadCommentActivityDTOToComponentDTO(input, username), group);
        final ThreadCommentActivityDTO supportRequestComment = discussionsActivityConverter.convertThreadCommentComponentDTOToActivityDTO(output);
        logger.info("Finished processing closeSupportRequest");
        return supportRequestComment;
    }

    @PostMapping(name="ReopenSupportRequest",path="/support-request/reopen")
    public ThreadCommentActivityDTO reopenSupportRequest(
        @AuthenticationPrincipal Jwt jwt,
        @NonNull @RequestBody ThreadCommentActivityDTO input) {
        final String username = jwt.getClaimAsString("username");
        final String group = jwt.getClaimAsStringList("cognito:groups").stream().filter(item -> item.equals("admin")).findFirst().orElse("user");
        logger.info("Beginning to process reopenSupportRequest for user {}, with input {}", username, input);
        final ThreadCommentComponentDTO output = discussionsComponent.reopenSupportRequest(discussionsActivityConverter.convertThreadCommentActivityDTOToComponentDTO(input, username), group);
        final ThreadCommentActivityDTO supportRequestComment = discussionsActivityConverter.convertThreadCommentComponentDTOToActivityDTO(output);
        logger.info("Finished processing reopenSupportRequest");
        return supportRequestComment;
    }
    /* "Standard" discussion thread APIs*/
    @PublicEndpoint
    @GetMapping(name="GetDiscussions",path="/discussions")
    public List<ThreadActivityDTO> getDiscussions() throws AccessDeniedException {
        logger.info("Beginning to process getDiscussions");
        final List<ThreadActivityDTO> discussions = discussionsComponent.getDiscussions()
            .stream()
            .map((discussion) -> discussionsActivityConverter.convertThreadComponentDTOToActivityDTO(discussion))
            .toList();
        logger.info("Finished processing getDiscussions. Found {} discussions", discussions.size());
        return discussions;
    }

    @PublicEndpoint
    @GetMapping(name="GetDetailedDiscussion",path="/discussion")
    public ThreadActivityDTO getDetailedDiscussion(@NonNull @RequestParam Integer threadId) throws AccessDeniedException {
        logger.info("Beginning to process getDetailedDiscussion for ID {}", threadId);
        final ThreadActivityDTO discussion = discussionsActivityConverter
            .convertThreadComponentDTOToActivityDTO(discussionsComponent.getDetailedDiscussion(threadId));
        logger.info("Finished processing getDetailedDiscussion");
        return discussion;
    }

    @PostMapping(name="CreateDiscussion",path="/discussion")
    public ThreadActivityDTO createDiscussion(
        @AuthenticationPrincipal Jwt jwt,
        @NonNull @RequestBody ThreadActivityDTO input) {
        final String username = jwt.getClaimAsString("username");
        logger.info("Beginning to process createDiscussion for user {}, with input {}", username, input);
        this.validateThread(input, "Discussion");
        final ThreadComponentDTO convertedInput = discussionsActivityConverter.convertThreadActivityDTOToComponentDTO(input, username);
        final ThreadComponentDTO output = discussionsComponent.createDiscussion(convertedInput);
        final ThreadActivityDTO discussion = discussionsActivityConverter.convertThreadComponentDTOToActivityDTO(output);
        logger.info("Finished processing createDiscussion");
        return discussion;
    }

    @PostMapping(name="AddDiscussionComment",path="/discussion/comment")
    public ThreadCommentActivityDTO addDiscussionComment(
        @AuthenticationPrincipal Jwt jwt,
        @NonNull @RequestBody ThreadCommentActivityDTO input) throws AccessDeniedException {
        final String username = jwt.getClaimAsString("username");
        logger.info("Beginning to process addDiscussionComment for user {}, with input {}", username, input);
        this.validateThreadComment(input, "Discussion");
        final ThreadCommentComponentDTO output = discussionsComponent.addDiscussionComment(discussionsActivityConverter.convertThreadCommentActivityDTOToComponentDTO(input, username));
        final ThreadCommentActivityDTO discussionComment = discussionsActivityConverter.convertThreadCommentComponentDTOToActivityDTO(output);
        logger.info("Finished processing addDiscussionComment");
        return discussionComment;
    }

    @PostMapping(name="CloseDiscussion",path="/discussion/close")
    public ThreadCommentActivityDTO closeDiscussion(
        @AuthenticationPrincipal Jwt jwt,
        @NonNull @RequestBody ThreadCommentActivityDTO input) {
        final String username = jwt.getClaimAsString("username");
        final String group = jwt.getClaimAsStringList("cognito:groups").stream().filter(item -> item.equals("admin")).findFirst().orElse("user");
        logger.info("Beginning to process closeDiscussion for user {}, with input {}", username, input);
        final ThreadCommentComponentDTO output = discussionsComponent.closeDiscussion(discussionsActivityConverter.convertThreadCommentActivityDTOToComponentDTO(input, username), group);
        final ThreadCommentActivityDTO discussionComment = discussionsActivityConverter.convertThreadCommentComponentDTOToActivityDTO(output);
        logger.info("Finished processing closeDiscussion");
        return discussionComment;
    }
    /* Bug report APIs */
    @PublicEndpoint
    @GetMapping(name="GetBugReports",path="/bug-reports")
    public List<ThreadActivityDTO> getBugReports() throws AccessDeniedException {
        logger.info("Beginning to process getBugReports");
        final List<ThreadActivityDTO> bugReports = discussionsComponent.getBugReports()
            .stream()
            .map((bugReport) -> discussionsActivityConverter.convertThreadComponentDTOToActivityDTO(bugReport))
            .toList();
        logger.info("Finished processing getBugReports. Found {} bug reports", bugReports.size());
        return bugReports;
    }

    @PublicEndpoint
    @GetMapping(name="GetDetailedBugReport",path="/bug-report")
    public ThreadActivityDTO getDetailedBugReport(@NonNull @RequestParam Integer threadId) throws AccessDeniedException {
        logger.info("Beginning to process getDetailedBugReport for ID {}", threadId);
        final ThreadActivityDTO bugReport = discussionsActivityConverter
            .convertThreadComponentDTOToActivityDTO(discussionsComponent.getDetailedBugReport(threadId));
        logger.info("Finished processing getDetailedBugReport");
        return bugReport;
    }

    @PostMapping(name="CreateBugReport",path="/bug-report")
    public ThreadActivityDTO createBugReport(
        @AuthenticationPrincipal Jwt jwt,
        @NonNull @RequestBody ThreadActivityDTO input) {
        final String username = jwt.getClaimAsString("username");
        logger.info("Beginning to process createBugReport for user {}, with input {}", username, input);
        this.validateThread(input, "Bug Report");
        final ThreadComponentDTO convertedInput = discussionsActivityConverter.convertThreadActivityDTOToComponentDTO(input, username);
        final ThreadComponentDTO output = discussionsComponent.createDiscussion(convertedInput);
        final ThreadActivityDTO bugReport = discussionsActivityConverter.convertThreadComponentDTOToActivityDTO(output);
        logger.info("Finished processing createBugReport");
        return bugReport;
    }

    @PostMapping(name="AddBugReportComment",path="/bug-report/comment")
    public ThreadCommentActivityDTO addBugReportComment(
        @AuthenticationPrincipal Jwt jwt,
        @NonNull @RequestBody ThreadCommentActivityDTO input) throws AccessDeniedException {
        final String username = jwt.getClaimAsString("username");
        logger.info("Beginning to process addBugReportComment for user {}, with input {}", username, input);
        this.validateThreadComment(input, "Bug Report");
        final ThreadCommentComponentDTO output = discussionsComponent.addBugReportComment(discussionsActivityConverter.convertThreadCommentActivityDTOToComponentDTO(input, username));
        final ThreadCommentActivityDTO bugReportComment = discussionsActivityConverter.convertThreadCommentComponentDTOToActivityDTO(output);
        logger.info("Finished processing addBugReportComment");
        return bugReportComment;
    }

    @PostMapping(name="CloseBugReport",path="/bug-report/close")
    public ThreadCommentActivityDTO closeBugReport(
        @AuthenticationPrincipal Jwt jwt,
        @NonNull @RequestBody ThreadCommentActivityDTO input) {
        final String username = jwt.getClaimAsString("username");
        final String group = jwt.getClaimAsStringList("cognito:groups").stream().filter(item -> item.equals("admin")).findFirst().orElse("user");
        logger.info("Beginning to process closeBugReport for user {}, with input {}", username, input);
        final ThreadCommentComponentDTO output = discussionsComponent.closeBugReport(discussionsActivityConverter.convertThreadCommentActivityDTOToComponentDTO(input, username));
        final ThreadCommentActivityDTO bugReportComment = discussionsActivityConverter.convertThreadCommentComponentDTOToActivityDTO(output);
        logger.info("Finished processing closeBugReport");
        return bugReportComment;
    }

    @PostMapping(name="ReopenBugReport",path="/bug-report/reopen")
    public ThreadCommentActivityDTO reopenBugReport(
        @AuthenticationPrincipal Jwt jwt,
        @NonNull @RequestBody ThreadCommentActivityDTO input) {
        final String username = jwt.getClaimAsString("username");
        final String group = jwt.getClaimAsStringList("cognito:groups").stream().filter(item -> item.equals("admin")).findFirst().orElse("user");
        logger.info("Beginning to process reopenBugReport for user {}, with input {}", username, input);
        final ThreadCommentComponentDTO output = discussionsComponent.reopenBugReport(discussionsActivityConverter.convertThreadCommentActivityDTOToComponentDTO(input, username)); 
        final ThreadCommentActivityDTO bugReportComment = discussionsActivityConverter.convertThreadCommentComponentDTOToActivityDTO(output);
        logger.info("Finished processing reopenBugReport");
        return bugReportComment;
    }
}
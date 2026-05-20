package com.gamerparadise.component;

import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import lombok.NonNull;
import java.util.List;
import java.util.Objects;
import java.sql.Timestamp;
import java.time.Instant;

import com.gamerparadise.builder.DiscussionsBuilder;
import com.gamerparadise.component.dto.ThreadComponentDTO;
import com.gamerparadise.component.dto.ThreadCommentComponentDTO;
import com.gamerparadise.shared.Constants;

@Component
public class DiscussionsComponent {
    @Autowired
    private DiscussionsBuilder discussionsBuilder;
    private static final Logger logger = LogManager.getLogger(DiscussionsComponent.class);

    public List<ThreadComponentDTO> getSupportRequests(@NonNull String username) {
        return discussionsBuilder.getSupportRequests(username);
    }

    public ThreadComponentDTO getDetailedSupportRequest(@NonNull String username, @NonNull String group, @NonNull Integer threadId) {
        final ThreadComponentDTO thread = discussionsBuilder.getDetailedSupportRequest(threadId);
        if (Objects.isNull(thread)) {
            logger.warn("Support request {} does not exist", threadId);
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, String.format("Support request at id %s does not exist", threadId));
        }
        if (group.equals("admin") ||  thread.getAuthor().equals(username)) {
            return thread;
        }
        logger.warn("User {} cannot access this support request", username);
        throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "You are not permitted to view this support request");
    }

    public ThreadComponentDTO createSupportRequest(@NonNull ThreadComponentDTO thread) {
        return discussionsBuilder.createSupportRequest(thread);
    }

    public ThreadCommentComponentDTO addSupportRequestComment(@NonNull ThreadCommentComponentDTO comment, @NonNull String group) {
        final ThreadComponentDTO thread = this.getDetailedSupportRequest(comment.getAuthor(), group, comment.getThreadId());
        return discussionsBuilder.addSupportRequestComment(comment);
    }

    public void closeSupportRequest(@NonNull ThreadCommentComponentDTO input, @NonNull String group) {
        final Integer threadId = input.getThreadId();
        final ThreadComponentDTO thread = this.getDetailedSupportRequest(input.getAuthor(), group, threadId);
        if (thread.getStatus().equals("CLOSE")) {
            logger.warn("Support request {} is already closed", threadId);
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, String.format("Support request at id %s is already closed", threadId));
        }
        if (!input.getDescription().trim().isEmpty())
            discussionsBuilder.addSupportRequestComment(input);
        discussionsBuilder.closeSupportRequest(input);
    }

    public void reopenSupportRequest(@NonNull ThreadCommentComponentDTO input, @NonNull String group) {
        final Integer threadId = input.getThreadId();
        final ThreadComponentDTO thread = this.getDetailedSupportRequest(input.getAuthor(), group, threadId);
        if (thread.getStatus().equals("OPEN")) {
            logger.warn("Support request {} is already open", threadId);
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, String.format("Support request at id %s is already open", threadId));
        }
        final Instant cutoffTime = Instant.now().minusSeconds(Constants.SECONDS_IN_WEEK);
        if (thread.getLastUpdateTime().before(Timestamp.from(cutoffTime))) {
            logger.warn("Bug Report {} has been closed for over a week and cannot be re-opened", threadId);
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, String.format("Bug Report {} has been closed for over a week and cannot be re-opened", threadId));
        }
        if (!input.getDescription().trim().isEmpty())
            discussionsBuilder.addSupportRequestComment(input);
        discussionsBuilder.reopenSupportRequest(input);
    }

    public List<ThreadComponentDTO> getDiscussions(@NonNull String username) {
        return discussionsBuilder.getDiscussions(username);
    }

    public ThreadComponentDTO getDetailedDiscussion(@NonNull Integer threadId) {
        final ThreadComponentDTO thread = discussionsBuilder.getDetailedDiscussion(threadId);
        if (Objects.isNull(thread)) {
            logger.warn("Discussion thread {} does not exist", threadId);
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, String.format("Discussion thread at id %s does not exist", threadId));
        }
        return thread;
    }

    public ThreadComponentDTO createDiscussion(@NonNull ThreadComponentDTO thread) {
        return discussionsBuilder.createDiscussion(thread);
    }

    public ThreadCommentComponentDTO addDiscussionComment(@NonNull ThreadCommentComponentDTO comment) {
        final ThreadComponentDTO thread = this.getDetailedDiscussion(comment.getThreadId());
        final Integer threadId = thread.getThreadId();
        if (thread.getStatus().equals("CLOSED")) {
            logger.warn("Discussion thread {} is closed, so no further comments can be made.", threadId);
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, String.format("Discussion thread at id %s does not exist, so no further comments can be made.", threadId));
        }
        return discussionsBuilder.addDiscussionComment(comment);
    }

    public void closeDiscussion(@NonNull ThreadCommentComponentDTO input, @NonNull String group) {
        final Integer threadId = input.getThreadId();
        final ThreadComponentDTO thread = this.getDetailedDiscussion(threadId);
        if (thread.getStatus().equals("CLOSE")) {
            logger.warn("Discussion {} is already closed", threadId);
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, String.format("Discussion at id %s is already closed", threadId));
        }
        if (!group.equals("admin")) {
            logger.warn("User {} cannot close this discussion, only administrators can close it", input.getAuthor());
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "You are not permitted to close this discussion");
        }
        if (!input.getDescription().trim().isEmpty())
            discussionsBuilder.addDiscussionComment(input);
        discussionsBuilder.closeDiscussion(input);
    }

    public List<ThreadComponentDTO> getBugReports(@NonNull String username) {
        return discussionsBuilder.getBugReports(username);
    }

    public ThreadComponentDTO getDetailedBugReport(@NonNull Integer threadId) {
        final ThreadComponentDTO thread = discussionsBuilder.getDetailedBugReport(threadId);
        if (Objects.isNull(thread)) {
            logger.warn("Bug report {} does not exist", threadId);
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, String.format("Bug report at id %s does not exist", threadId));
        }
        return thread;
    }

    public ThreadComponentDTO createBugReport(@NonNull ThreadComponentDTO thread) {
        return discussionsBuilder.createBugReport(thread);
    }

    public ThreadCommentComponentDTO addBugReportComment(@NonNull ThreadCommentComponentDTO comment) {
        final ThreadComponentDTO thread = this.getDetailedBugReport(comment.getThreadId());
        return discussionsBuilder.addBugReportComment(comment);
    }

    public void closeBugReport(@NonNull ThreadCommentComponentDTO input) {
        final Integer threadId = input.getThreadId();
        final ThreadComponentDTO thread = this.getDetailedDiscussion(threadId);
        if (thread.getStatus().equals("CLOSE")) {
            logger.warn("Bug Report {} is already closed", threadId);
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, String.format("Bug Report at id %s is already closed", threadId));
        }
        if (!input.getDescription().trim().isEmpty())
            discussionsBuilder.addBugReportComment(input);
        discussionsBuilder.closeBugReport(input);
    }

    public void reopenBugReport(@NonNull ThreadCommentComponentDTO input) {
        final Integer threadId = input.getThreadId();
        final ThreadComponentDTO thread = this.getDetailedDiscussion(threadId);
        if (thread.getStatus().equals("OPEN")) {
            logger.warn("Bug Report {} is already open", threadId);
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, String.format("Bug Report at id %s is already open", threadId));
        }
        final Instant cutoffTime = Instant.now().minusSeconds(Constants.SECONDS_IN_WEEK);
        if (thread.getLastUpdateTime().before(Timestamp.from(cutoffTime))) {
            logger.warn("Bug Report {} has been closed for over a week and cannot be re-opened", threadId);
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, String.format("Bug Report {} has been closed for over a week and cannot be re-opened", threadId));
        }
        if (!input.getDescription().trim().isEmpty())
            discussionsBuilder.addBugReportComment(input);
        discussionsBuilder.reopenBugReport(input);
    }
}
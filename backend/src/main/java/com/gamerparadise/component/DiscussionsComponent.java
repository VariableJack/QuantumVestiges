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

import com.gamerparadise.builder.DiscussionsBuilder;
import com.gamerparadise.component.dto.ThreadComponentDTO;
import com.gamerparadise.component.dto.ThreadCommentComponentDTO;

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
        return discussionsBuilder.addDiscussionComment(comment);
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
}
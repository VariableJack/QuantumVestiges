package com.gamerparadise.builder;

import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Autowired;

import lombok.NonNull;
import java.util.List;
import java.util.Objects;

import com.gamerparadise.builder.converter.DiscussionsBuilderConverter;
import com.gamerparadise.component.dto.ThreadComponentDTO;
import com.gamerparadise.component.dto.ThreadCommentComponentDTO;
import com.gamerparadise.dao.DiscussionsDAO;
import com.gamerparadise.dao.dto.ThreadDAODTO;
import com.gamerparadise.dao.dto.ThreadCommentDAODTO;

@Component
public class DiscussionsBuilder {
    @Autowired
    private DiscussionsBuilderConverter discussionsBuilderConverter;
    @Autowired
    private DiscussionsDAO discussionsDAO;
    /* Support Request builders */
    public List<ThreadComponentDTO> getSupportRequests(@NonNull String username) {
        return discussionsDAO.getSupportRequests(username)
            .stream()
            .map((supportRequest) -> discussionsBuilderConverter.convertThreadDAODTOToComponentDTO(supportRequest))
            .toList();
    }

    public ThreadComponentDTO getDetailedSupportRequest(@NonNull Integer threadId) {
        final ThreadDAODTO output = discussionsDAO.getDetailedSupportRequest(threadId);
        if (Objects.isNull(output)) {
            return null;
        }
        return discussionsBuilderConverter.convertThreadDAODTOToComponentDTO(output);
    }

    public ThreadComponentDTO createSupportRequest(@NonNull ThreadComponentDTO thread) {
        final ThreadDAODTO output = discussionsDAO.createSupportRequest(discussionsBuilderConverter.convertThreadComponentDTOToDAODTO(thread));
        if (Objects.isNull(output)) {
            return null;
        }
        return discussionsBuilderConverter.convertThreadDAODTOToComponentDTO(output);
    }

    public ThreadCommentComponentDTO addSupportRequestComment(@NonNull ThreadCommentComponentDTO comment) {
        final ThreadCommentDAODTO output = discussionsDAO.addSupportRequestComment(discussionsBuilderConverter.convertThreadCommentComponentDTOToDAODTO(comment));
        if (Objects.isNull(output)) {
            return null;
        }
        return discussionsBuilderConverter.convertThreadCommentDAODTOToComponentDTO(output);
    }
    /* "Standard" discussion builders */
    public List<ThreadComponentDTO> getDiscussions(@NonNull String username) {
        return discussionsDAO.getDiscussions(username)
            .stream()
            .map((discussion) -> discussionsBuilderConverter.convertThreadDAODTOToComponentDTO(discussion))
            .toList();
    }

    public ThreadComponentDTO getDetailedDiscussion(@NonNull Integer threadId) {
        final ThreadDAODTO output = discussionsDAO.getDetailedDiscussion(threadId);
        if (Objects.isNull(output)) {
            return null;
        }
        return discussionsBuilderConverter.convertThreadDAODTOToComponentDTO(output);
    }

    public ThreadComponentDTO createDiscussion(@NonNull ThreadComponentDTO thread) {
        final ThreadDAODTO output = discussionsDAO.createDiscussion(discussionsBuilderConverter.convertThreadComponentDTOToDAODTO(thread));
        if (Objects.isNull(output)) {
            return null;
        }
        return discussionsBuilderConverter.convertThreadDAODTOToComponentDTO(output);
    }

    public ThreadCommentComponentDTO addDiscussionComment(@NonNull ThreadCommentComponentDTO comment) {
        final ThreadCommentDAODTO output = discussionsDAO.addDiscussionComment(discussionsBuilderConverter.convertThreadCommentComponentDTOToDAODTO(comment));
        if (Objects.isNull(output)) {
            return null;
        }
        return discussionsBuilderConverter.convertThreadCommentDAODTOToComponentDTO(output);
    }
    /* Bug report builders */
    public List<ThreadComponentDTO> getBugReports(@NonNull String username) {
        return discussionsDAO.getBugReports(username)
            .stream()
            .map((bugReport) -> discussionsBuilderConverter.convertThreadDAODTOToComponentDTO(bugReport))
            .toList();
    }

    public ThreadComponentDTO getDetailedBugReport(@NonNull Integer threadId) {
        final ThreadDAODTO output = discussionsDAO.getDetailedBugReport(threadId);
        if (Objects.isNull(output)) {
            return null;
        }
        return discussionsBuilderConverter.convertThreadDAODTOToComponentDTO(output);
    }

    public ThreadComponentDTO createBugReport(@NonNull ThreadComponentDTO thread) {
        final ThreadDAODTO output = discussionsDAO.createBugReport(discussionsBuilderConverter.convertThreadComponentDTOToDAODTO(thread));
        if (Objects.isNull(output)) {
            return null;
        }
        return discussionsBuilderConverter.convertThreadDAODTOToComponentDTO(output);
    }

    public ThreadCommentComponentDTO addBugReportComment(@NonNull ThreadCommentComponentDTO comment) {
        final ThreadCommentDAODTO output = discussionsDAO.addBugReportComment(discussionsBuilderConverter.convertThreadCommentComponentDTOToDAODTO(comment));
        if (Objects.isNull(output)) {
            return null;
        }
        return discussionsBuilderConverter.convertThreadCommentDAODTOToComponentDTO(output);
    }
}

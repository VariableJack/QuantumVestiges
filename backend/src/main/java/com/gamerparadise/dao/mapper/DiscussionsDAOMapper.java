package com.gamerparadise.dao.mapper;

import org.springframework.stereotype.Component;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import lombok.NonNull;
import java.util.List;

import com.gamerparadise.dao.dto.ThreadDAODTO;
import com.gamerparadise.dao.dto.ThreadCommentDAODTO;

@Component
@Mapper
public interface DiscussionsDAOMapper {
    public List<ThreadDAODTO> getSupportRequests(@Param("username") @NonNull String username);
    public ThreadDAODTO getDetailedSupportRequest(@Param("threadId") @NonNull Integer threadId);
    public void createSupportRequest(@Param("thread") @NonNull ThreadDAODTO thread);
    public ThreadCommentDAODTO addSupportRequestComment(@Param("comment") @NonNull ThreadCommentDAODTO comment);
    public void closeSupportRequest(@Param("input") @NonNull ThreadCommentDAODTO input);
    public void reopenSupportRequest(@Param("input") @NonNull ThreadCommentDAODTO input);

    public List<ThreadDAODTO> getDiscussions();
    public ThreadDAODTO getDetailedDiscussion(@Param("threadId") @NonNull Integer threadId);
    public void createDiscussion(@Param("thread") @NonNull ThreadDAODTO thread);
    public ThreadCommentDAODTO addDiscussionComment(@Param("comment") @NonNull ThreadCommentDAODTO comment);
    public void closeDiscussion(@Param("input") @NonNull ThreadCommentDAODTO input);

    public List<ThreadDAODTO> getBugReports();
    public ThreadDAODTO getDetailedBugReport(@Param("threadId") @NonNull Integer threadId);
    public void createBugReport(@Param("thread") @NonNull ThreadDAODTO thread);
    public ThreadCommentDAODTO addBugReportComment(@Param("comment") @NonNull ThreadCommentDAODTO comment);
    public void closeBugReport(@Param("input") @NonNull ThreadCommentDAODTO input);
    public void reopenBugReport(@Param("input") @NonNull ThreadCommentDAODTO input);
}

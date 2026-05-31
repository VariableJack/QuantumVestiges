package com.gamerparadise.dao;

import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Autowired;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import lombok.NonNull;
import java.util.Date;
import java.util.List;
import java.util.Objects;

import com.gamerparadise.dao.mapper.DiscussionsDAOMapper;
import com.gamerparadise.dao.dto.ThreadDAODTO;
import com.gamerparadise.dao.dto.ThreadCommentDAODTO;
import com.gamerparadise.shared.Utility;

@Component
public class DiscussionsDAO {
    @Autowired
    private DiscussionsDAOMapper mapper;
    private static final Logger logger = LogManager.getLogger(DiscussionsDAO.class);
    /* Support Request */
    public List<ThreadDAODTO> getSupportRequests(@NonNull String username) {
        final Date startDate = new Date();
        logger.info("Fetching support requests for user {}", username);
        try {
            return mapper.getSupportRequests(username);
        } catch (Exception e) {
            throw e;
        } finally {
            logger.info("Finished running SQL query in {} ms", Utility.getElapsedTime(startDate));
        }
    }

    public ThreadDAODTO getDetailedSupportRequest(@NonNull Integer threadId) {
        final Date startDate = new Date();
        logger.info("Fetching support request for ID {}", threadId);
        try {
            return mapper.getDetailedSupportRequest(threadId);
        } catch (Exception e) {
            throw e;
        } finally {
            logger.info("Finished running SQL query in {} ms", Utility.getElapsedTime(startDate));
        }
    }

    public ThreadDAODTO createSupportRequest(@NonNull ThreadDAODTO thread) {
        final Date startDate = new Date();
        logger.info("Creating support request {}", thread);
        try {
            return mapper.createSupportRequest(thread);
        } catch (Exception e) {
            throw e;
        } finally {
            logger.info("Finished running SQL query in {} ms", Utility.getElapsedTime(startDate));
        }
    }

    public ThreadCommentDAODTO addSupportRequestComment(@NonNull ThreadCommentDAODTO comment) {
        final Date startDate = new Date();
        logger.info("Adding support request comment {}", comment);
        try {
            return mapper.addSupportRequestComment(comment);
        } catch (Exception e) {
            throw e;
        } finally {
            logger.info("Finished running SQL query in {} ms", Utility.getElapsedTime(startDate));
        }
    }

    public void closeSupportRequest(@NonNull ThreadCommentDAODTO input) {
        final Date startDate = new Date();
        logger.info("Closing support request with input {}", input);
        try {
            mapper.closeSupportRequest(input);
        } catch (Exception e) {
            throw e;
        } finally {
            logger.info("Finished running SQL query in {} ms", Utility.getElapsedTime(startDate));
        }
    }

    public void reopenSupportRequest(@NonNull ThreadCommentDAODTO input) {
        final Date startDate = new Date();
        logger.info("Reopening support request with input {}", input);
        try {
            mapper.reopenSupportRequest(input);
        } catch (Exception e) {
            throw e;
        } finally {
            logger.info("Finished running SQL query in {} ms", Utility.getElapsedTime(startDate));
        }
    }
    /* "Standard" discussions */
    public List<ThreadDAODTO> getDiscussions() {
        final Date startDate = new Date();
        logger.info("Fetching discussions");
        try {
            return mapper.getDiscussions();
        } catch (Exception e) {
            throw e;
        } finally {
            logger.info("Finished running SQL query in {} ms", Utility.getElapsedTime(startDate));
        }
    }

    public ThreadDAODTO getDetailedDiscussion(@NonNull Integer threadId) {
        final Date startDate = new Date();
        logger.info("Fetching discussion for ID {}", threadId);
        try {
            return mapper.getDetailedDiscussion(threadId);
        } catch (Exception e) {
            throw e;
        } finally {
            logger.info("Finished running SQL query in {} ms", Utility.getElapsedTime(startDate));
        }
    }

    public ThreadDAODTO createDiscussion(@NonNull ThreadDAODTO thread) {
        final Date startDate = new Date();
        logger.info("Creating discussion {}", thread);
        try {
            return mapper.createDiscussion(thread);
        } catch (Exception e) {
            throw e;
        } finally {
            logger.info("Finished running SQL query in {} ms", Utility.getElapsedTime(startDate));
        }
    }

    public ThreadCommentDAODTO addDiscussionComment(@NonNull ThreadCommentDAODTO comment) {
        final Date startDate = new Date();
        logger.info("Adding discussion comment {}", comment);
        try {
            return mapper.addDiscussionComment(comment);
        } catch (Exception e) {
            throw e;
        } finally {
            logger.info("Finished running SQL query in {} ms", Utility.getElapsedTime(startDate));
        }
    }

    public void closeDiscussion(@NonNull ThreadCommentDAODTO input) {
        final Date startDate = new Date();
        logger.info("Closing discussion with input {}", input);
        try {
            mapper.closeDiscussion(input);
        } catch (Exception e) {
            throw e;
        } finally {
            logger.info("Finished running SQL query in {} ms", Utility.getElapsedTime(startDate));
        }
    }
    /* Bug report */
    public List<ThreadDAODTO> getBugReports() {
        final Date startDate = new Date();
        logger.info("Fetching bug reports");
        try {
            return mapper.getBugReports();
        } catch (Exception e) {
            throw e;
        } finally {
            logger.info("Finished running SQL query in {} ms", Utility.getElapsedTime(startDate));
        }
    }

    public ThreadDAODTO getDetailedBugReport(@NonNull Integer threadId) {
        final Date startDate = new Date();
        logger.info("Fetching bug report for ID {}", threadId);
        try {
            return mapper.getDetailedBugReport(threadId);
        } catch (Exception e) {
            throw e;
        } finally {
            logger.info("Finished running SQL query in {} ms", Utility.getElapsedTime(startDate));
        }
    }

    public ThreadDAODTO createBugReport(@NonNull ThreadDAODTO thread) {
        final Date startDate = new Date();
        logger.info("Creating bug report {}", thread);
        try {
            return mapper.createBugReport(thread);
        } catch (Exception e) {
            throw e;
        } finally {
            logger.info("Finished running SQL query in {} ms", Utility.getElapsedTime(startDate));
        }
    }

    public ThreadCommentDAODTO addBugReportComment(@NonNull ThreadCommentDAODTO comment) {
        final Date startDate = new Date();
        logger.info("Adding bug report comment {}", comment);
        try {
            return mapper.addBugReportComment(comment);
        } catch (Exception e) {
            throw e;
        } finally {
            logger.info("Finished running SQL query in {} ms", Utility.getElapsedTime(startDate));
        }
    }

    public void closeBugReport(@NonNull ThreadCommentDAODTO input) {
        final Date startDate = new Date();
        logger.info("Closing bug report with input {}", input);
        try {
            mapper.closeBugReport(input);
        } catch (Exception e) {
            throw e;
        } finally {
            logger.info("Finished running SQL query in {} ms", Utility.getElapsedTime(startDate));
        }
    }

    public void reopenBugReport(@NonNull ThreadCommentDAODTO input) {
        final Date startDate = new Date();
        logger.info("Reopening bug report with input {}", input);
        try {
            mapper.reopenBugReport(input);
        } catch (Exception e) {
            throw e;
        } finally {
            logger.info("Finished running SQL query in {} ms", Utility.getElapsedTime(startDate));
        }
    }
}
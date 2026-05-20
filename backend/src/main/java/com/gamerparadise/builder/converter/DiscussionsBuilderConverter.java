package com.gamerparadise.builder.converter;
import org.springframework.stereotype.Component;

import lombok.NonNull;

import com.gamerparadise.component.dto.ThreadComponentDTO;
import com.gamerparadise.component.dto.ThreadCommentComponentDTO;
import com.gamerparadise.dao.dto.ThreadDAODTO;
import com.gamerparadise.dao.dto.ThreadCommentDAODTO;

@Component
public class DiscussionsBuilderConverter {
    public ThreadDAODTO convertThreadComponentDTOToDAODTO(@NonNull ThreadComponentDTO input) {
        return ThreadDAODTO.builder()
            .title(input.getTitle())
            .description(input.getDescription())
            .author(input.getAuthor())
            .build();
    }

    public ThreadComponentDTO convertThreadDAODTOToComponentDTO(@NonNull ThreadDAODTO input) {
        return ThreadComponentDTO.builder()
            .threadId(input.getThreadId())
            .title(input.getTitle())
            .description(input.getDescription())
            .author(input.getAuthor())
            .createTime(input.getCreateTime())
            .comments(input
                .getComments()
                .stream()
                .map((comment) -> this.convertThreadCommentDAODTOToComponentDTO(comment))
                .toList())
            .status(input.getStatus())
            .build();
    }

    public ThreadCommentComponentDTO convertThreadCommentDAODTOToComponentDTO(@NonNull ThreadCommentDAODTO input) {
        return ThreadCommentComponentDTO.builder()
            .commentId(input.getCommentId())
            .threadId(input.getThreadId())
            .description(input.getDescription())
            .author(input.getAuthor())
            .createTime(input.getCreateTime())
            .build();
    }

    public ThreadCommentDAODTO convertThreadCommentComponentDTOToDAODTO(@NonNull ThreadCommentComponentDTO input) {
        return ThreadCommentDAODTO.builder()
            .threadId(input.getThreadId())
            .description(input.getDescription())
            .author(input.getAuthor())
            .build();
    }
}
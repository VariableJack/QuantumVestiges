package com.gamerparadise.activity.converter;
import org.springframework.stereotype.Component;

import lombok.NonNull;

import com.gamerparadise.activity.dto.ThreadActivityDTO;
import com.gamerparadise.activity.dto.ThreadCommentActivityDTO;
import com.gamerparadise.component.dto.ThreadComponentDTO;
import com.gamerparadise.component.dto.ThreadCommentComponentDTO;

@Component
public class DiscussionsActivityConverter {
    public ThreadComponentDTO convertThreadActivityDTOToComponentDTO(@NonNull ThreadActivityDTO input, @NonNull String username) {
        return ThreadComponentDTO.builder()
            .title(input.getTitle())
            .description(input.getDescription())
            .author(username)
            .build();
    }

    public ThreadActivityDTO convertThreadComponentDTOToActivityDTO(@NonNull ThreadComponentDTO input) {
        return ThreadActivityDTO.builder()
            .threadId(input.getThreadId())
            .title(input.getTitle())
            .description(input.getDescription())
            .author(input.getAuthor())
            .createTime(input.getCreateTime())
            .comments(input
                .getComments()
                .stream()
                .map((comment) -> this.convertThreadCommentComponentDTOToActivityDTO(comment))
                .toList())
            .status(input.getStatus())
            .build();
    }

    public ThreadCommentActivityDTO convertThreadCommentComponentDTOToActivityDTO(@NonNull ThreadCommentComponentDTO input) {
        return ThreadCommentActivityDTO.builder()
            .commentId(input.getCommentId())
            .threadId(input.getThreadId())
            .description(input.getDescription())
            .author(input.getAuthor())
            .createTime(input.getCreateTime())
            .build();
    }

    public ThreadCommentComponentDTO convertThreadCommentActivityDTOToComponentDTO(@NonNull ThreadCommentActivityDTO input, @NonNull String username) {
        return ThreadCommentComponentDTO.builder()
            .threadId(input.getThreadId())
            .description(input.getDescription())
            .author(input.getAuthor())
            .build();
    }
}
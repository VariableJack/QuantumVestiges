package com.gamerparadise.component.dto;

import java.sql.Timestamp;
import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class ThreadCommentComponentDTO {
    private Integer commentId;
    private Integer threadId;
    private String description;
    private String author;
    private Timestamp createTime;
}

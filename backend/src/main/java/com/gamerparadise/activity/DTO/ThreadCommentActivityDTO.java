package com.gamerparadise.activity.dto;

import java.util.List;
import java.sql.Timestamp;
import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class ThreadCommentActivityDTO {
    private Integer commentId;
    private Integer threadId;
    private String description;
    private String author;
    private Timestamp createTime;
}

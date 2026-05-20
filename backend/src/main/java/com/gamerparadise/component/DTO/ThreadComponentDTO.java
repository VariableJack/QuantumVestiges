package com.gamerparadise.component.dto;

import java.util.List;
import java.sql.Timestamp;
import lombok.Builder;
import lombok.Data;

import com.gamerparadise.component.dto.ThreadCommentComponentDTO;

@Builder
@Data
public class ThreadComponentDTO {
    private Integer threadId;
    private String title;
    private String description;
    private String author;
    private Timestamp createTime;
    private String status;
    private List<ThreadCommentComponentDTO> comments;
}

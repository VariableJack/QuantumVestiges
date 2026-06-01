package com.gamerparadise.activity.dto;

import java.util.List;
import java.sql.Timestamp;
import lombok.Builder;
import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import com.gamerparadise.activity.dto.ThreadCommentActivityDTO;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class ThreadActivityDTO {
    private Integer threadId;
    private String title;
    private String description;
    private String author;
    private Timestamp createTime;
    private Timestamp lastUpdateTime;
    private String lastUpdateBy;
    private String status;
    private List<ThreadCommentActivityDTO> comments;
}

package com.gamerparadise.dao.dto;

import java.util.List;
import java.sql.Timestamp;
import lombok.Builder;
import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import com.gamerparadise.dao.dto.ThreadCommentDAODTO;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ThreadDAODTO {
    private Integer threadId;
    private String title;
    private String description;
    private String author;
    private Timestamp createTime;
    private Timestamp lastUpdateTime;
    private String lastUpdateBy;
    private String status;
    private List<ThreadCommentDAODTO> comments;
}

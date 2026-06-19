package com.interviewprep.dto.response;

import com.interviewprep.enums.Difficulty;
import com.interviewprep.enums.Domain;
import com.interviewprep.enums.InterviewStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InterviewResponse {
    private Long id;
    private String title;
    private Domain domain;
    private Difficulty difficulty;
    private InterviewStatus status;
    private Integer totalScore;
    private Integer maxScore;
    private LocalDateTime startedAt;
    private LocalDateTime completedAt;
}

package com.interviewprep.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProgressResponse {
    private Long id;
    private LocalDate reportDate;
    private Integer interviewsCompleted;
    private Double avgScore;
    private List<String> skillsImproved;
    private String weeklySummary;
}

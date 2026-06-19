package com.interviewprep.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InterviewReportResponse {
    private Long interviewId;
    private Integer overallScore;
    private String strengths;
    private String weaknesses;
    private String recommendations;
    private String detailedReport;
    private List<InterviewQuestionResponse> questions;
}

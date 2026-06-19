package com.interviewprep.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InterviewQuestionResponse {
    private Long id;
    private String question;
    private String expectedAnswer;
    private String userAnswer;
    private Integer score;
    private String feedback;
    private Integer questionOrder;
}

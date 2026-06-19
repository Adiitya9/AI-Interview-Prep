package com.interviewprep.dto.response;

import com.interviewprep.enums.Difficulty;
import com.interviewprep.enums.Domain;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QuestionResponse {
    private Long id;
    private String question;
    private Domain domain;
    private Difficulty difficulty;
    private String expectedAnswer;
}

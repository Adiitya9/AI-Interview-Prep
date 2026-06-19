package com.interviewprep.dto.request;

import com.interviewprep.enums.Difficulty;
import com.interviewprep.enums.Domain;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QuestionGenerateRequest {

    @NotNull(message = "Domain is required")
    private Domain domain;

    @NotNull(message = "Difficulty is required")
    private Difficulty difficulty;

    @Min(value = 1, message = "Count must be at least 1")
    @Max(value = 50, message = "Count must be at most 50")
    @Builder.Default
    private int count = 20;
}

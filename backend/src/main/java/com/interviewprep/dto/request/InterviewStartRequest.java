package com.interviewprep.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InterviewStartRequest {
    @NotBlank(message = "Domain is required")
    private String domain;

    @NotBlank(message = "Difficulty is required")
    private String difficulty;
}

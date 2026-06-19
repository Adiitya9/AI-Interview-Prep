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
public class JobDescriptionRequest {
    @NotBlank(message = "Title is required")
    private String title;

    private String company;

    @NotBlank(message = "Description is required")
    private String description;
}

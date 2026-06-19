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
public class ResumeAnalysisResponse {
    private Long resumeId;
    private String fileName;
    private List<String> skills;
    private List<String> missingSkills;
    private Integer atsScore;
    private String feedback;
    private String suggestions;
}

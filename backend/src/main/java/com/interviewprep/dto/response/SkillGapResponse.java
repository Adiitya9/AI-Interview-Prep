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
public class SkillGapResponse {
    private Long id;
    private List<String> resumeSkills;
    private List<String> jdSkills;
    private Integer matchPercentage;
    private List<String> missingSkills;
    private List<String> strongAreas;
    private List<String> weakAreas;
    private List<RoadmapItem> learningRoadmap;
}

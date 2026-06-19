package com.interviewprep.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RoadmapItem {
    private Integer week;
    private String topic;
    private String description;
    private String resourceLinks;
}

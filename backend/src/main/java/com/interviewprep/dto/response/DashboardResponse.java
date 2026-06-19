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
public class DashboardResponse {
    private Integer totalInterviews;
    private Double averageScore;
    private Integer upcomingInterviews;
    private List<ActivityItem> recentActivities;
}

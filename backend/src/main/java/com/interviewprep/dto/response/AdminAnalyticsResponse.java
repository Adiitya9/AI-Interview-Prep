package com.interviewprep.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminAnalyticsResponse {
    private Long totalUsers;
    private Long totalInterviews;
    private Long activeUsersThisWeek;
    private Double platformAverageScore;
}

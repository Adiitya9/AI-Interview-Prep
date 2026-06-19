package com.interviewprep.service.impl;

import com.interviewprep.dto.response.ActivityItem;
import com.interviewprep.dto.response.DashboardResponse;
import com.interviewprep.entity.Interview;
import com.interviewprep.enums.InterviewStatus;
import com.interviewprep.repository.InterviewRepository;
import com.interviewprep.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final InterviewRepository interviewRepository;

    @Override
    @Transactional(readOnly = true)
    public DashboardResponse getUserDashboard(Long userId) {
        List<Interview> interviews = interviewRepository.findByUserIdOrderByStartedAtDesc(userId);
        
        long completedInterviewsCount = interviews.stream()
                .filter(i -> i.getStatus() == InterviewStatus.COMPLETED)
                .count();

        double avgScore = interviews.stream()
                .filter(i -> i.getStatus() == InterviewStatus.COMPLETED && i.getMaxScore() != null && i.getMaxScore() > 0)
                .mapToDouble(i -> (i.getTotalScore() * 100.0) / i.getMaxScore())
                .average()
                .orElse(0.0);
        
        // Count in-progress interviews as upcoming/active for now
        long upcomingInterviewsCount = interviews.stream()
                .filter(i -> i.getStatus() == InterviewStatus.IN_PROGRESS)
                .count();
        
        List<ActivityItem> activities = interviews.stream()
                .limit(5)
                .map(inter -> ActivityItem.builder()
                        .type("INTERVIEW")
                        .description((inter.getStatus() == InterviewStatus.COMPLETED ? "Completed " : "Started ") + inter.getDomain() + " interview")
                        .date(inter.getCompletedAt() != null ? inter.getCompletedAt() : inter.getStartedAt())
                        .build())
                .collect(Collectors.toList());

        return DashboardResponse.builder()
                .totalInterviews((int) completedInterviewsCount)
                .averageScore(Math.round(avgScore * 100.0) / 100.0)
                .upcomingInterviews((int) upcomingInterviewsCount)
                .recentActivities(activities)
                .build();
    }
}

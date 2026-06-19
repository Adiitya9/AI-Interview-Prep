package com.interviewprep.service.impl;

import com.interviewprep.dto.response.AdminAnalyticsResponse;
import com.interviewprep.entity.Interview;
import com.interviewprep.enums.InterviewStatus;
import com.interviewprep.repository.InterviewRepository;
import com.interviewprep.repository.UserRepository;
import com.interviewprep.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {

    private final UserRepository userRepository;
    private final InterviewRepository interviewRepository;

    @Override
    @Transactional(readOnly = true)
    public AdminAnalyticsResponse getPlatformAnalytics() {
        long totalUsers = userRepository.count();
        long totalInterviews = interviewRepository.count();
        
        LocalDateTime oneWeekAgo = LocalDateTime.now().minusWeeks(1);
        
        // Let's count active users by checking how many unique users took an interview in the last week
        // Since we don't have a complex query ready, we'll just pull recent interviews.
        // For production, this should be a custom JPA query.
        List<Interview> allInterviews = interviewRepository.findAll();
        
        long activeUsersThisWeek = allInterviews.stream()
                .filter(i -> i.getStartedAt() != null && i.getStartedAt().isAfter(oneWeekAgo))
                .map(i -> i.getUser().getId())
                .distinct()
                .count();

        double platformAverageScore = allInterviews.stream()
                .filter(i -> i.getStatus() == InterviewStatus.COMPLETED && i.getMaxScore() != null && i.getMaxScore() > 0)
                .mapToDouble(i -> (i.getTotalScore() * 100.0) / i.getMaxScore())
                .average()
                .orElse(0.0);
        
        return AdminAnalyticsResponse.builder()
                .totalUsers(totalUsers)
                .totalInterviews(totalInterviews)
                .activeUsersThisWeek(activeUsersThisWeek)
                .platformAverageScore(Math.round(platformAverageScore * 100.0) / 100.0)
                .build();
    }
}

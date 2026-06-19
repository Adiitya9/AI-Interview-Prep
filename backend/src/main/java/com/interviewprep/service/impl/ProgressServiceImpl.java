package com.interviewprep.service.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.interviewprep.dto.response.ProgressResponse;
import com.interviewprep.entity.Interview;
import com.interviewprep.entity.ProgressReport;
import com.interviewprep.entity.User;
import com.interviewprep.enums.InterviewStatus;
import com.interviewprep.exception.ResourceNotFoundException;
import com.interviewprep.repository.InterviewRepository;
import com.interviewprep.repository.ProgressReportRepository;
import com.interviewprep.repository.UserRepository;
import com.interviewprep.service.ProgressService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProgressServiceImpl implements ProgressService {

    private final ProgressReportRepository progressRepository;
    private final InterviewRepository interviewRepository;
    private final UserRepository userRepository;
    private final ObjectMapper objectMapper;

    @Override
    @Transactional
    public ProgressResponse generateProgressReport(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        List<Interview> allInterviews = interviewRepository.findByUserIdOrderByStartedAtDesc(userId);
        
        List<Interview> completedInterviews = allInterviews.stream()
                .filter(i -> i.getStatus() == InterviewStatus.COMPLETED)
                .collect(Collectors.toList());

        int interviewsCompleted = completedInterviews.size();

        double avgScore = completedInterviews.stream()
                .filter(i -> i.getMaxScore() != null && i.getMaxScore() > 0)
                .mapToDouble(i -> (i.getTotalScore() * 100.0) / i.getMaxScore())
                .average()
                .orElse(0.0);

        String summary = "You have completed " + interviewsCompleted + " interviews so far with an average score of " + String.format("%.2f", avgScore) + "%. Keep practicing to improve further!";
        
        // Normally we'd use AI to generate skillsImproved based on Interview results. 
        // Here we just provide a placeholder realistic list if there are completed interviews.
        List<String> improvedSkills = new ArrayList<>();
        if (interviewsCompleted > 0) {
            improvedSkills.add(completedInterviews.get(0).getDomain().name() + " Basics");
            improvedSkills.add("Problem Solving");
        }
        
        String skillsImprovedJson = "[]";
        try {
            skillsImprovedJson = objectMapper.writeValueAsString(improvedSkills);
        } catch (Exception ignored) {}

        ProgressReport report = ProgressReport.builder()
                .user(user)
                .reportDate(LocalDate.now())
                .interviewsCompleted(interviewsCompleted)
                .avgScore(Math.round(avgScore * 100.0) / 100.0)
                .skillsImprovedJson(skillsImprovedJson)
                .weeklySummary(summary)
                .build();
        
        progressRepository.save(report);

        return mapToResponse(report);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProgressResponse> getUserProgressReports(Long userId) {
        return progressRepository.findByUserIdOrderByReportDateDesc(userId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private ProgressResponse mapToResponse(ProgressReport report) {
        List<String> skills = new ArrayList<>();
        try {
            if (report.getSkillsImprovedJson() != null) {
                objectMapper.readTree(report.getSkillsImprovedJson()).forEach(node -> skills.add(node.asText()));
            }
        } catch (Exception ignored) {}

        return ProgressResponse.builder()
                .id(report.getId())
                .reportDate(report.getReportDate())
                .interviewsCompleted(report.getInterviewsCompleted())
                .avgScore(report.getAvgScore())
                .skillsImproved(skills)
                .weeklySummary(report.getWeeklySummary())
                .build();
    }
}

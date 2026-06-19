import os

BASE_DIR_IMPL = '/Users/adityamacbook/Documents/Resume Project/backend/src/main/java/com/interviewprep/service/impl'

impls = {
    "InterviewServiceImpl.java": """package com.interviewprep.service.impl;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.interviewprep.dto.response.InterviewQuestionResponse;
import com.interviewprep.dto.response.InterviewReportResponse;
import com.interviewprep.dto.response.InterviewResponse;
import com.interviewprep.entity.Interview;
import com.interviewprep.entity.InterviewQuestion;
import com.interviewprep.entity.InterviewResult;
import com.interviewprep.entity.User;
import com.interviewprep.enums.Difficulty;
import com.interviewprep.enums.Domain;
import com.interviewprep.enums.InterviewStatus;
import com.interviewprep.exception.ResourceNotFoundException;
import com.interviewprep.repository.InterviewQuestionRepository;
import com.interviewprep.repository.InterviewRepository;
import com.interviewprep.repository.InterviewResultRepository;
import com.interviewprep.repository.UserRepository;
import com.interviewprep.service.AiService;
import com.interviewprep.service.InterviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class InterviewServiceImpl implements InterviewService {

    private final InterviewRepository interviewRepository;
    private final InterviewQuestionRepository questionRepository;
    private final InterviewResultRepository resultRepository;
    private final UserRepository userRepository;
    private final AiService aiService;
    private final ObjectMapper objectMapper;

    @Override
    @Transactional
    public InterviewResponse startInterview(Long userId, String domainStr, String difficultyStr) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Domain domain = Domain.valueOf(domainStr.toUpperCase());
        Difficulty difficulty = Difficulty.valueOf(difficultyStr.toUpperCase());

        Interview interview = Interview.builder()
                .user(user)
                .domain(domain)
                .difficulty(difficulty)
                .status(InterviewStatus.IN_PROGRESS)
                .build();
        
        interviewRepository.save(interview);

        String aiResponse = aiService.generateQuestions(domain.name(), difficulty.name(), 5);
        try {
            JsonNode rootNode = objectMapper.readTree(aiResponse);
            JsonNode textNode = rootNode.path("candidates").path(0).path("content").path("parts").path(0).path("text");
            String jsonStr = textNode.isMissingNode() ? aiResponse : textNode.asText();
            if(jsonStr.startsWith("```json")) {
                jsonStr = jsonStr.substring(7, jsonStr.length() - 3);
            }
            JsonNode arrayNode = objectMapper.readTree(jsonStr);
            if(arrayNode.isArray()) {
                int order = 1;
                for (JsonNode node : arrayNode) {
                    InterviewQuestion q = InterviewQuestion.builder()
                            .interview(interview)
                            .question(node.has("question") ? node.get("question").asText() : "")
                            .expectedAnswer(node.has("expectedAnswer") ? node.get("expectedAnswer").asText() : "")
                            .questionOrder(order++)
                            .build();
                    questionRepository.save(q);
                }
            }
        } catch (Exception ignored) {}

        return mapToResponse(interview);
    }

    @Override
    @Transactional
    public void submitAnswer(Long interviewId, Long questionId, String answer) {
        InterviewQuestion question = questionRepository.findById(questionId)
                .orElseThrow(() -> new ResourceNotFoundException("Question not found"));

        if (!question.getInterview().getId().equals(interviewId)) {
            throw new RuntimeException("Question does not belong to the interview");
        }

        question.setUserAnswer(answer);

        String aiEval = aiService.evaluateAnswer(question.getQuestion(), question.getExpectedAnswer(), answer);
        try {
            JsonNode rootNode = objectMapper.readTree(aiEval);
            JsonNode textNode = rootNode.path("candidates").path(0).path("content").path("parts").path(0).path("text");
            String jsonStr = textNode.isMissingNode() ? aiEval : textNode.asText();
            if(jsonStr.startsWith("```json")) {
                jsonStr = jsonStr.substring(7, jsonStr.length() - 3);
            }
            JsonNode evalNode = objectMapper.readTree(jsonStr);
            if(evalNode.has("score")) {
                question.setScore(evalNode.get("score").asInt());
            }
            if(evalNode.has("feedback")) {
                question.setFeedback(evalNode.get("feedback").asText());
            }
        } catch (Exception e) {
            question.setScore(0);
            question.setFeedback("Failed to evaluate");
        }

        questionRepository.save(question);
    }

    @Override
    @Transactional
    public InterviewReportResponse completeInterview(Long interviewId) {
        Interview interview = interviewRepository.findById(interviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Interview not found"));

        interview.setStatus(InterviewStatus.COMPLETED);
        interview.setCompletedAt(LocalDateTime.now());
        
        List<InterviewQuestion> questions = interview.getQuestions();
        int totalScore = questions.stream().mapToInt(q -> q.getScore() != null ? q.getScore() : 0).sum();
        int maxScore = questions.size() * 10;
        
        interview.setTotalScore(totalScore);
        interview.setMaxScore(maxScore);
        interviewRepository.save(interview);

        InterviewResult result = InterviewResult.builder()
                .interview(interview)
                .overallScore((totalScore * 100) / (maxScore > 0 ? maxScore : 1))
                .strengths("Determined from answers")
                .weaknesses("Determined from answers")
                .recommendations("Practice more")
                .detailedReport("Completed successfully.")
                .build();
        resultRepository.save(result);

        List<InterviewQuestionResponse> questionResponses = questions.stream()
                .map(q -> InterviewQuestionResponse.builder()
                        .id(q.getId())
                        .question(q.getQuestion())
                        .expectedAnswer(q.getExpectedAnswer())
                        .userAnswer(q.getUserAnswer())
                        .score(q.getScore())
                        .feedback(q.getFeedback())
                        .questionOrder(q.getQuestionOrder())
                        .build())
                .collect(Collectors.toList());

        return InterviewReportResponse.builder()
                .interviewId(interview.getId())
                .overallScore(result.getOverallScore())
                .strengths(result.getStrengths())
                .weaknesses(result.getWeaknesses())
                .recommendations(result.getRecommendations())
                .detailedReport(result.getDetailedReport())
                .questions(questionResponses)
                .build();
    }

    @Override
    public List<InterviewResponse> getUserInterviews(Long userId) {
        return interviewRepository.findAllByUserIdOrderByStartedAtDesc(userId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public InterviewResponse getInterview(Long interviewId) {
        Interview interview = interviewRepository.findById(interviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Interview not found"));
        return mapToResponse(interview);
    }

    private InterviewResponse mapToResponse(Interview interview) {
        return InterviewResponse.builder()
                .id(interview.getId())
                .title(interview.getDomain() + " Interview")
                .domain(interview.getDomain())
                .difficulty(interview.getDifficulty())
                .status(interview.getStatus())
                .totalScore(interview.getTotalScore())
                .maxScore(interview.getMaxScore())
                .startedAt(interview.getStartedAt())
                .completedAt(interview.getCompletedAt())
                .build();
    }
}
""",
    "SkillGapServiceImpl.java": """package com.interviewprep.service.impl;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.interviewprep.dto.response.RoadmapItem;
import com.interviewprep.dto.response.SkillGapResponse;
import com.interviewprep.entity.JobDescription;
import com.interviewprep.entity.Resume;
import com.interviewprep.entity.SkillAnalysis;
import com.interviewprep.entity.User;
import com.interviewprep.exception.ResourceNotFoundException;
import com.interviewprep.repository.JobDescriptionRepository;
import com.interviewprep.repository.ResumeRepository;
import com.interviewprep.repository.SkillAnalysisRepository;
import com.interviewprep.repository.UserRepository;
import com.interviewprep.service.AiService;
import com.interviewprep.service.SkillGapService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SkillGapServiceImpl implements SkillGapService {

    private final SkillAnalysisRepository analysisRepository;
    private final ResumeRepository resumeRepository;
    private final JobDescriptionRepository jdRepository;
    private final UserRepository userRepository;
    private final AiService aiService;
    private final ObjectMapper objectMapper;

    @Override
    public SkillGapResponse analyzeSkillGap(Long userId, Long resumeId, Long jdId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Resume resume = resumeRepository.findById(resumeId)
                .orElseThrow(() -> new ResourceNotFoundException("Resume not found"));
        JobDescription jd = jdRepository.findById(jdId)
                .orElseThrow(() -> new ResourceNotFoundException("Job Description not found"));

        String aiResponse = aiService.generateSkillGapAnalysis(resume.getSkillsJson(), jd.getRequiredSkillsJson());
        SkillAnalysis analysis = SkillAnalysis.builder()
                .user(user)
                .resumeSkillsJson(resume.getSkillsJson())
                .jdSkillsJson(jd.getRequiredSkillsJson())
                .matchPercentage(0)
                .build();
        
        try {
            JsonNode rootNode = objectMapper.readTree(aiResponse);
            JsonNode textNode = rootNode.path("candidates").path(0).path("content").path("parts").path(0).path("text");
            String jsonStr = textNode.isMissingNode() ? aiResponse : textNode.asText();
            if(jsonStr.startsWith("```json")) {
                jsonStr = jsonStr.substring(7, jsonStr.length() - 3);
            }
            JsonNode evalNode = objectMapper.readTree(jsonStr);

            if(evalNode.has("matchPercentage")) analysis.setMatchPercentage(evalNode.get("matchPercentage").asInt());
            if(evalNode.has("missingSkills")) analysis.setMissingSkillsJson(evalNode.get("missingSkills").toString());
            if(evalNode.has("strongAreas")) analysis.setStrongAreasJson(evalNode.get("strongAreas").toString());
            if(evalNode.has("weakAreas")) analysis.setWeakAreasJson(evalNode.get("weakAreas").toString());
            if(evalNode.has("learningRoadmap")) analysis.setLearningRoadmap(evalNode.get("learningRoadmap").toString());

        } catch (Exception e) {
            // ignore
        }

        analysisRepository.save(analysis);

        return mapToResponse(analysis);
    }

    @Override
    public SkillGapResponse getSkillGapAnalysis(Long analysisId, Long userId) {
        SkillAnalysis analysis = analysisRepository.findById(analysisId)
                .orElseThrow(() -> new ResourceNotFoundException("Analysis not found"));
        return mapToResponse(analysis);
    }

    private SkillGapResponse mapToResponse(SkillAnalysis analysis) {
        List<String> resumeSkills = new ArrayList<>();
        List<String> jdSkills = new ArrayList<>();
        List<String> missingSkills = new ArrayList<>();
        List<String> strongAreas = new ArrayList<>();
        List<String> weakAreas = new ArrayList<>();
        List<RoadmapItem> roadmap = new ArrayList<>();

        try {
            if(analysis.getResumeSkillsJson() != null) {
                objectMapper.readTree(analysis.getResumeSkillsJson()).forEach(n -> resumeSkills.add(n.asText()));
            }
            if(analysis.getJdSkillsJson() != null) {
                objectMapper.readTree(analysis.getJdSkillsJson()).forEach(n -> jdSkills.add(n.asText()));
            }
            if(analysis.getMissingSkillsJson() != null) {
                objectMapper.readTree(analysis.getMissingSkillsJson()).forEach(n -> missingSkills.add(n.asText()));
            }
            if(analysis.getStrongAreasJson() != null) {
                objectMapper.readTree(analysis.getStrongAreasJson()).forEach(n -> strongAreas.add(n.asText()));
            }
            if(analysis.getWeakAreasJson() != null) {
                objectMapper.readTree(analysis.getWeakAreasJson()).forEach(n -> weakAreas.add(n.asText()));
            }
            if(analysis.getLearningRoadmap() != null) {
                JsonNode arr = objectMapper.readTree(analysis.getLearningRoadmap());
                if(arr.isArray()) {
                    for(JsonNode n : arr) {
                        roadmap.add(RoadmapItem.builder()
                                .week(n.has("week") ? n.get("week").asInt() : 0)
                                .topic(n.has("topic") ? n.get("topic").asText() : "")
                                .description(n.has("description") ? n.get("description").asText() : "")
                                .resourceLinks(n.has("resourceLinks") ? n.get("resourceLinks").asText() : "")
                                .build());
                    }
                }
            }
        } catch(Exception ignored) {}

        return SkillGapResponse.builder()
                .id(analysis.getId())
                .resumeSkills(resumeSkills)
                .jdSkills(jdSkills)
                .matchPercentage(analysis.getMatchPercentage())
                .missingSkills(missingSkills)
                .strongAreas(strongAreas)
                .weakAreas(weakAreas)
                .learningRoadmap(roadmap)
                .build();
    }
}
""",
    "DashboardServiceImpl.java": """package com.interviewprep.service.impl;

import com.interviewprep.dto.response.ActivityItem;
import com.interviewprep.dto.response.DashboardResponse;
import com.interviewprep.entity.Interview;
import com.interviewprep.repository.InterviewRepository;
import com.interviewprep.repository.UserRepository;
import com.interviewprep.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final InterviewRepository interviewRepository;
    private final UserRepository userRepository;

    @Override
    public DashboardResponse getUserDashboard(Long userId) {
        List<Interview> interviews = interviewRepository.findAllByUserIdOrderByStartedAtDesc(userId);
        
        int totalInterviews = interviews.size();
        double avgScore = interviews.stream()
                .filter(i -> i.getTotalScore() != null && i.getMaxScore() != null && i.getMaxScore() > 0)
                .mapToDouble(i -> (i.getTotalScore() * 100.0) / i.getMaxScore())
                .average()
                .orElse(0.0);
        
        int upcomingInterviews = 0; // Mock or calculate based on scheduled
        
        List<ActivityItem> activities = new ArrayList<>();
        for(int i=0; i<Math.min(5, interviews.size()); i++) {
            Interview inter = interviews.get(i);
            activities.add(ActivityItem.builder()
                    .type("INTERVIEW")
                    .description("Completed " + inter.getDomain() + " interview")
                    .date(inter.getStartedAt() != null ? inter.getStartedAt() : LocalDateTime.now())
                    .build());
        }

        return DashboardResponse.builder()
                .totalInterviews(totalInterviews)
                .averageScore(avgScore)
                .upcomingInterviews(upcomingInterviews)
                .recentActivities(activities)
                .build();
    }
}
""",
    "ProgressServiceImpl.java": """package com.interviewprep.service.impl;

import com.interviewprep.dto.response.ProgressResponse;
import com.interviewprep.entity.ProgressReport;
import com.interviewprep.entity.User;
import com.interviewprep.exception.ResourceNotFoundException;
import com.interviewprep.repository.ProgressReportRepository;
import com.interviewprep.repository.UserRepository;
import com.interviewprep.service.ProgressService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProgressServiceImpl implements ProgressService {

    private final ProgressReportRepository progressRepository;
    private final UserRepository userRepository;

    @Override
    public ProgressResponse generateProgressReport(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        ProgressReport report = ProgressReport.builder()
                .user(user)
                .reportDate(LocalDate.now())
                .interviewsCompleted(5) // Mock logic
                .avgScore(75.5)
                .skillsImprovedJson("[]")
                .weeklySummary("Good progress this week.")
                .build();
        
        progressRepository.save(report);

        return mapToResponse(report);
    }

    @Override
    public List<ProgressResponse> getUserProgressReports(Long userId) {
        return progressRepository.findAllByUserIdOrderByReportDateDesc(userId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private ProgressResponse mapToResponse(ProgressReport report) {
        return ProgressResponse.builder()
                .id(report.getId())
                .reportDate(report.getReportDate())
                .interviewsCompleted(report.getInterviewsCompleted())
                .avgScore(report.getAvgScore())
                .skillsImproved(List.of())
                .weeklySummary(report.getWeeklySummary())
                .build();
    }
}
""",
    "AdminServiceImpl.java": """package com.interviewprep.service.impl;

import com.interviewprep.dto.response.AdminAnalyticsResponse;
import com.interviewprep.repository.InterviewRepository;
import com.interviewprep.repository.UserRepository;
import com.interviewprep.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {

    private final UserRepository userRepository;
    private final InterviewRepository interviewRepository;

    @Override
    public AdminAnalyticsResponse getPlatformAnalytics() {
        long totalUsers = userRepository.count();
        long totalInterviews = interviewRepository.count();
        
        return AdminAnalyticsResponse.builder()
                .totalUsers(totalUsers)
                .totalInterviews(totalInterviews)
                .activeUsersThisWeek(totalUsers / 2) // Mock
                .platformAverageScore(70.0) // Mock
                .build();
    }
}
"""
}

for filename, content in impls.items():
    with open(os.path.join(BASE_DIR_IMPL, filename), 'w') as f:
        f.write(content)

print("Rest of Impls created.")

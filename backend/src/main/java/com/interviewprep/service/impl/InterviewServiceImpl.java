package com.interviewprep.service.impl;

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
            jsonStr = jsonStr.trim();
            if(jsonStr.startsWith("```json")) {
                jsonStr = jsonStr.substring(7);
            }
            if(jsonStr.endsWith("```")) {
                jsonStr = jsonStr.substring(0, jsonStr.length() - 3);
            }
            jsonStr = jsonStr.trim();
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
    @Transactional(readOnly = true)
    public InterviewQuestionResponse getNextQuestion(Long interviewId) {
        Interview interview = interviewRepository.findById(interviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Interview not found"));
                
        List<InterviewQuestion> questions = interview.getQuestions();
        InterviewQuestion nextQ = questions.stream()
                .filter(q -> q.getUserAnswer() == null || q.getUserAnswer().trim().isEmpty())
                .min((q1, q2) -> Integer.compare(q1.getQuestionOrder(), q2.getQuestionOrder()))
                .orElse(null);
                
        if (nextQ == null) {
            return null;
        }
        
        return InterviewQuestionResponse.builder()
                .id(nextQ.getId())
                .question(nextQ.getQuestion())
                .expectedAnswer(nextQ.getExpectedAnswer())
                .userAnswer(nextQ.getUserAnswer())
                .score(nextQ.getScore())
                .feedback(nextQ.getFeedback())
                .questionOrder(nextQ.getQuestionOrder())
                .build();
    }

    @Override
    @Transactional
    public InterviewQuestionResponse submitAnswer(Long interviewId, Long questionId, String answer) {
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
            jsonStr = jsonStr.trim();
            if(jsonStr.startsWith("```json")) {
                jsonStr = jsonStr.substring(7);
            }
            if(jsonStr.endsWith("```")) {
                jsonStr = jsonStr.substring(0, jsonStr.length() - 3);
            }
            jsonStr = jsonStr.trim();
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
        
        return InterviewQuestionResponse.builder()
                .id(question.getId())
                .question(question.getQuestion())
                .expectedAnswer(question.getExpectedAnswer())
                .userAnswer(question.getUserAnswer())
                .score(question.getScore())
                .feedback(question.getFeedback())
                .questionOrder(question.getQuestionOrder())
                .build();
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

        StringBuilder sb = new StringBuilder();
        for (InterviewQuestion q : questions) {
            sb.append("Question: ").append(q.getQuestion()).append("\n")
              .append("Expected Answer: ").append(q.getExpectedAnswer()).append("\n")
              .append("User Answer: ").append(q.getUserAnswer() != null ? q.getUserAnswer() : "No answer").append("\n")
              .append("Score: ").append(q.getScore() != null ? q.getScore() : 0).append("/10\n")
              .append("Feedback: ").append(q.getFeedback() != null ? q.getFeedback() : "").append("\n\n");
        }

        String strengthsStr = "";
        String weaknessesStr = "";
        String recommendationsStr = "";
        String detailedReportStr = "Completed successfully.";

        try {
            String reportJson = aiService.generateInterviewReport(sb.toString());
            
            JsonNode rootNode = objectMapper.readTree(reportJson);
            JsonNode textNode = rootNode.path("candidates").path(0).path("content").path("parts").path(0).path("text");
            String jsonStr = textNode.isMissingNode() ? reportJson : textNode.asText();
            jsonStr = jsonStr.trim();
            if(jsonStr.startsWith("```json")) {
                jsonStr = jsonStr.substring(7);
            }
            if(jsonStr.endsWith("```")) {
                jsonStr = jsonStr.substring(0, jsonStr.length() - 3);
            }
            jsonStr = jsonStr.trim();
            JsonNode evalNode = objectMapper.readTree(jsonStr);
            
            if (evalNode.has("strengths")) {
                if (evalNode.get("strengths").isArray()) {
                    List<String> list = new ArrayList<>();
                    evalNode.get("strengths").forEach(n -> list.add(n.asText()));
                    strengthsStr = String.join("\n", list);
                } else {
                    strengthsStr = evalNode.get("strengths").asText();
                }
            }
            if (evalNode.has("weaknesses")) {
                if (evalNode.get("weaknesses").isArray()) {
                    List<String> list = new ArrayList<>();
                    evalNode.get("weaknesses").forEach(n -> list.add(n.asText()));
                    weaknessesStr = String.join("\n", list);
                } else {
                    weaknessesStr = evalNode.get("weaknesses").asText();
                }
            }
            if (evalNode.has("recommendations")) {
                if (evalNode.get("recommendations").isArray()) {
                    List<String> list = new ArrayList<>();
                    evalNode.get("recommendations").forEach(n -> list.add(n.asText()));
                    recommendationsStr = String.join("\n", list);
                } else {
                    recommendationsStr = evalNode.get("recommendations").asText();
                }
            }
            if (evalNode.has("detailedReport")) {
                detailedReportStr = evalNode.get("detailedReport").asText();
            }
        } catch (Exception e) {
            System.err.println("Failed to parse AI report, using defaults: " + e.getMessage());
            strengthsStr = "Demonstrated technical knowledge in the domain.";
            weaknessesStr = "Some answers could be more elaborate and detailed.";
            recommendationsStr = "Practice explaining systems architectures and key design patterns.";
            detailedReportStr = "Overall good performance. Focus on covering all edge cases in your answers.";
        }

        InterviewResult result = InterviewResult.builder()
                .interview(interview)
                .overallScore((totalScore * 100) / (maxScore > 0 ? maxScore : 1))
                .strengths(strengthsStr)
                .weaknesses(weaknessesStr)
                .recommendations(recommendationsStr)
                .detailedReport(detailedReportStr)
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
    @Transactional(readOnly = true)
    public List<InterviewResponse> getUserInterviews(Long userId) {
        return interviewRepository.findByUserIdOrderByStartedAtDesc(userId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public InterviewResponse getInterview(Long interviewId) {
        Interview interview = interviewRepository.findById(interviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Interview not found"));
        return mapToResponse(interview);
    }

    @Override
    @Transactional(readOnly = true)
    public InterviewReportResponse getInterviewReport(Long interviewId) {
        Interview interview = interviewRepository.findById(interviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Interview not found"));
                
        InterviewResult result = resultRepository.findByInterviewId(interviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Report not found for this interview"));
                
        List<InterviewQuestionResponse> questionResponses = interview.getQuestions().stream()
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

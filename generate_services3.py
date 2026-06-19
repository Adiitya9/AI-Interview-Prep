import os

BASE_DIR_IMPL = '/Users/adityamacbook/Documents/Resume Project/backend/src/main/java/com/interviewprep/service/impl'

impls = {
    "ResumeServiceImpl.java": """package com.interviewprep.service.impl;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.interviewprep.dto.response.ResumeAnalysisResponse;
import com.interviewprep.entity.Resume;
import com.interviewprep.entity.User;
import com.interviewprep.exception.ResourceNotFoundException;
import com.interviewprep.repository.ResumeRepository;
import com.interviewprep.repository.UserRepository;
import com.interviewprep.service.AiService;
import com.interviewprep.service.ResumeService;
import com.interviewprep.util.PdfExtractor;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ResumeServiceImpl implements ResumeService {

    private final ResumeRepository resumeRepository;
    private final UserRepository userRepository;
    private final PdfExtractor pdfExtractor;
    private final AiService aiService;
    private final ObjectMapper objectMapper;

    @Override
    @Transactional
    public ResumeAnalysisResponse uploadAndAnalyze(MultipartFile file, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        try {
            String extractedText = pdfExtractor.extractText(file);
            String aiAnalysisStr = aiService.analyzeResume(extractedText);
            
            JsonNode rootNode = objectMapper.readTree(aiAnalysisStr);
            JsonNode textNode = rootNode.path("candidates").path(0).path("content").path("parts").path(0).path("text");
            String jsonStr = textNode.isMissingNode() ? aiAnalysisStr : textNode.asText();
            if(jsonStr.startsWith("```json")) {
                jsonStr = jsonStr.substring(7, jsonStr.length() - 3);
            }
            JsonNode analysis = objectMapper.readTree(jsonStr);

            Resume resume = Resume.builder()
                    .user(user)
                    .fileName(file.getOriginalFilename())
                    .extractedText(extractedText)
                    .skillsJson(analysis.has("skills") ? analysis.get("skills").toString() : "[]")
                    .missingSkillsJson(analysis.has("missingSkills") ? analysis.get("missingSkills").toString() : "[]")
                    .atsScore(analysis.has("atsScore") ? analysis.get("atsScore").asInt() : 0)
                    .feedback(analysis.has("feedback") ? analysis.get("feedback").asText() : "")
                    .suggestions(analysis.has("suggestions") ? analysis.get("suggestions").asText() : "")
                    .build();

            resumeRepository.save(resume);

            return mapToResponse(resume);
        } catch (Exception e) {
            throw new RuntimeException("Failed to analyze resume: " + e.getMessage());
        }
    }

    @Override
    public ResumeAnalysisResponse getResumeAnalysis(Long resumeId, Long userId) {
        Resume resume = resumeRepository.findById(resumeId)
                .orElseThrow(() -> new ResourceNotFoundException("Resume not found"));
        
        if (!resume.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized access to resume");
        }

        return mapToResponse(resume);
    }

    private ResumeAnalysisResponse mapToResponse(Resume resume) {
        List<String> skills = new ArrayList<>();
        List<String> missingSkills = new ArrayList<>();
        try {
            JsonNode skillsNode = objectMapper.readTree(resume.getSkillsJson());
            if(skillsNode.isArray()) {
                skillsNode.forEach(n -> skills.add(n.asText()));
            }
            JsonNode missingNode = objectMapper.readTree(resume.getMissingSkillsJson());
            if(missingNode.isArray()) {
                missingNode.forEach(n -> missingSkills.add(n.asText()));
            }
        } catch (Exception ignored) {}

        return ResumeAnalysisResponse.builder()
                .resumeId(resume.getId())
                .fileName(resume.getFileName())
                .skills(skills)
                .missingSkills(missingSkills)
                .atsScore(resume.getAtsScore())
                .feedback(resume.getFeedback())
                .suggestions(resume.getSuggestions())
                .build();
    }
}
""",
    "QuestionServiceImpl.java": """package com.interviewprep.service.impl;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.interviewprep.dto.request.QuestionGenerateRequest;
import com.interviewprep.dto.response.QuestionResponse;
import com.interviewprep.enums.Difficulty;
import com.interviewprep.enums.Domain;
import com.interviewprep.service.AiService;
import com.interviewprep.service.QuestionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class QuestionServiceImpl implements QuestionService {

    private final AiService aiService;
    private final ObjectMapper objectMapper;

    @Override
    public List<QuestionResponse> generateQuestions(QuestionGenerateRequest request) {
        String aiResponse = aiService.generateQuestions(
                request.getDomain().name(), 
                request.getDifficulty().name(), 
                request.getCount()
        );

        List<QuestionResponse> questions = new ArrayList<>();
        try {
            JsonNode rootNode = objectMapper.readTree(aiResponse);
            JsonNode textNode = rootNode.path("candidates").path(0).path("content").path("parts").path(0).path("text");
            String jsonStr = textNode.isMissingNode() ? aiResponse : textNode.asText();
            if(jsonStr.startsWith("```json")) {
                jsonStr = jsonStr.substring(7, jsonStr.length() - 3);
            }
            JsonNode arrayNode = objectMapper.readTree(jsonStr);
            if(arrayNode.isArray()) {
                for (JsonNode node : arrayNode) {
                    questions.add(QuestionResponse.builder()
                            .question(node.has("question") ? node.get("question").asText() : "")
                            .expectedAnswer(node.has("expectedAnswer") ? node.get("expectedAnswer").asText() : "")
                            .domain(request.getDomain())
                            .difficulty(request.getDifficulty())
                            .build());
                }
            }
        } catch (Exception e) {
            // fallback
        }
        return questions;
    }
}
"""
}

for filename, content in impls.items():
    with open(os.path.join(BASE_DIR_IMPL, filename), 'w') as f:
        f.write(content)

print("Resume and Question Impls created.")

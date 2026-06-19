package com.interviewprep.service.impl;

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

package com.interviewprep.service.impl;

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

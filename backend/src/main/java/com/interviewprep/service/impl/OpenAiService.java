package com.interviewprep.service.impl;

import com.interviewprep.service.AiService;
import org.springframework.stereotype.Service;

@Service
public class OpenAiService implements AiService {
    @Override
    public String analyzeResume(String resumeText) {
        return "{}";
    }

    @Override
    public String generateQuestions(String domain, String difficulty, int count) {
        return "[]";
    }

    @Override
    public String evaluateAnswer(String question, String expectedAnswer, String userAnswer) {
        return "{}";
    }

    @Override
    public String generateSkillGapAnalysis(String resumeSkills, String jdSkills) {
        return "{}";
    }

    @Override
    public String generateInterviewReport(String interviewData) {
        return "{}";
    }
}

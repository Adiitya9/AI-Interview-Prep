package com.interviewprep.service;

public interface AiService {
    String analyzeResume(String resumeText);
    String generateQuestions(String domain, String difficulty, int count);
    String evaluateAnswer(String question, String expectedAnswer, String userAnswer);
    String generateSkillGapAnalysis(String resumeSkills, String jdSkills);
    String generateInterviewReport(String interviewData);

    default String generateResponse(String prompt, String model) {
        return "";
    }
}

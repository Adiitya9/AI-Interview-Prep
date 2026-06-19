package com.interviewprep.service;

import com.interviewprep.dto.response.InterviewQuestionResponse;
import com.interviewprep.dto.response.InterviewReportResponse;
import com.interviewprep.dto.response.InterviewResponse;
import java.util.List;

public interface InterviewService {
    InterviewResponse startInterview(Long userId, String domain, String difficulty);
    InterviewQuestionResponse getNextQuestion(Long interviewId);
    InterviewQuestionResponse submitAnswer(Long interviewId, Long questionId, String answer);
    InterviewReportResponse completeInterview(Long interviewId);
    List<InterviewResponse> getUserInterviews(Long userId);
    InterviewResponse getInterview(Long interviewId);
    InterviewReportResponse getInterviewReport(Long interviewId);
}

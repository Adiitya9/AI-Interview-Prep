package com.interviewprep.service;

import com.interviewprep.dto.request.QuestionGenerateRequest;
import com.interviewprep.dto.response.QuestionResponse;
import java.util.List;

public interface QuestionService {
    List<QuestionResponse> generateQuestions(QuestionGenerateRequest request);
}

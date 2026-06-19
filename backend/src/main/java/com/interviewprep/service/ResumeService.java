package com.interviewprep.service;

import com.interviewprep.dto.response.ResumeAnalysisResponse;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

public interface ResumeService {
    ResumeAnalysisResponse uploadAndAnalyze(MultipartFile file, Long userId);
    ResumeAnalysisResponse getResumeAnalysis(Long resumeId, Long userId);
    List<ResumeAnalysisResponse> getResumesByUser(Long userId);
    ResumeAnalysisResponse getLatestResume(Long userId);
}

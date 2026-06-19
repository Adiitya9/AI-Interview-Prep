import os

BASE_DIR_SVC = '/Users/adityamacbook/Documents/Resume Project/backend/src/main/java/com/interviewprep/service'
BASE_DIR_IMPL = os.path.join(BASE_DIR_SVC, 'impl')

services = {
    "AiService.java": """package com.interviewprep.service;

public interface AiService {
    String analyzeResume(String resumeText);
    String generateQuestions(String domain, String difficulty, int count);
    String evaluateAnswer(String question, String expectedAnswer, String userAnswer);
    String generateSkillGapAnalysis(String resumeSkills, String jdSkills);
}
""",
    "AuthService.java": """package com.interviewprep.service;

import com.interviewprep.dto.request.LoginRequest;
import com.interviewprep.dto.request.RegisterRequest;
import com.interviewprep.dto.response.AuthResponse;

public interface AuthService {
    AuthResponse login(LoginRequest request);
    AuthResponse register(RegisterRequest request);
}
""",
    "ResumeService.java": """package com.interviewprep.service;

import com.interviewprep.dto.response.ResumeAnalysisResponse;
import org.springframework.web.multipart.MultipartFile;

public interface ResumeService {
    ResumeAnalysisResponse uploadAndAnalyze(MultipartFile file, Long userId);
    ResumeAnalysisResponse getResumeAnalysis(Long resumeId, Long userId);
}
""",
    "QuestionService.java": """package com.interviewprep.service;

import com.interviewprep.dto.request.QuestionGenerateRequest;
import com.interviewprep.dto.response.QuestionResponse;
import java.util.List;

public interface QuestionService {
    List<QuestionResponse> generateQuestions(QuestionGenerateRequest request);
}
""",
    "InterviewService.java": """package com.interviewprep.service;

import com.interviewprep.dto.response.InterviewReportResponse;
import com.interviewprep.dto.response.InterviewResponse;
import java.util.List;

public interface InterviewService {
    InterviewResponse startInterview(Long userId, String domain, String difficulty);
    void submitAnswer(Long interviewId, Long questionId, String answer);
    InterviewReportResponse completeInterview(Long interviewId);
    List<InterviewResponse> getUserInterviews(Long userId);
    InterviewResponse getInterview(Long interviewId);
}
""",
    "SkillGapService.java": """package com.interviewprep.service;

import com.interviewprep.dto.response.SkillGapResponse;

public interface SkillGapService {
    SkillGapResponse analyzeSkillGap(Long userId, Long resumeId, Long jdId);
    SkillGapResponse getSkillGapAnalysis(Long analysisId, Long userId);
}
""",
    "DashboardService.java": """package com.interviewprep.service;

import com.interviewprep.dto.response.DashboardResponse;

public interface DashboardService {
    DashboardResponse getUserDashboard(Long userId);
}
""",
    "ProgressService.java": """package com.interviewprep.service;

import com.interviewprep.dto.response.ProgressResponse;
import java.util.List;

public interface ProgressService {
    ProgressResponse generateProgressReport(Long userId);
    List<ProgressResponse> getUserProgressReports(Long userId);
}
""",
    "AdminService.java": """package com.interviewprep.service;

import com.interviewprep.dto.response.AdminAnalyticsResponse;

public interface AdminService {
    AdminAnalyticsResponse getPlatformAnalytics();
}
"""
}

for filename, content in services.items():
    with open(os.path.join(BASE_DIR_SVC, filename), 'w') as f:
        f.write(content)

print("Service interfaces created.")

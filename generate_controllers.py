import os

BASE_DIR_CTRL = '/Users/adityamacbook/Documents/Resume Project/backend/src/main/java/com/interviewprep/controller'

controllers = {
    "AuthController.java": """package com.interviewprep.controller;

import com.interviewprep.dto.request.LoginRequest;
import com.interviewprep.dto.request.RegisterRequest;
import com.interviewprep.dto.response.ApiResponse;
import com.interviewprep.dto.response.AuthResponse;
import com.interviewprep.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(new ApiResponse<>(true, "Login successful", response));
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return ResponseEntity.ok(new ApiResponse<>(true, "Registration successful", response));
    }
}
""",
    "DashboardController.java": """package com.interviewprep.controller;

import com.interviewprep.dto.response.ApiResponse;
import com.interviewprep.dto.response.DashboardResponse;
import com.interviewprep.security.CustomUserDetails;
import com.interviewprep.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping
    public ResponseEntity<ApiResponse<DashboardResponse>> getDashboard(@AuthenticationPrincipal CustomUserDetails userDetails) {
        DashboardResponse response = dashboardService.getUserDashboard(userDetails.getId());
        return ResponseEntity.ok(new ApiResponse<>(true, "Dashboard retrieved successfully", response));
    }
}
""",
    "ResumeController.java": """package com.interviewprep.controller;

import com.interviewprep.dto.response.ApiResponse;
import com.interviewprep.dto.response.ResumeAnalysisResponse;
import com.interviewprep.security.CustomUserDetails;
import com.interviewprep.service.ResumeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/v1/resumes")
@RequiredArgsConstructor
public class ResumeController {

    private final ResumeService resumeService;

    @PostMapping("/upload")
    public ResponseEntity<ApiResponse<ResumeAnalysisResponse>> uploadResume(
            @RequestParam("file") MultipartFile file,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        ResumeAnalysisResponse response = resumeService.uploadAndAnalyze(file, userDetails.getId());
        return ResponseEntity.ok(new ApiResponse<>(true, "Resume uploaded and analyzed successfully", response));
    }

    @GetMapping("/{resumeId}")
    public ResponseEntity<ApiResponse<ResumeAnalysisResponse>> getResumeAnalysis(
            @PathVariable Long resumeId,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        ResumeAnalysisResponse response = resumeService.getResumeAnalysis(resumeId, userDetails.getId());
        return ResponseEntity.ok(new ApiResponse<>(true, "Resume analysis retrieved successfully", response));
    }
}
""",
    "QuestionController.java": """package com.interviewprep.controller;

import com.interviewprep.dto.request.QuestionGenerateRequest;
import com.interviewprep.dto.response.ApiResponse;
import com.interviewprep.dto.response.QuestionResponse;
import com.interviewprep.service.QuestionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/questions")
@RequiredArgsConstructor
public class QuestionController {

    private final QuestionService questionService;

    @PostMapping("/generate")
    public ResponseEntity<ApiResponse<List<QuestionResponse>>> generateQuestions(
            @Valid @RequestBody QuestionGenerateRequest request) {
        List<QuestionResponse> response = questionService.generateQuestions(request);
        return ResponseEntity.ok(new ApiResponse<>(true, "Questions generated successfully", response));
    }
}
""",
    "InterviewController.java": """package com.interviewprep.controller;

import com.interviewprep.dto.response.ApiResponse;
import com.interviewprep.dto.response.InterviewReportResponse;
import com.interviewprep.dto.response.InterviewResponse;
import com.interviewprep.security.CustomUserDetails;
import com.interviewprep.service.InterviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/interviews")
@RequiredArgsConstructor
public class InterviewController {

    private final InterviewService interviewService;

    @PostMapping("/start")
    public ResponseEntity<ApiResponse<InterviewResponse>> startInterview(
            @RequestParam String domain,
            @RequestParam String difficulty,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        InterviewResponse response = interviewService.startInterview(userDetails.getId(), domain, difficulty);
        return ResponseEntity.ok(new ApiResponse<>(true, "Interview started successfully", response));
    }

    @PostMapping("/{interviewId}/questions/{questionId}/answer")
    public ResponseEntity<ApiResponse<Void>> submitAnswer(
            @PathVariable Long interviewId,
            @PathVariable Long questionId,
            @RequestBody Map<String, String> payload) {
        String answer = payload.get("answer");
        interviewService.submitAnswer(interviewId, questionId, answer);
        return ResponseEntity.ok(new ApiResponse<>(true, "Answer submitted successfully", null));
    }

    @PostMapping("/{interviewId}/complete")
    public ResponseEntity<ApiResponse<InterviewReportResponse>> completeInterview(
            @PathVariable Long interviewId) {
        InterviewReportResponse response = interviewService.completeInterview(interviewId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Interview completed successfully", response));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<InterviewResponse>>> getUserInterviews(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        List<InterviewResponse> response = interviewService.getUserInterviews(userDetails.getId());
        return ResponseEntity.ok(new ApiResponse<>(true, "Interviews retrieved successfully", response));
    }

    @GetMapping("/{interviewId}")
    public ResponseEntity<ApiResponse<InterviewResponse>> getInterview(
            @PathVariable Long interviewId) {
        InterviewResponse response = interviewService.getInterview(interviewId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Interview retrieved successfully", response));
    }
}
""",
    "SkillGapController.java": """package com.interviewprep.controller;

import com.interviewprep.dto.response.ApiResponse;
import com.interviewprep.dto.response.SkillGapResponse;
import com.interviewprep.security.CustomUserDetails;
import com.interviewprep.service.SkillGapService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/skill-gap")
@RequiredArgsConstructor
public class SkillGapController {

    private final SkillGapService skillGapService;

    @PostMapping("/analyze")
    public ResponseEntity<ApiResponse<SkillGapResponse>> analyzeSkillGap(
            @RequestParam Long resumeId,
            @RequestParam Long jdId,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        SkillGapResponse response = skillGapService.analyzeSkillGap(userDetails.getId(), resumeId, jdId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Skill gap analyzed successfully", response));
    }

    @GetMapping("/{analysisId}")
    public ResponseEntity<ApiResponse<SkillGapResponse>> getSkillGapAnalysis(
            @PathVariable Long analysisId,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        SkillGapResponse response = skillGapService.getSkillGapAnalysis(analysisId, userDetails.getId());
        return ResponseEntity.ok(new ApiResponse<>(true, "Skill gap analysis retrieved successfully", response));
    }
}
""",
    "ProgressController.java": """package com.interviewprep.controller;

import com.interviewprep.dto.response.ApiResponse;
import com.interviewprep.dto.response.ProgressResponse;
import com.interviewprep.security.CustomUserDetails;
import com.interviewprep.service.ProgressService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/progress")
@RequiredArgsConstructor
public class ProgressController {

    private final ProgressService progressService;

    @PostMapping("/generate")
    public ResponseEntity<ApiResponse<ProgressResponse>> generateProgressReport(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        ProgressResponse response = progressService.generateProgressReport(userDetails.getId());
        return ResponseEntity.ok(new ApiResponse<>(true, "Progress report generated successfully", response));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ProgressResponse>>> getUserProgressReports(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        List<ProgressResponse> response = progressService.getUserProgressReports(userDetails.getId());
        return ResponseEntity.ok(new ApiResponse<>(true, "Progress reports retrieved successfully", response));
    }
}
""",
    "AdminController.java": """package com.interviewprep.controller;

import com.interviewprep.dto.response.AdminAnalyticsResponse;
import com.interviewprep.dto.response.ApiResponse;
import com.interviewprep.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/analytics")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<AdminAnalyticsResponse>> getPlatformAnalytics() {
        AdminAnalyticsResponse response = adminService.getPlatformAnalytics();
        return ResponseEntity.ok(new ApiResponse<>(true, "Platform analytics retrieved successfully", response));
    }
}
"""
}

for filename, content in controllers.items():
    with open(os.path.join(BASE_DIR_CTRL, filename), 'w') as f:
        f.write(content)

print("Controllers created.")

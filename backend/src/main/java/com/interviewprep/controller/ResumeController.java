package com.interviewprep.controller;

import com.interviewprep.dto.response.ApiResponse;
import com.interviewprep.dto.response.ResumeAnalysisResponse;
import com.interviewprep.security.CustomUserDetails;
import com.interviewprep.service.ResumeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/v1/resumes")
@RequiredArgsConstructor
@Tag(name = "Resume Management", description = "APIs for uploading and analyzing resumes")
public class ResumeController {

    private final ResumeService resumeService;

    @Operation(summary = "Upload and analyze a new resume")
    @PostMapping(value = "/upload", consumes = "multipart/form-data")
    public ResponseEntity<ApiResponse<ResumeAnalysisResponse>> uploadResume(
            @RequestParam("file") MultipartFile file,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        ResumeAnalysisResponse response = resumeService.uploadAndAnalyze(file, userDetails.getId());
        return ResponseEntity.ok(ApiResponse.<ResumeAnalysisResponse>builder()
                .success(true)
                .message("Resume uploaded and analyzed successfully")
                .data(response)
                .build());
    }

    @Operation(summary = "Get all resumes for the authenticated user")
    @GetMapping
    public ResponseEntity<ApiResponse<List<ResumeAnalysisResponse>>> getUserResumes(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        List<ResumeAnalysisResponse> response = resumeService.getResumesByUser(userDetails.getId());
        return ResponseEntity.ok(ApiResponse.<List<ResumeAnalysisResponse>>builder()
                .success(true)
                .message("Resumes retrieved successfully")
                .data(response)
                .build());
    }

    @Operation(summary = "Get the latest resume analysis for the authenticated user")
    @GetMapping("/latest")
    public ResponseEntity<ApiResponse<ResumeAnalysisResponse>> getLatestResume(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        ResumeAnalysisResponse response = resumeService.getLatestResume(userDetails.getId());
        return ResponseEntity.ok(ApiResponse.<ResumeAnalysisResponse>builder()
                .success(true)
                .message("Latest resume analysis retrieved successfully")
                .data(response)
                .build());
    }

    @Operation(summary = "Get analysis for a specific resume")
    @GetMapping("/{resumeId}")
    public ResponseEntity<ApiResponse<ResumeAnalysisResponse>> getResumeAnalysis(
            @PathVariable Long resumeId,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        ResumeAnalysisResponse response = resumeService.getResumeAnalysis(resumeId, userDetails.getId());
        return ResponseEntity.ok(ApiResponse.<ResumeAnalysisResponse>builder()
                .success(true)
                .message("Resume analysis retrieved successfully")
                .data(response)
                .build());
    }
}

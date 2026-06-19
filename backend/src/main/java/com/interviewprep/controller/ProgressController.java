package com.interviewprep.controller;

import com.interviewprep.dto.response.ApiResponse;
import com.interviewprep.dto.response.ProgressResponse;
import com.interviewprep.security.CustomUserDetails;
import com.interviewprep.service.ProgressService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/progress")
@RequiredArgsConstructor
@Tag(name = "Progress Report", description = "APIs for tracking user learning progress")
public class ProgressController {

    private final ProgressService progressService;

    @Operation(summary = "Generate a new progress report for the authenticated user")
    @PostMapping("/generate")
    public ResponseEntity<ApiResponse<ProgressResponse>> generateProgressReport(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        ProgressResponse response = progressService.generateProgressReport(userDetails.getId());
        return ResponseEntity.ok(ApiResponse.<ProgressResponse>builder()
                .success(true)
                .message("Progress report generated successfully")
                .data(response)
                .build());
    }

    @Operation(summary = "Get all progress reports for the authenticated user")
    @GetMapping
    public ResponseEntity<ApiResponse<List<ProgressResponse>>> getUserProgressReports(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        List<ProgressResponse> response = progressService.getUserProgressReports(userDetails.getId());
        return ResponseEntity.ok(ApiResponse.<List<ProgressResponse>>builder()
                .success(true)
                .message("Progress reports retrieved successfully")
                .data(response)
                .build());
    }
}

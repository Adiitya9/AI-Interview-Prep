package com.interviewprep.controller;

import com.interviewprep.dto.response.AdminAnalyticsResponse;
import com.interviewprep.dto.response.ApiResponse;
import com.interviewprep.service.AdminService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
@Tag(name = "Admin Management", description = "APIs for platform administration")
public class AdminController {

    private final AdminService adminService;

    @Operation(summary = "Get overall platform analytics")
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/analytics")
    public ResponseEntity<ApiResponse<AdminAnalyticsResponse>> getPlatformAnalytics() {
        AdminAnalyticsResponse response = adminService.getPlatformAnalytics();
        return ResponseEntity.ok(ApiResponse.<AdminAnalyticsResponse>builder()
                .success(true)
                .message("Platform analytics retrieved successfully")
                .data(response)
                .build());
    }
}

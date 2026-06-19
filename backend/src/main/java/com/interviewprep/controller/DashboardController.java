package com.interviewprep.controller;

import com.interviewprep.dto.response.ApiResponse;
import com.interviewprep.dto.response.DashboardResponse;
import com.interviewprep.security.CustomUserDetails;
import com.interviewprep.service.DashboardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/dashboard")
@RequiredArgsConstructor
@Tag(name = "Dashboard", description = "APIs for user dashboard analytics")
public class DashboardController {

    private final DashboardService dashboardService;

    @Operation(summary = "Get dashboard analytics for the authenticated user")
    @GetMapping
    public ResponseEntity<ApiResponse<DashboardResponse>> getUserDashboard(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        DashboardResponse response = dashboardService.getUserDashboard(userDetails.getId());
        return ResponseEntity.ok(ApiResponse.<DashboardResponse>builder()
                .success(true)
                .message("Dashboard retrieved successfully")
                .data(response)
                .build());
    }
}

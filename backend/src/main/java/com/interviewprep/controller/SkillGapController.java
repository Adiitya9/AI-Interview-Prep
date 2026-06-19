package com.interviewprep.controller;

import com.interviewprep.dto.request.SkillGapRequest;
import com.interviewprep.dto.response.ApiResponse;
import com.interviewprep.dto.response.SkillGapResponse;
import com.interviewprep.security.CustomUserDetails;
import com.interviewprep.service.SkillGapService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/skill-gap")
@RequiredArgsConstructor
@Tag(name = "Skill Gap Analysis", description = "APIs for analyzing skill gaps between resume and job description")
public class SkillGapController {

    private final SkillGapService skillGapService;

    @Operation(summary = "Start a new skill gap analysis")
    @PostMapping("/analyze")
    public ResponseEntity<ApiResponse<SkillGapResponse>> analyzeSkillGap(
            @Valid @RequestBody SkillGapRequest request,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        SkillGapResponse response = skillGapService.analyzeSkillGap(
                userDetails.getId(),
                request.getResumeId(),
                request.getJdId()
        );
        return ResponseEntity.ok(ApiResponse.<SkillGapResponse>builder()
                .success(true)
                .message("Skill gap analysis completed successfully")
                .data(response)
                .build());
    }

    @Operation(summary = "Get an existing skill gap analysis")
    @GetMapping("/{analysisId}")
    public ResponseEntity<ApiResponse<SkillGapResponse>> getAnalysis(
            @PathVariable Long analysisId,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        SkillGapResponse response = skillGapService.getSkillGapAnalysis(analysisId, userDetails.getId());
        return ResponseEntity.ok(ApiResponse.<SkillGapResponse>builder()
                .success(true)
                .message("Analysis retrieved successfully")
                .data(response)
                .build());
    }
}

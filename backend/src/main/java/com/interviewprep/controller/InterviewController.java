package com.interviewprep.controller;

import com.interviewprep.dto.request.InterviewAnswerRequest;
import com.interviewprep.dto.request.InterviewStartRequest;
import com.interviewprep.dto.response.ApiResponse;
import com.interviewprep.dto.response.InterviewQuestionResponse;
import com.interviewprep.dto.response.InterviewReportResponse;
import com.interviewprep.dto.response.InterviewResponse;
import com.interviewprep.security.CustomUserDetails;
import com.interviewprep.service.InterviewService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/interviews")
@RequiredArgsConstructor
@Tag(name = "Interview Management", description = "APIs for starting, taking, and reviewing interviews")
public class InterviewController {

    private final InterviewService interviewService;

    @Operation(summary = "Start a new interview")
    @PostMapping("/start")
    public ResponseEntity<ApiResponse<InterviewResponse>> startInterview(
            @Valid @RequestBody InterviewStartRequest request,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        InterviewResponse response = interviewService.startInterview(userDetails.getId(), request.getDomain(), request.getDifficulty());
        return ResponseEntity.ok(ApiResponse.<InterviewResponse>builder()
                .success(true)
                .message("Interview started successfully")
                .data(response)
                .build());
    }

    @Operation(summary = "Get the next unanswered question for an interview")
    @GetMapping("/{interviewId}/next-question")
    public ResponseEntity<ApiResponse<InterviewQuestionResponse>> getNextQuestion(
            @PathVariable Long interviewId) {
        InterviewQuestionResponse response = interviewService.getNextQuestion(interviewId);
        return ResponseEntity.ok(ApiResponse.<InterviewQuestionResponse>builder()
                .success(true)
                .message(response != null ? "Next question retrieved successfully" : "No more questions left")
                .data(response)
                .build());
    }

    @Operation(summary = "Submit an answer for a specific question")
    @PostMapping("/{interviewId}/answer")
    public ResponseEntity<ApiResponse<InterviewQuestionResponse>> submitAnswer(
            @PathVariable Long interviewId,
            @Valid @RequestBody InterviewAnswerRequest request) {
        InterviewQuestionResponse response = interviewService.submitAnswer(interviewId, request.getQuestionId(), request.getAnswer());
        return ResponseEntity.ok(ApiResponse.<InterviewQuestionResponse>builder()
                .success(true)
                .message("Answer submitted and evaluated successfully")
                .data(response)
                .build());
    }

    @Operation(summary = "Complete an interview and get a report")
    @PostMapping("/{interviewId}/complete")
    public ResponseEntity<ApiResponse<InterviewReportResponse>> completeInterview(
            @PathVariable Long interviewId) {
        InterviewReportResponse response = interviewService.completeInterview(interviewId);
        return ResponseEntity.ok(ApiResponse.<InterviewReportResponse>builder()
                .success(true)
                .message("Interview completed successfully")
                .data(response)
                .build());
    }

    @Operation(summary = "Get the report for a completed interview")
    @GetMapping("/{interviewId}/report")
    public ResponseEntity<ApiResponse<InterviewReportResponse>> getInterviewReport(
            @PathVariable Long interviewId) {
        InterviewReportResponse response = interviewService.getInterviewReport(interviewId);
        return ResponseEntity.ok(ApiResponse.<InterviewReportResponse>builder()
                .success(true)
                .message("Interview report retrieved successfully")
                .data(response)
                .build());
    }

    @Operation(summary = "Get all interviews for the authenticated user")
    @GetMapping
    public ResponseEntity<ApiResponse<List<InterviewResponse>>> getUserInterviews(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        List<InterviewResponse> response = interviewService.getUserInterviews(userDetails.getId());
        return ResponseEntity.ok(ApiResponse.<List<InterviewResponse>>builder()
                .success(true)
                .message("Interviews retrieved successfully")
                .data(response)
                .build());
    }

    @Operation(summary = "Get details of a specific interview")
    @GetMapping("/{interviewId}")
    public ResponseEntity<ApiResponse<InterviewResponse>> getInterview(
            @PathVariable Long interviewId) {
        InterviewResponse response = interviewService.getInterview(interviewId);
        return ResponseEntity.ok(ApiResponse.<InterviewResponse>builder()
                .success(true)
                .message("Interview retrieved successfully")
                .data(response)
                .build());
    }
}

package com.interviewprep.controller;

import com.interviewprep.dto.request.QuestionGenerateRequest;
import com.interviewprep.dto.response.ApiResponse;
import com.interviewprep.dto.response.QuestionResponse;
import com.interviewprep.service.QuestionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/questions")
@RequiredArgsConstructor
@Tag(name = "Question Generation", description = "APIs for standalone question generation")
public class QuestionController {

    private final QuestionService questionService;

    @Operation(summary = "Generate interview questions based on domain and difficulty")
    @PostMapping("/generate")
    public ResponseEntity<ApiResponse<List<QuestionResponse>>> generateQuestions(
            @Valid @RequestBody QuestionGenerateRequest request) {
        List<QuestionResponse> response = questionService.generateQuestions(request);
        return ResponseEntity.ok(ApiResponse.<List<QuestionResponse>>builder()
                .success(true)
                .message("Questions generated successfully")
                .data(response)
                .build());
    }
}

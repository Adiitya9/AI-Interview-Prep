package com.interviewprep.service;

import com.interviewprep.dto.response.ProgressResponse;
import java.util.List;

public interface ProgressService {
    ProgressResponse generateProgressReport(Long userId);
    List<ProgressResponse> getUserProgressReports(Long userId);
}

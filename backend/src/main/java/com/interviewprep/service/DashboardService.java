package com.interviewprep.service;

import com.interviewprep.dto.response.DashboardResponse;

public interface DashboardService {
    DashboardResponse getUserDashboard(Long userId);
}

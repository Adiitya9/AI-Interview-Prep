package com.interviewprep.service;

import com.interviewprep.dto.response.SkillGapResponse;

public interface SkillGapService {
    SkillGapResponse analyzeSkillGap(Long userId, Long resumeId, Long jdId);
    SkillGapResponse getSkillGapAnalysis(Long analysisId, Long userId);
}

import os

BASE_DIR = '/Users/adityamacbook/Documents/Resume Project/backend/src/main/java/com/interviewprep/dto/response'

files = {
    "ApiResponse.java": """package com.interviewprep.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApiResponse<T> {
    private boolean success;
    private String message;
    private T data;
}
""",
    "AuthResponse.java": """package com.interviewprep.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private UserResponse user;
}
""",
    "UserResponse.java": """package com.interviewprep.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {
    private Long id;
    private String email;
    private String fullName;
    private String phone;
    private Set<String> roles;
}
""",
    "ResumeAnalysisResponse.java": """package com.interviewprep.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ResumeAnalysisResponse {
    private Long resumeId;
    private String fileName;
    private List<String> skills;
    private List<String> missingSkills;
    private Integer atsScore;
    private String feedback;
    private String suggestions;
}
""",
    "QuestionResponse.java": """package com.interviewprep.dto.response;

import com.interviewprep.enums.Difficulty;
import com.interviewprep.enums.Domain;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QuestionResponse {
    private Long id;
    private String question;
    private Domain domain;
    private Difficulty difficulty;
    private String expectedAnswer;
}
""",
    "InterviewResponse.java": """package com.interviewprep.dto.response;

import com.interviewprep.enums.Difficulty;
import com.interviewprep.enums.Domain;
import com.interviewprep.enums.InterviewStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InterviewResponse {
    private Long id;
    private String title;
    private Domain domain;
    private Difficulty difficulty;
    private InterviewStatus status;
    private Integer totalScore;
    private Integer maxScore;
    private LocalDateTime startedAt;
    private LocalDateTime completedAt;
}
""",
    "InterviewQuestionResponse.java": """package com.interviewprep.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InterviewQuestionResponse {
    private Long id;
    private String question;
    private String expectedAnswer;
    private String userAnswer;
    private Integer score;
    private String feedback;
    private Integer questionOrder;
}
""",
    "InterviewReportResponse.java": """package com.interviewprep.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InterviewReportResponse {
    private Long interviewId;
    private Integer overallScore;
    private String strengths;
    private String weaknesses;
    private String recommendations;
    private String detailedReport;
    private List<InterviewQuestionResponse> questions;
}
""",
    "SkillGapResponse.java": """package com.interviewprep.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SkillGapResponse {
    private Long id;
    private List<String> resumeSkills;
    private List<String> jdSkills;
    private Integer matchPercentage;
    private List<String> missingSkills;
    private List<String> strongAreas;
    private List<String> weakAreas;
    private List<RoadmapItem> learningRoadmap;
}
""",
    "RoadmapItem.java": """package com.interviewprep.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RoadmapItem {
    private Integer week;
    private String topic;
    private String description;
    private String resourceLinks;
}
""",
    "DashboardResponse.java": """package com.interviewprep.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardResponse {
    private Integer totalInterviews;
    private Double averageScore;
    private Integer upcomingInterviews;
    private List<ActivityItem> recentActivities;
}
""",
    "ActivityItem.java": """package com.interviewprep.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ActivityItem {
    private String type;
    private String description;
    private LocalDateTime date;
}
""",
    "ProgressResponse.java": """package com.interviewprep.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProgressResponse {
    private Long id;
    private LocalDate reportDate;
    private Integer interviewsCompleted;
    private Double avgScore;
    private List<String> skillsImproved;
    private String weeklySummary;
}
""",
    "AdminAnalyticsResponse.java": """package com.interviewprep.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminAnalyticsResponse {
    private Long totalUsers;
    private Long totalInterviews;
    private Long activeUsersThisWeek;
    private Double platformAverageScore;
}
"""
}

for filename, content in files.items():
    with open(os.path.join(BASE_DIR, filename), 'w') as f:
        f.write(content)
print("DTOs created.")

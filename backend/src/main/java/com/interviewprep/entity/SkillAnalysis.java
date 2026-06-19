package com.interviewprep.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "skill_analyses")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SkillAnalysis {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Lob
    private String resumeSkillsJson;

    @Lob
    private String jdSkillsJson;

    private Integer matchPercentage;

    @Lob
    private String missingSkillsJson;

    @Lob
    private String strongAreasJson;

    @Lob
    private String weakAreasJson;

    @Lob
    private String learningRoadmap;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime analyzedAt;
}

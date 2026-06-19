package com.interviewprep.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "resumes")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Resume {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String fileName;

    @Lob
    private String extractedText;

    @Lob
    private String skillsJson;

    @Lob
    private String missingSkillsJson;

    private Integer atsScore;

    @Lob
    private String feedback;

    @Lob
    private String suggestions;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime uploadedAt;
}

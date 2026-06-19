package com.interviewprep.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "interview_results")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InterviewResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "interview_id", nullable = false, unique = true)
    private Interview interview;

    private Integer overallScore;

    @Lob
    private String strengths;

    @Lob
    private String weaknesses;

    @Lob
    private String recommendations;

    @Lob
    private String detailedReport;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime generatedAt;
}

package com.interviewprep.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "interview_questions")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InterviewQuestion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "interview_id", nullable = false)
    private Interview interview;

    @Lob
    @Column(nullable = false)
    private String question;

    @Lob
    private String expectedAnswer;

    @Lob
    private String userAnswer;

    private Integer score;

    @Lob
    private String feedback;

    @Column(nullable = false)
    private Integer questionOrder;
}

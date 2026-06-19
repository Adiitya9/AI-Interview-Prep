package com.interviewprep.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "ai_logs")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AiLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(nullable = false)
    private String requestType;

    @Lob
    private String prompt;

    @Lob
    private String response;

    private Integer tokensUsed;

    private String modelUsed;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;
}

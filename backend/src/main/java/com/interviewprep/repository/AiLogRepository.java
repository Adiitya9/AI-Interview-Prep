package com.interviewprep.repository;

import com.interviewprep.entity.AiLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AiLogRepository extends JpaRepository<AiLog, Long> {

    List<AiLog> findByUserIdOrderByCreatedAtDesc(Long userId);

    long countByUserId(Long userId);
}

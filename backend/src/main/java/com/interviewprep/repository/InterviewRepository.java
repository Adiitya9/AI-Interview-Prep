package com.interviewprep.repository;

import com.interviewprep.entity.Interview;
import com.interviewprep.enums.InterviewStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InterviewRepository extends JpaRepository<Interview, Long> {

    List<Interview> findByUserIdOrderByStartedAtDesc(Long userId);

    long countByUserId(Long userId);

    List<Interview> findByUserIdAndStatus(Long userId, InterviewStatus status);

    @Query("SELECT AVG(i.totalScore * 100.0 / i.maxScore) FROM Interview i WHERE i.user.id = :userId AND i.status = 'COMPLETED' AND i.maxScore > 0")
    Double findAverageScoreByUserId(@Param("userId") Long userId);

    List<Interview> findTop5ByUserIdOrderByStartedAtDesc(Long userId);
}

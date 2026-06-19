package com.interviewprep.repository;

import com.interviewprep.entity.SkillAnalysis;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SkillAnalysisRepository extends JpaRepository<SkillAnalysis, Long> {

    List<SkillAnalysis> findByUserIdOrderByAnalyzedAtDesc(Long userId);

    Optional<SkillAnalysis> findTopByUserIdOrderByAnalyzedAtDesc(Long userId);
}

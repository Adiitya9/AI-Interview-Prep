package com.interviewprep.repository;

import com.interviewprep.entity.ProgressReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ProgressReportRepository extends JpaRepository<ProgressReport, Long> {

    List<ProgressReport> findByUserIdOrderByReportDateDesc(Long userId);

    List<ProgressReport> findByUserIdAndReportDateBetween(Long userId, LocalDate start, LocalDate end);
}

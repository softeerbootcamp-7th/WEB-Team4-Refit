package com.shyashyashya.refit.domain.interview.repository;

import com.shyashyashya.refit.domain.industry.model.Industry;
import com.shyashyashya.refit.domain.interview.model.Interview;
import com.shyashyashya.refit.domain.interview.model.InterviewResultStatus;
import com.shyashyashya.refit.domain.interview.model.InterviewReviewStatus;
import com.shyashyashya.refit.domain.interview.model.InterviewType;
import com.shyashyashya.refit.domain.jobcategory.model.JobCategory;
import com.shyashyashya.refit.domain.user.model.User;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface InterviewRepository extends JpaRepository<Interview, Long> {

    Page<Interview> findAllByUserAndReviewStatus(User user, InterviewReviewStatus reviewStatus, Pageable pageable);

    @Query("""
    SELECT i
      FROM Interview i
     WHERE i.user = :user
       AND i.startAt BETWEEN :startDate AND :endDate
     ORDER BY i.startAt
    """)
    Page<Interview> getUpcomingInterview(User user, LocalDateTime startDate, LocalDateTime endDate, Pageable pageable);

    boolean existsByUser(User user);

    boolean existsByUserAndReviewStatusIn(User user, List<InterviewReviewStatus> reviewStatuses);

    Page<Interview> findAllByUserAndReviewStatusIn(
            User user, List<InterviewReviewStatus> reviewStatuses, Pageable pageable);

    // QueryDSL 적용
    @Query("""
        SELECT i
          FROM Interview i
         WHERE i.user = :user
           AND i.company.name LIKE %:keyword%
           AND i.interviewType IN :interviewTypes
           AND i.resultStatus IN :interviewResultStatuses
           AND i.startAt BETWEEN :startDate AND :endDate
    """)
    Page<Interview> searchInterviews(
            User user,
            String keyword,
            List<InterviewType> interviewTypes,
            List<InterviewResultStatus> interviewResultStatuses,
            LocalDateTime startDate,
            LocalDateTime endDate,
            Pageable pageable);

    @Query("""
        SELECT i
          FROM Interview i
         WHERE i.user = :user
           AND i.industry = :industry
           AND i.jobCategory = :jobCategory
    """)
    List<Interview> findAllSimilarInterviewsByUser(User user, Industry interview, JobCategory jobCategory);
}

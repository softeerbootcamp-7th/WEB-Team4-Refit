package com.shyashyashya.refit.domain.interview.repository;

import com.shyashyashya.refit.domain.interview.model.Interview;
import com.shyashyashya.refit.domain.interview.model.InterviewReviewStatus;
import com.shyashyashya.refit.domain.user.model.User;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
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
    Optional<Interview> getUpcomingInterview(User user, LocalDateTime startDate, LocalDateTime endDate);

    boolean existsByUser(User user);

    boolean existsByUserAndReviewStatusIn(User user, List<InterviewReviewStatus> reviewStatuses);
}

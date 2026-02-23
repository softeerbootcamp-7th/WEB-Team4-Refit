package com.shyashyashya.refit.domain.interview.repository;

import com.shyashyashya.refit.domain.industry.model.Industry;
import com.shyashyashya.refit.domain.interview.model.Interview;
import com.shyashyashya.refit.domain.interview.model.InterviewResultStatus;
import com.shyashyashya.refit.domain.interview.model.InterviewReviewStatus;
import com.shyashyashya.refit.domain.interview.model.InterviewType;
import com.shyashyashya.refit.domain.jobcategory.model.JobCategory;
import com.shyashyashya.refit.domain.user.model.User;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface InterviewCustomRepository {

    Page<Interview> searchInterviews(
            User user,
            String keyword,
            Set<InterviewType> interviewTypes,
            Set<InterviewResultStatus> interviewResultStatuses,
            Set<InterviewReviewStatus> interviewReviewStatuses,
            LocalDate startDate,
            LocalDate endDate,
            Pageable pageable);

    List<Interview> findInterviewsNotLoggedRecentOneMonth(User user, LocalDateTime now);

    List<Interview> findAllSimilarInterviewsByUser(User user, Industry industry, JobCategory jobCategory);
}

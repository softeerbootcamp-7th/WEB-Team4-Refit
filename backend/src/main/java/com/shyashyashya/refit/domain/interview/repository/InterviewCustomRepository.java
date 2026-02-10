package com.shyashyashya.refit.domain.interview.repository;

import com.shyashyashya.refit.domain.interview.model.Interview;
import com.shyashyashya.refit.domain.interview.model.InterviewResultStatus;
import com.shyashyashya.refit.domain.interview.model.InterviewType;
import com.shyashyashya.refit.domain.user.model.User;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface InterviewCustomRepository {

    Page<Interview> searchInterviews(
            User user,
            String keyword,
            List<InterviewType> interviewTypes,
            List<InterviewResultStatus> interviewResultStatuses,
            LocalDate startDate,
            LocalDate endDate,
            Pageable pageable);
}

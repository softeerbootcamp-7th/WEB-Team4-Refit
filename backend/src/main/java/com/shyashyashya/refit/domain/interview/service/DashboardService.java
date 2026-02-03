package com.shyashyashya.refit.domain.interview.service;

import com.shyashyashya.refit.domain.interview.dto.response.DashboardHeadlineResponse;
import com.shyashyashya.refit.domain.interview.model.Interview;
import com.shyashyashya.refit.domain.interview.repository.InterviewRepository;
import com.shyashyashya.refit.domain.user.model.User;
import com.shyashyashya.refit.global.util.RequestUserContext;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

import static com.shyashyashya.refit.domain.interview.model.InterviewReviewStatus.LOG_DRAFT;
import static com.shyashyashya.refit.domain.interview.model.InterviewReviewStatus.NOT_LOGGED;
import static com.shyashyashya.refit.domain.interview.model.InterviewReviewStatus.SELF_REVIEW_DRAFT;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final RequestUserContext requestUserContext;
    private final InterviewRepository interviewRepository;

    @Transactional(readOnly = true)
    public DashboardHeadlineResponse getDashboardHeadlineData() {
        User requestUser = requestUserContext.getRequestUser();

        if (!interviewRepository.existsByUser(requestUser)) {
            return DashboardHeadlineResponse.registerInterview(requestUser);
        }

        LocalDateTime now = LocalDateTime.now();
        return interviewRepository.getUpcomingInterviewDday(requestUser, now, now.plusDays(7))
                .map(interview -> {
                    long dDay = getInterviewDday(now, interview);
                    return DashboardHeadlineResponse.prepareInterview(requestUser, dDay);
                })
                .orElseGet(() -> {
                    if (existInterviewsToLog(requestUser)) {
                        return DashboardHeadlineResponse.reviewInterview(requestUser);
                    }
                    return DashboardHeadlineResponse.checkInterviewHistory(requestUser);
                });
    }

    private long getInterviewDday(LocalDateTime now, Interview interview) {
        return ChronoUnit.DAYS.between(now.toLocalDate(), interview.getStartAt().toLocalDate());
    }

    private boolean existInterviewsToLog(User user) {
        return interviewRepository.existsByUserAndReviewStatuses(
                user, List.of(NOT_LOGGED, LOG_DRAFT, SELF_REVIEW_DRAFT));
    }
}

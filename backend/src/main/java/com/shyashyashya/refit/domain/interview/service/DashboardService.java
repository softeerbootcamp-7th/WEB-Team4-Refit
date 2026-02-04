package com.shyashyashya.refit.domain.interview.service;

import static com.shyashyashya.refit.domain.interview.model.InterviewReviewStatus.LOG_DRAFT;
import static com.shyashyashya.refit.domain.interview.model.InterviewReviewStatus.NOT_LOGGED;
import static com.shyashyashya.refit.domain.interview.model.InterviewReviewStatus.SELF_REVIEW_DRAFT;

import com.shyashyashya.refit.domain.interview.dto.response.DashboardCalendarResponse;
import com.shyashyashya.refit.domain.interview.dto.response.DashboardHeadlineResponse;
import com.shyashyashya.refit.domain.interview.model.Interview;
import com.shyashyashya.refit.domain.interview.model.InterviewReviewStatus;
import com.shyashyashya.refit.domain.interview.repository.InterviewRepository;
import com.shyashyashya.refit.domain.user.model.User;
import com.shyashyashya.refit.global.util.RequestUserContext;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private static final List<InterviewReviewStatus> REVIEW_NEEDED_STATUSES =
            List.of(NOT_LOGGED, LOG_DRAFT, SELF_REVIEW_DRAFT);

    private final RequestUserContext requestUserContext;
    private final InterviewRepository interviewRepository;

    @Transactional(readOnly = true)
    public DashboardHeadlineResponse getDashboardHeadlineData() {
        User requestUser = requestUserContext.getRequestUser();

        if (!interviewRepository.existsByUser(requestUser)) {
            return DashboardHeadlineResponse.registerInterview(requestUser);
        }

        LocalDateTime now = LocalDateTime.now();
        return interviewRepository
                .getUpcomingInterview(requestUser, now, now.plusDays(7))
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

    @Transactional(readOnly = true)
    public List<DashboardCalendarResponse> getDashboardCalendarInterviews(Integer year, Integer month) {
        User requestUser = requestUserContext.getRequestUser();

        LocalDateTime monthStart = LocalDateTime.of(year, month, 1, 0, 0, 0);
        LocalDateTime monthEnd = monthStart.plusMonths(1).minusNanos(1);
        Map<LocalDateTime, List<Interview>> interviews =
                interviewRepository.findAllByUserAndYearMonth(requestUser, monthStart, monthEnd).stream()
                        .collect(Collectors.groupingBy(Interview::getStartAt, Collectors.toList()));

        LocalDateTime now = LocalDateTime.now();
        return interviews.entrySet().stream()
                .map(entry -> DashboardCalendarResponse.of(
                        entry.getKey().toLocalDate(),
                        calculateDday(now, entry.getKey().toLocalDate()),
                        entry.getValue()))
                .toList();
    }

    private long getInterviewDday(LocalDateTime now, Interview interview) {
        return calculateDday(now, interview.getStartAt().toLocalDate());
    }

    private long calculateDday(LocalDateTime now, LocalDate targetDate) {
        return ChronoUnit.DAYS.between(now.toLocalDate(), targetDate);
    }

    private boolean existInterviewsToLog(User user) {
        return interviewRepository.existsByUserAndReviewStatusIn(user, REVIEW_NEEDED_STATUSES);
    }
}

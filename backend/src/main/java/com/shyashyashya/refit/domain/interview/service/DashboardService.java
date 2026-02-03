package com.shyashyashya.refit.domain.interview.service;

import static com.shyashyashya.refit.domain.interview.model.InterviewReviewStatus.LOG_DRAFT;
import static com.shyashyashya.refit.domain.interview.model.InterviewReviewStatus.NOT_LOGGED;
import static com.shyashyashya.refit.domain.interview.model.InterviewReviewStatus.SELF_REVIEW_DRAFT;

import com.shyashyashya.refit.domain.interview.dto.response.DashboardHeadlineResponse;
import com.shyashyashya.refit.domain.interview.dto.response.DashboardUpcomingInterviewResponse;
import com.shyashyashya.refit.domain.interview.model.Interview;
import com.shyashyashya.refit.domain.interview.model.InterviewReviewStatus;
import com.shyashyashya.refit.domain.interview.repository.InterviewRepository;
import com.shyashyashya.refit.domain.qnaset.model.QnaSet;
import com.shyashyashya.refit.domain.qnaset.repository.QnaSetRepository;
import com.shyashyashya.refit.domain.user.model.User;
import com.shyashyashya.refit.global.util.RequestUserContext;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private static final List<InterviewReviewStatus> REVIEW_NEEDED_STATUSES =
            List.of(NOT_LOGGED, LOG_DRAFT, SELF_REVIEW_DRAFT);

    private final RequestUserContext requestUserContext;
    private final InterviewRepository interviewRepository;
    private final QnaSetRepository qnaSetRepository;

    @Transactional(readOnly = true)
    public DashboardHeadlineResponse getDashboardHeadlineData() {
        User requestUser = requestUserContext.getRequestUser();

        if (!interviewRepository.existsByUser(requestUser)) {
            return DashboardHeadlineResponse.registerInterview(requestUser);
        }

        Pageable pageable = PageRequest.of(0, 1);
        LocalDateTime now = LocalDateTime.now();
        return interviewRepository.getUpcomingInterview(requestUser, now, now.plusDays(7), pageable).stream()
                .findFirst()
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
    public Page<DashboardUpcomingInterviewResponse> getUpcomingInterviews(Pageable pageable) {
        User requestUser = requestUserContext.getRequestUser();

        // TODO : 단일 쿼리로 조회해오도록 로직 수정
        LocalDateTime now = LocalDateTime.now();
        return interviewRepository.getUpcomingInterview(requestUser, now, now.plusDays(7), pageable).stream()
                .map(interview -> {
                    List<QnaSet> similarTrendQuestions = qnaSetRepository.findAllByIndustryAndJobCategory(
                            interview.getIndustry(), interview.getJobCategory());
                    List<Interview> similarInterviews = interviewRepository.findAllSimilarInterviewsByUserAndInterview(
                            requestUser, interview.getIndustry(), interview.getJobCategory());
                    return DashboardUpcomingInterviewResponse.of(interview, similarTrendQuestions, similarInterviews);
                })
                .toList();
    }

    private long getInterviewDday(LocalDateTime now, Interview interview) {
        return ChronoUnit.DAYS.between(now.toLocalDate(), interview.getStartAt().toLocalDate());
    }

    private boolean existInterviewsToLog(User user) {
        return interviewRepository.existsByUserAndReviewStatusIn(user, REVIEW_NEEDED_STATUSES);
    }
}

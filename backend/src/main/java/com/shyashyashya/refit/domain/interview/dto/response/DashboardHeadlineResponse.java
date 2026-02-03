package com.shyashyashya.refit.domain.interview.dto.response;

import com.shyashyashya.refit.domain.user.model.User;

public record DashboardHeadlineResponse(
        DashboardHeadlineType headlineType,
        String nickname,
        Long upcomingInterviewDday
) {
    public static DashboardHeadlineResponse registerInterview(User user) {
        return new DashboardHeadlineResponse(
                DashboardHeadlineType.REGISTER_INTERVIEW,
                user.getNickname(),
                null
        );
    }

    public static DashboardHeadlineResponse prepareInterview(User user, long upcomingInterviewDday) {
        return new DashboardHeadlineResponse(
                DashboardHeadlineType.PREPARE_INTERVIEW,
                user.getNickname(),
                upcomingInterviewDday
        );
    }

    public static DashboardHeadlineResponse reviewInterview(User user) {
        return new DashboardHeadlineResponse(
                DashboardHeadlineType.REVIEW_INTERVIEW,
                user.getNickname(),
                null
        );
    }

    public static DashboardHeadlineResponse checkInterviewHistory(User user) {
        return new DashboardHeadlineResponse(
                DashboardHeadlineType.CHECK_INTERVIEW_HISTORY,
                user.getNickname(),
                null
        );
    }

    private enum DashboardHeadlineType {
        REGISTER_INTERVIEW, PREPARE_INTERVIEW, REVIEW_INTERVIEW, CHECK_INTERVIEW_HISTORY
    }
}

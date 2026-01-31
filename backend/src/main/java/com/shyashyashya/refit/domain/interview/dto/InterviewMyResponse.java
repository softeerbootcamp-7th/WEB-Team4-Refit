package com.shyashyashya.refit.domain.interview.dto;

import java.util.ArrayList;
import java.util.List;

public record InterviewMyResponse(
        List<InterviewSimpleDto> logDraftInterviews,
        List<InterviewSimpleDto> selfReviewDraftInterviews,
        List<InterviewSimpleDto> debriefCompletedInterviews) {

    public static InterviewMyResponse from(List<InterviewSimpleDto> myInterviews) {
        List<InterviewSimpleDto> logDraftInterviews = new ArrayList<>();
        List<InterviewSimpleDto> selfReviewDraftInterviews = new ArrayList<>();
        List<InterviewSimpleDto> debriefCompletedInterviews = new ArrayList<>();

        for (InterviewSimpleDto myInterview : myInterviews) {
            switch (myInterview.interviewReviewStatus()) {
                case LOG_DRAFT -> logDraftInterviews.add(myInterview);
                case SELF_REVIEW_DRAFT -> selfReviewDraftInterviews.add(myInterview);
                case DEBRIEF_COMPLETED -> debriefCompletedInterviews.add(myInterview);
            }
        }

        return new InterviewMyResponse(logDraftInterviews, selfReviewDraftInterviews, debriefCompletedInterviews);
    }
}

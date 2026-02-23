package com.shyashyashya.refit.domain.interview.service.validator;

import static com.shyashyashya.refit.global.exception.ErrorCode.INTERVIEW_CONVERTING_ALREADY_COMPLETED;
import static com.shyashyashya.refit.global.exception.ErrorCode.INTERVIEW_CONVERTING_ALREADY_IN_PROGRESS;
import static com.shyashyashya.refit.global.exception.ErrorCode.INTERVIEW_NOT_ACCESSIBLE;
import static com.shyashyashya.refit.global.exception.ErrorCode.INTERVIEW_REVIEW_STATUS_VALIDATION_FAILED;

import com.shyashyashya.refit.domain.interview.model.Interview;
import com.shyashyashya.refit.domain.interview.model.InterviewConvertStatus;
import com.shyashyashya.refit.domain.interview.model.InterviewReviewStatus;
import com.shyashyashya.refit.domain.user.model.User;
import com.shyashyashya.refit.global.exception.CustomException;
import java.util.List;
import org.springframework.stereotype.Component;

@Component
public class InterviewValidator {

    public void validateInterviewOwner(Interview interview, User user) {
        if (!interview.getUser().equals(user)) {
            throw new CustomException(INTERVIEW_NOT_ACCESSIBLE);
        }
    }

    public void validateInterviewReviewStatus(Interview interview, List<InterviewReviewStatus> reviewStatuses) {
        if (!reviewStatuses.contains(interview.getReviewStatus())) {
            throw new CustomException(INTERVIEW_REVIEW_STATUS_VALIDATION_FAILED);
        }
    }

    public void validateInterviewConvertStatusIsNotConverted(Interview interview) {
        if (interview.getConvertStatus().equals(InterviewConvertStatus.IN_PROGRESS)) {
            throw new CustomException(INTERVIEW_CONVERTING_ALREADY_IN_PROGRESS);
        }
        if (interview.getConvertStatus().equals(InterviewConvertStatus.COMPLETED)) {
            throw new CustomException(INTERVIEW_CONVERTING_ALREADY_COMPLETED);
        }
    }
}

package com.shyashyashya.refit.domain.interview.service.validator;

import static com.shyashyashya.refit.global.exception.ErrorCode.INTERVIEW_NOT_ACCESSIBLE;
import static com.shyashyashya.refit.global.exception.ErrorCode.INTERVIEW_REVIEW_STATUS_IS_NOT_QNA_SET_DRAFT;

import com.shyashyashya.refit.domain.interview.model.Interview;
import com.shyashyashya.refit.domain.interview.model.InterviewReviewStatus;
import com.shyashyashya.refit.domain.user.model.User;
import com.shyashyashya.refit.global.exception.CustomException;
import org.springframework.stereotype.Component;

@Component
public class InterviewValidator {

    public void validateInterviewOwner(Interview interview, User user) {
        if (interview.getUser().equals(user)) {
            return;
        }
        throw new CustomException(INTERVIEW_NOT_ACCESSIBLE);
    }

    public void validateInterviewSReviewStatusQnaSetDraft(Interview interview) {
        if (interview.getReviewStatus().equals(InterviewReviewStatus.QNA_SET_DRAFT)) {
            return;
        }
        throw new CustomException(INTERVIEW_REVIEW_STATUS_IS_NOT_QNA_SET_DRAFT);
    }
}

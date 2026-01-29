package com.shyashyashya.refit.domain.interview.service.validator;

import static com.shyashyashya.refit.global.exception.ErrorCode.INTERVIEW_NOT_ACCESSIBLE;

import com.shyashyashya.refit.domain.interview.model.Interview;
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
}

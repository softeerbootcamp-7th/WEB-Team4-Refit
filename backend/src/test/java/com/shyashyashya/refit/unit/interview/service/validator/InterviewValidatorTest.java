package com.shyashyashya.refit.unit.interview.service.validator;

import static com.shyashyashya.refit.unit.fixture.InterviewFixture.TEST_USER_1_INTERVIEW;
import static com.shyashyashya.refit.unit.fixture.UserFixture.TEST_USER_1;
import static com.shyashyashya.refit.unit.fixture.UserFixture.TEST_USER_2;
import static com.shyashyashya.refit.global.exception.ErrorCode.INTERVIEW_NOT_ACCESSIBLE;
import static com.shyashyashya.refit.global.exception.ErrorCode.INTERVIEW_REVIEW_STATUS_VALIDATION_FAILED;

import com.shyashyashya.refit.domain.interview.model.Interview;
import com.shyashyashya.refit.domain.interview.model.InterviewReviewStatus;
import com.shyashyashya.refit.domain.interview.service.validator.InterviewValidator;
import com.shyashyashya.refit.unit.fixture.InterviewFixture;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;

public class InterviewValidatorTest {

    private final InterviewValidator interviewValidator = new InterviewValidator();

    @Test
    void 인터뷰_생성_유저와_검증_대상_유저가_같으면_검증에_성공한다() {
        // given

        // when & then
        Assertions.assertThatNoException().isThrownBy(() -> {
            interviewValidator.validateInterviewOwner(TEST_USER_1_INTERVIEW, TEST_USER_1);
        });
    }

    @Test
    void 인터뷰_생성_유저와_검증_대상_유저가_다르면_검증에_실패한다() {
        // given

        // when & then
        Assertions.assertThatThrownBy(
                        () -> interviewValidator.validateInterviewOwner(TEST_USER_1_INTERVIEW, TEST_USER_2))
                .hasMessage(INTERVIEW_NOT_ACCESSIBLE.getMessage());
    }

    @Test
    void 검증하려는_인터뷰_상태가_현재_인터뷰_상태와_동일하면_검증에_성공한다() {
        // given
        Interview interview = InterviewFixture.create_QNA_SET_DRAFT_STATUS_INTERVIEW();

        // when & then
        Assertions.assertThatNoException().isThrownBy(() -> {
            interviewValidator.validateInterviewReviewStatus(interview, InterviewReviewStatus.QNA_SET_DRAFT);
        });
    }

    @Test
    void 검증하려는_인터뷰_상태가_현재_인터뷰_상태와_다르면_검증에_실패한다() {
        // given
        Interview interview = InterviewFixture.create_NOT_LOGGED_STATUS_INTERVIEW();

        // when & then
        Assertions.assertThatThrownBy(
                () -> interviewValidator.validateInterviewReviewStatus(interview, InterviewReviewStatus.QNA_SET_DRAFT))
                .hasMessage(INTERVIEW_REVIEW_STATUS_VALIDATION_FAILED.getMessage());
    }
}

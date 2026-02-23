package com.shyashyashya.refit.unit.interview.service.validator;

import static com.shyashyashya.refit.unit.fixture.InterviewFixture.TEST_USER_1_INTERVIEW;
import static com.shyashyashya.refit.unit.fixture.UserFixture.TEST_USER_1;
import static com.shyashyashya.refit.unit.fixture.UserFixture.TEST_USER_2;
import static com.shyashyashya.refit.global.exception.ErrorCode.INTERVIEW_NOT_ACCESSIBLE;
import static com.shyashyashya.refit.global.exception.ErrorCode.INTERVIEW_REVIEW_STATUS_VALIDATION_FAILED;

import com.shyashyashya.refit.domain.interview.model.Interview;
import com.shyashyashya.refit.domain.interview.model.InterviewResultStatus;
import com.shyashyashya.refit.domain.interview.model.InterviewReviewStatus;
import com.shyashyashya.refit.domain.interview.service.validator.InterviewValidator;
import com.shyashyashya.refit.unit.fixture.InterviewFixture;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.EnumSource;

import java.util.List;

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

    @ParameterizedTest
    @EnumSource(InterviewReviewStatus.class)
    void 검증하려는_인터뷰_상태가_현재_인터뷰_상태와_동일하면_검증에_성공한다(InterviewReviewStatus reviewStatus) {
        // given
        Interview interview = InterviewFixture.createInterview(reviewStatus);

        // when & then
        Assertions.assertThatNoException().isThrownBy(() -> {
            interviewValidator.validateInterviewReviewStatus(interview, List.of(reviewStatus));
        });
    }

    @ParameterizedTest
    @EnumSource(InterviewReviewStatus.class)
    void 검증하려는_인터뷰_상태가_현재_인터뷰_상태와_다르면_검증에_실패한다(InterviewReviewStatus reviewStatus) {
        // given
        Interview interview = InterviewFixture.createInterview(reviewStatus);

        // when & then
        final InterviewReviewStatus differentStatus = reviewStatus == InterviewReviewStatus.NOT_LOGGED ?
                        InterviewReviewStatus.SELF_REVIEW_DRAFT
                : InterviewReviewStatus.NOT_LOGGED;
        Assertions.assertThatThrownBy(
                () -> interviewValidator.validateInterviewReviewStatus(interview, List.of(differentStatus)))
                .hasMessage(INTERVIEW_REVIEW_STATUS_VALIDATION_FAILED.getMessage());
    }

    @ParameterizedTest
    @EnumSource(InterviewReviewStatus.class)
    void 검증하려는_인터뷰_상태가_현재_인터뷰_상태를_포함하면_검증에_성공한다(InterviewReviewStatus reviewStatus) {
        // given
        Interview interview = InterviewFixture.createInterview(reviewStatus);

        // when & then
        Assertions.assertThatNoException().isThrownBy(() -> {
            interviewValidator.validateInterviewReviewStatus(interview,
                    List.of(reviewStatus, InterviewReviewStatus.NOT_LOGGED));
        });
    }

    @ParameterizedTest
    @EnumSource(InterviewReviewStatus.class)
    void 검증하려는_인터뷰_상태가_현재_인터뷰_상태를_포함하지_않으면_검증에_실패한다(InterviewReviewStatus reviewStatus) {
        // given
        Interview interview = InterviewFixture.createInterview(reviewStatus);

        final List<InterviewReviewStatus> differentStatuses =
                reviewStatus == InterviewReviewStatus.NOT_LOGGED || reviewStatus == InterviewReviewStatus.LOG_DRAFT
                ? List.of(InterviewReviewStatus.SELF_REVIEW_DRAFT, InterviewReviewStatus.QNA_SET_DRAFT)
                : List.of(InterviewReviewStatus.NOT_LOGGED, InterviewReviewStatus.LOG_DRAFT);

        // when & then
        Assertions.assertThatNoException().isThrownBy(() -> {
            interviewValidator.validateInterviewReviewStatus(interview,
                    List.of(reviewStatus, InterviewReviewStatus.NOT_LOGGED));
        });
    }
}

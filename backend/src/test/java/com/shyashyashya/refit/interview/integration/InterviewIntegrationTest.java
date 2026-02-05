package com.shyashyashya.refit.interview.integration;

import static com.shyashyashya.refit.domain.common.model.ResponseCode.COMMON200;
import static com.shyashyashya.refit.domain.common.model.ResponseCode.COMMON201;
import static com.shyashyashya.refit.global.exception.ErrorCode.INTERVIEW_NOT_ACCESSIBLE;
import static com.shyashyashya.refit.global.exception.ErrorCode.INTERVIEW_NOT_FOUND;
import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.notNullValue;
import static org.hamcrest.Matchers.nullValue;

import com.shyashyashya.refit.core.IntegrationTest;
import com.shyashyashya.refit.domain.interview.dto.request.InterviewCreateRequest;
import com.shyashyashya.refit.domain.interview.model.InterviewType;
import java.time.LocalDateTime;

import com.shyashyashya.refit.domain.user.model.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;

public class InterviewIntegrationTest extends IntegrationTest {

    @Nested
    class 면접_생성_시 {

        private static final String path = "/interview";

        @Test
        void 과거_면접_데이터_생성에_성공한다() {
            // given
            InterviewCreateRequest request = new InterviewCreateRequest(
                    LocalDateTime.of(2025, 12, 29, 10, 0, 0), InterviewType.FIRST, "HyunDai", 1L, 1L, "BE Developer");

            // when & then
            given(spec)
                    .body(request)
            .when()
                    .post(path)
            .then()
                    .assertThat().statusCode(200)
                    .body("code", equalTo(COMMON201.name()))
                    .body("message", equalTo(COMMON201.getMessage()))
                    .body("result", nullValue());
        }

        @Test
        void 미래_면접_데이터_생성에_성공한다() {
            // given
            InterviewCreateRequest request = new InterviewCreateRequest(
                    LocalDateTime.of(2999, 12, 31, 0, 0, 0), InterviewType.FIRST, "HyunDai", 1L, 1L, "BE Developer");

            // when & then
            given(spec)
                    .body(request)
            .when()
                    .post(path)
            .then()
                    .assertThat().statusCode(200)
                    .body("code", equalTo(COMMON201.name()))
                    .body("message", equalTo(COMMON201.getMessage()))
                    .body("result", nullValue());
        }
    }

    @Nested
    class 면접_단일_조회_시 {

        private static final String path = "/interview";
        private static Long interviewId;

        @BeforeEach
        void setUp() {
            InterviewCreateRequest request = new InterviewCreateRequest(
                    LocalDateTime.of(2025, 12, 29, 10, 0, 0), InterviewType.FIRST, "현대자동차", 1L, 1L, "BE Developer");
            interviewId = createInterview(request).getId();
        }

        @Test
        void 성공한다() {
            // when & then
            given(spec).
            when().
                    get(path + "/" + interviewId).
            then().
                    statusCode(200).
                    body("code", equalTo(COMMON200.name())).
                    body("message", equalTo(COMMON200.getMessage())).
                    body("result", notNullValue()).
                    body("result.interviewId", notNullValue());
        }

        @Test
        void 존재하지_않는_면접을_조회하면_실패한다() {
            // when & then
            given(spec).
                    when().
                    get(path + "/" + (interviewId + 1)).
                    then().
                    statusCode(404).
                    body("code", equalTo(INTERVIEW_NOT_FOUND.name())).
                    body("message", equalTo(INTERVIEW_NOT_FOUND.getMessage())).
                    body("result", nullValue());
        }

        @Test
        void 로그인한_사용자가_아닌_다른_사람의_면접을_조회하면_실패한다() {
            // given
            InterviewCreateRequest request = new InterviewCreateRequest(
                    LocalDateTime.of(2025, 12, 29, 10, 0, 0), InterviewType.FIRST, "현대자동차", 1L, 1L, "BE Developer");
            User user = createUser("other@example.com", "other", industry, jobCategory);
            Long otherInterviewId = createInterview(request, user).getId();

            // when & then
            given(spec).
            when().
                    get(path + "/" + otherInterviewId).
            then().
                    statusCode(403).
                    body("code", equalTo(INTERVIEW_NOT_ACCESSIBLE.name())).
                    body("message", equalTo(INTERVIEW_NOT_ACCESSIBLE.getMessage())).
                    body("result", nullValue());
        }
    }
}

package com.shyashyashya.refit.interview.integration;

import static com.shyashyashya.refit.domain.common.model.ResponseCode.COMMON200;
import static com.shyashyashya.refit.domain.common.model.ResponseCode.COMMON201;
import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.nullValue;

import com.shyashyashya.refit.core.IntegrationTest;
import com.shyashyashya.refit.domain.interview.dto.request.InterviewCreateRequest;
import com.shyashyashya.refit.domain.interview.model.InterviewType;
import java.time.LocalDateTime;

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
}

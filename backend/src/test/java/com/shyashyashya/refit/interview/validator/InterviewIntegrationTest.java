package com.shyashyashya.refit.interview.validator;

import com.shyashyashya.refit.core.IntegrationTest;
import com.shyashyashya.refit.domain.interview.dto.request.InterviewCreateRequest;
import com.shyashyashya.refit.domain.interview.model.InterviewType;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;

import static io.restassured.RestAssured.*;

public class InterviewIntegrationTest extends IntegrationTest {

    @Test
    void 인터뷰_생성에_성공한다() {
        // given
        InterviewCreateRequest request = new InterviewCreateRequest(
                LocalDateTime.of(2025, 12, 29, 10, 0, 0),
                InterviewType.FIRST,
                "HyunDai",
                1L,
                1L,
                "BE Developer"
        );

        // when & then
        given(spec).body(request)
        .when().post("/interview")
        .then().assertThat().statusCode(200);
    }
}

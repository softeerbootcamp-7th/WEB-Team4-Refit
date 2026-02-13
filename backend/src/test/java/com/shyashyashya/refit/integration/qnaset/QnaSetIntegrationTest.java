package com.shyashyashya.refit.integration.qnaset;

import static com.shyashyashya.refit.global.model.ResponseCode.COMMON200;
import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.in;
import static org.hamcrest.Matchers.notNullValue;

import com.shyashyashya.refit.core.IntegrationTest;
import com.shyashyashya.refit.domain.interview.dto.request.InterviewCreateRequest;
import com.shyashyashya.refit.domain.interview.dto.request.QnaSetCreateRequest;
import com.shyashyashya.refit.domain.interview.model.Interview;
import com.shyashyashya.refit.domain.interview.model.InterviewType;
import com.shyashyashya.refit.domain.interview.repository.InterviewRepository;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import java.time.LocalDateTime;

public class QnaSetIntegrationTest extends IntegrationTest {

    @Autowired
    private InterviewRepository interviewRepository;

    @Nested
    class 질답_세트_생성_시 {

        @Test
        void 인터뷰가_QNA_SET_DRAFT_상태이면_질답_세트_생성에_성공한다() {
            // given
             InterviewCreateRequest interviewCreateRequest = new InterviewCreateRequest(
                                LocalDateTime.of(2025, 12, 29, 10, 0, 0), InterviewType.FIRST, "현대자동차", 1L, 1L, "BE Developer");
            Interview interview1 = createInterview(interviewCreateRequest);
            interview1.startLogging();
            interview1.completeLogging();
            interviewRepository.save(interview1);
            QnaSetCreateRequest request = new QnaSetCreateRequest("test question text", "test answer text");

            // when & then
            given(spec)
                    .body(request)
            .when()
                    .post("/interview/" + interview1.getId() + "/qna-set")
            .then()
                    .statusCode(200)
                    .body("code", equalTo(COMMON200.name()))
                    .body("message", equalTo(COMMON200.getMessage()))
                    .body("result", notNullValue())
                    .body("result.qnaSetId", notNullValue());
        }

    }

//    @Nested
//    class 어려웠던_질문_마킹_해제_시 {
//
//        private static final String path = "/qna-set";
//        private Long qnaSetId;
//
//        @BeforeEach
//        void setUp() {
//
//        }
//
//        @Test
//        void 어려웠던_질문_마킹에_성공한다() {
//            // given
//
//
//            // when & then
//            given(spec).
//            when().
//                    patch(path + "/" + qnaSetId).
//            then().
//                    statusCode(200).
//                    body("code", equalTo(COMMON200.name())).
//                    body("message", equalTo(COMMON200.getMessage())).
//                    body("result", nullValue());
//        }
//    }
}

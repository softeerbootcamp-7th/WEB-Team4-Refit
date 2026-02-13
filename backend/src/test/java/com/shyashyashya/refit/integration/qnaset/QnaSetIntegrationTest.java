package com.shyashyashya.refit.integration.qnaset;

import static com.shyashyashya.refit.global.exception.ErrorCode.INTERVIEW_REVIEW_STATUS_IS_NOT_QNA_SET_DRAFT;
import static com.shyashyashya.refit.global.model.ResponseCode.COMMON200;
import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.in;
import static org.hamcrest.Matchers.notNullValue;
import static org.hamcrest.Matchers.nullValue;

import com.shyashyashya.refit.core.IntegrationTest;
import com.shyashyashya.refit.domain.interview.dto.request.InterviewCreateRequest;
import com.shyashyashya.refit.domain.interview.dto.request.QnaSetCreateRequest;
import com.shyashyashya.refit.domain.interview.model.Interview;
import com.shyashyashya.refit.domain.interview.model.InterviewType;
import com.shyashyashya.refit.domain.interview.repository.InterviewRepository;
import com.shyashyashya.refit.domain.qnaset.model.QnaSet;
import org.junit.jupiter.api.BeforeEach;
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

        @Test
        void 인터뷰가_QNA_SET_DRAFT_상태가_아니라면_질답_세트_생성에_성공한다() {
            // given
            InterviewCreateRequest interviewCreateRequest = new InterviewCreateRequest(
                    LocalDateTime.of(2025, 12, 29, 10, 0, 0), InterviewType.FIRST, "현대자동차", 1L, 1L, "BE Developer");
            Interview interview1 = createInterview(interviewCreateRequest);
            QnaSetCreateRequest request = new QnaSetCreateRequest("test question text", "test answer text");

            // when & then
            given(spec)
                    .body(request)
                    .when()
                    .post("/interview/" + interview1.getId() + "/qna-set")
                    .then()
                    .statusCode(400)
                    .body("code", equalTo(INTERVIEW_REVIEW_STATUS_IS_NOT_QNA_SET_DRAFT.name()))
                    .body("message", equalTo(INTERVIEW_REVIEW_STATUS_IS_NOT_QNA_SET_DRAFT.getMessage()))
                    .body("result", nullValue());
        }
    }

    @Nested
    class 어려웠던_질문_마킹_시 {

        private Interview interview;
        private Long qnaSetId;

        @BeforeEach
        void setUp() {
            InterviewCreateRequest interviewCreateRequest = new InterviewCreateRequest(
                    LocalDateTime.of(2025, 12, 29, 10, 0, 0), InterviewType.FIRST, "현대자동차", 1L, 1L, "BE Developer");
            interview = createInterview(interviewCreateRequest);

            QnaSetCreateRequest qnaSetCreateRequest = new QnaSetCreateRequest ("test qqq text", "test aaa text");
            QnaSet qnaSet = createQnaSet(qnaSetCreateRequest, interview, false);
            qnaSetId = qnaSet.getId();
        }

        @Test
        void 어려웠던_질문_마킹에_성공한다() {
            // given

            // when & then
            given(spec).
            when().
                    patch("/qna-set/" + qnaSetId + "/difficult/mark").
            then().
                    statusCode(200).
                    body("code", equalTo(COMMON200.name())).
                    body("message", equalTo(COMMON200.getMessage())).
                    body("result", nullValue());
        }

        @Test
        void 어려웠던_질문_마킹_해제에_성공한다() {
            // given

            // when & then
            given(spec).
            when().
                    patch("/qna-set/" + qnaSetId + "/difficult/unmark").
            then().
                    statusCode(200).
                    body("code", equalTo(COMMON200.name())).
                    body("message", equalTo(COMMON200.getMessage())).
                    body("result", nullValue());
        }
    }
}

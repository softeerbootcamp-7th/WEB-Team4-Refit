package com.shyashyashya.refit.qnaset.integration;

import static com.shyashyashya.refit.global.exception.ErrorCode.INDUSTRY_PARTIALLY_NOT_FOUND;
import static com.shyashyashya.refit.global.exception.ErrorCode.JOB_CATEGORY_PARTIALLY_NOT_FOUND;
import static com.shyashyashya.refit.global.model.ResponseCode.COMMON200;
import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.containsInAnyOrder;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.notNullValue;
import static org.hamcrest.Matchers.nullValue;

import com.shyashyashya.refit.core.IntegrationTest;
import com.shyashyashya.refit.domain.interview.dto.request.InterviewCreateRequest;
import com.shyashyashya.refit.domain.interview.model.Interview;
import com.shyashyashya.refit.domain.interview.model.InterviewType;
import com.shyashyashya.refit.domain.qnaset.model.QnaSet;

import java.time.LocalDateTime;
import java.util.List;

import com.shyashyashya.refit.domain.qnaset.repository.QnaSetRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

public class QnaSetIntegrationTest extends IntegrationTest {

    @Autowired
    private QnaSetRepository qnaSetRepository;

    @Nested
    class 자주_묻는_질문_조회_시 {

        private static final String path = "/qna-set/frequent";

        private Interview interview1;
        private Interview interview2;
        private Interview interview3;
        private Interview interview4;

        private QnaSet qnaSet1;
        private QnaSet qnaSet2;
        private QnaSet qnaSet3;
        private QnaSet qnaSet4;
        private QnaSet qnaSet5;
        private QnaSet qnaSet6;

        @BeforeEach
        void setUp() {
            var request1 = new InterviewCreateRequest(
                    LocalDateTime.of(2025, 12, 29, 10, 0, 0), InterviewType.FIRST, "현대자동차", 1L, 1L, "BE Developer");
            interview1 = createAndSaveInterview(request1);

            var request2 = new InterviewCreateRequest(
                    LocalDateTime.of(2025, 12, 29, 10, 0, 0), InterviewType.FIRST, "현대자동차", 2L, 2L, "BE Developer");
            interview2 = createAndSaveInterview(request2);

            var request3 = new InterviewCreateRequest(
                    LocalDateTime.of(2025, 12, 30, 10, 0, 0), InterviewType.FIRST, "카카오", 1L, 3L, "FE Developer");
            interview3 = createAndSaveInterview(request3);

            var request4 = new InterviewCreateRequest(
                    LocalDateTime.of(2025, 12, 31, 10, 0, 0), InterviewType.FIRST, "네이버", 3L, 1L, "Android Developer");
            interview4 = createAndSaveInterview(request4);


            qnaSet1 = QnaSet.create("팀원과 갈등이 발생했을 때 해결한 경험을 알려주세요.", "답변1", true, interview1, null);
            qnaSet2 = QnaSet.create("IoC 컨테이너에 대해 설명해주세요.", "답변2", true, interview1, null);
            qnaSet3 = QnaSet.create("자신의 장점과 단점에 대해 말해주세요.", "답변3", false, interview2, null);
            qnaSet4 = QnaSet.create("지원 동기를 말씀해주세요.", "답변4", false, interview2, null);
            qnaSet5 = QnaSet.create("MSA에 대해 아는 대로 설명해주세요.", "답변5", true, interview3, null);
            qnaSet6 = QnaSet.create("DI에 대해 설명해주세요.", "답변6", true, interview4, null);

            qnaSetRepository.saveAll(List.of(qnaSet1, qnaSet2, qnaSet3, qnaSet4, qnaSet5, qnaSet6));
        }

        @Test
        void 산업군과_직무를_하나씩_지정했을_때_조회에_성공한다() {
            // when & then
            given(spec)
                    .queryParam("industryIds", 1L)
                    .queryParam("jobCategoryIds", 1L)
            .when()
                    .get(path)
            .then()
                    .assertThat().statusCode(200)
                    .body("code", equalTo(COMMON200.name()))
                    .body("message", equalTo(COMMON200.getMessage()))
                    .body("result.content", hasSize(2))
                    .body("result.totalElements", equalTo(2))
                    .body("result.content[0].industryName", equalTo(interview1.getIndustry().getName()))
                    .body("result.content[0].jobCategoryName", equalTo(interview1.getJobCategory().getName()))
                    .body("result.content[0].interviewType", equalTo(interview1.getInterviewType().toString()))
                    .body("result.content[0].interviewStartAt", equalTo(interview1.getStartAt().format(TIME_FORMATTER)))
                    .body("result.content[0].question", equalTo(qnaSet1.getQuestionText()))
                    .body("result.content[1].industryName", equalTo(interview1.getIndustry().getName()))
                    .body("result.content[1].jobCategoryName", equalTo(interview1.getJobCategory().getName()))
                    .body("result.content[1].interviewType", equalTo(interview1.getInterviewType().toString()))
                    .body("result.content[1].interviewStartAt", equalTo(interview1.getStartAt().format(TIME_FORMATTER)))
                    .body("result.content[1].question", equalTo(qnaSet2.getQuestionText()));
        }

        @Test
        void 산업군과_직무를_여러개_지정했을_때_조회에_성공한다() {
            // when & then
            given(spec)
                    .queryParam("industryIds", 1L, 2L)
                    .queryParam("jobCategoryIds", 1L, 2L)
            .when()
                    .get(path)
            .then()
                    .statusCode(200)
                    .body("code", equalTo(COMMON200.name()))
                    .body("message", equalTo(COMMON200.getMessage()))
                    .body("result.content", hasSize(4))
                    .body("result.totalElements", equalTo(4))
                    .body("result.content*.question", containsInAnyOrder(
                            qnaSet1.getQuestionText(),
                            qnaSet2.getQuestionText(),
                            qnaSet3.getQuestionText(),
                            qnaSet4.getQuestionText()
                    ));
        }

        @Test
        void 아무런_필터링_조건도_제공하지_않았을_때_모든_자주_묻는_질문을_조회한다() {
            // when & then
            given(spec)
            .when()
                    .get(path)
            .then()
                    .assertThat().statusCode(200)
                    .body("code", equalTo(COMMON200.name()))
                    .body("message", equalTo(COMMON200.getMessage()))
                    .body("result.content", hasSize(6))
                    .body("result.totalElements", equalTo(6))
                    .body("result.content*.question", containsInAnyOrder(
                            qnaSet1.getQuestionText(),
                            qnaSet2.getQuestionText(),
                            qnaSet3.getQuestionText(),
                            qnaSet4.getQuestionText(),
                            qnaSet5.getQuestionText(),
                            qnaSet6.getQuestionText()
                    ));
        }

        @Test
        void 산업군만_지정했을_때_자주_묻는_질문_조회에_성공한다() {
            // when & then
            given(spec)
                    .queryParam("industryIds", 1L)
            .when()
                    .get(path)
            .then()
                    .assertThat().statusCode(200)
                    .body("code", equalTo(COMMON200.name()))
                    .body("message", equalTo(COMMON200.getMessage()))
                    .body("result.content", hasSize(3))
                    .body("result.totalElements", equalTo(3))
                    .body("result.content*.question", containsInAnyOrder(
                            qnaSet1.getQuestionText(),
                            qnaSet2.getQuestionText(),
                            qnaSet5.getQuestionText()
                    ));
        }

        @Test
        void 산업군_ID가_중복되어도_자주_묻는_질문_조회에_성공한다() {
            // when & then
            given(spec)
                    .queryParam("industryIds", 1L, 1L, 1L)
            .when()
                    .get(path)
            .then()
                    .assertThat().statusCode(200)
                    .body("code", equalTo(COMMON200.name()))
                    .body("message", equalTo(COMMON200.getMessage()))
                    .body("result.content", hasSize(3))
                    .body("result.totalElements", equalTo(3))
                    .body("result.content*.question", containsInAnyOrder(
                            qnaSet1.getQuestionText(),
                            qnaSet2.getQuestionText(),
                            qnaSet5.getQuestionText()
                    ));
        }

        @Test
        void 직무만_지정했을_때_자주_묻는_질문_조회에_성공한다() {
            // when & then
            given(spec)
                    .queryParam("jobCategoryIds", 1L)
            .when()
                    .get(path)
            .then()
                    .assertThat().statusCode(200)
                    .body("code", equalTo(COMMON200.name()))
                    .body("message", equalTo(COMMON200.getMessage()))
                    .body("result.content", hasSize(3))
                    .body("result.totalElements", equalTo(3))
                    .body("result.content*.question", containsInAnyOrder(
                            qnaSet1.getQuestionText(),
                            qnaSet2.getQuestionText(),
                            qnaSet6.getQuestionText())
                    );
        }

        @Test
        void 직무_ID가_중복되어도_자주_묻는_질문_조회에_성공한다() {
            // when & then
            given(spec)
                    .queryParam("jobCategoryIds", 1L, 1L, 1L)
                    .when()
                    .get(path)
                    .then()
                    .assertThat().statusCode(200)
                    .body("code", equalTo(COMMON200.name()))
                    .body("message", equalTo(COMMON200.getMessage()))
                    .body("result.content", hasSize(3))
                    .body("result.totalElements", equalTo(3))
                    .body("result.content*.question", containsInAnyOrder(
                            qnaSet1.getQuestionText(),
                            qnaSet2.getQuestionText(),
                            qnaSet6.getQuestionText())
                    );
        }

        @Test
        void 존재하지_않는_산업군_ID로_조회했을_때_404_에러가_발생한다() {
            // when & then
            given(spec)
                    .queryParam("industryIds", 999L)
            .when()
                    .get(path)
            .then()
                    .assertThat().statusCode(INDUSTRY_PARTIALLY_NOT_FOUND.getHttpStatus().value())
                    .body("code", equalTo(INDUSTRY_PARTIALLY_NOT_FOUND.name()))
                    .body("message", equalTo(INDUSTRY_PARTIALLY_NOT_FOUND.getMessage()))
                    .body("result", nullValue());
        }

        @Test
        void 존재하지_않는_직무_ID로_조회했을_때_404_에러가_발생한다() {
            // when & then
            given(spec)
                    .queryParam("jobCategoryIds", 999L)
            .when()
                    .get(path)
            .then()
                    .assertThat().statusCode(JOB_CATEGORY_PARTIALLY_NOT_FOUND.getHttpStatus().value())
                    .body("code", equalTo(JOB_CATEGORY_PARTIALLY_NOT_FOUND.name()))
                    .body("message", equalTo(JOB_CATEGORY_PARTIALLY_NOT_FOUND.getMessage()))
                    .body("result", nullValue());
        }

        @Test
        void 산업군에_존재하는_ID와_존재하지_않는_ID를_혼합하여_조회했을_때_404에러가_발생한다() {
            // when & then
            given(spec)
                    .queryParam("industryIds", 1L, 999L)
                    .queryParam("jobCategoryIds", 1L)
            .when()
                    .get(path)
            .then()
                    .assertThat().statusCode(INDUSTRY_PARTIALLY_NOT_FOUND.getHttpStatus().value())
                    .body("code", equalTo(INDUSTRY_PARTIALLY_NOT_FOUND.name()))
                    .body("message", equalTo(INDUSTRY_PARTIALLY_NOT_FOUND.getMessage()))
                    .body("result", nullValue());
        }

        @Test
        void 직군에_존재하는_ID와_존재하지_않는_ID를_혼합하여_조회했을_때_404에러가_발생한다() {
            // when & then
            given(spec)
                    .queryParam("industryIds", 1L)
                    .queryParam("jobCategoryIds", 1L, 999L)
            .when()
                    .get(path)
            .then()
                    .assertThat().statusCode(JOB_CATEGORY_PARTIALLY_NOT_FOUND.getHttpStatus().value())
                    .body("code", equalTo(JOB_CATEGORY_PARTIALLY_NOT_FOUND.name()))
                    .body("message", equalTo(JOB_CATEGORY_PARTIALLY_NOT_FOUND.getMessage()))
                    .body("result", nullValue());
        }

        @Test
        void 질문이_없을_경우_빈_리스트를_반환한다() {
            // given
            qnaSetRepository.deleteAll();

            // when & then
            given(spec)
            .when()
                    .get(path)
            .then()
                    .assertThat().statusCode(200)
                    .body("code", equalTo(COMMON200.name()))
                    .body("message", equalTo(COMMON200.getMessage()))
                    .body("result", notNullValue())
                    .body("result.content", hasSize(0));
        }
    }
}


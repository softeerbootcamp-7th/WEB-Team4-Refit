package com.shyashyashya.refit.interview.integration;

import static com.shyashyashya.refit.global.exception.ErrorCode.INTERVIEW_REVIEW_STATUS_VALIDATION_FAILED;
import static com.shyashyashya.refit.global.model.ResponseCode.COMMON200;
import static com.shyashyashya.refit.global.model.ResponseCode.COMMON201;
import static com.shyashyashya.refit.global.model.ResponseCode.COMMON204;
import static com.shyashyashya.refit.global.exception.ErrorCode.INTERVIEW_NOT_ACCESSIBLE;
import static com.shyashyashya.refit.global.exception.ErrorCode.INTERVIEW_NOT_FOUND;
import static io.restassured.RestAssured.given;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.notNullValue;
import static org.hamcrest.Matchers.nullValue;

import com.shyashyashya.refit.core.IntegrationTest;
import com.shyashyashya.refit.domain.interview.dto.request.InterviewCreateRequest;
import com.shyashyashya.refit.domain.interview.dto.request.InterviewResultStatusUpdateRequest;
import com.shyashyashya.refit.domain.interview.dto.request.QnaSetCreateRequest;
import com.shyashyashya.refit.domain.interview.dto.request.RawTextUpdateRequest;
import com.shyashyashya.refit.domain.interview.dto.request.KptSelfReviewUpdateRequest;
import com.shyashyashya.refit.domain.interview.model.Interview;
import com.shyashyashya.refit.domain.interview.model.InterviewReviewStatus;
import com.shyashyashya.refit.domain.interview.model.InterviewType;
import com.shyashyashya.refit.domain.interview.model.InterviewResultStatus;
import com.shyashyashya.refit.domain.interview.model.InterviewSelfReview;
import com.shyashyashya.refit.domain.interview.repository.InterviewSelfReviewRepository;
import java.time.LocalDateTime;
import java.util.List;

import com.shyashyashya.refit.domain.interview.repository.InterviewRepository;
import com.shyashyashya.refit.domain.qnaset.model.QnaSet;
import com.shyashyashya.refit.domain.qnaset.model.QnaSetCategory;
import com.shyashyashya.refit.domain.qnaset.repository.QnaSetRepository;
import com.shyashyashya.refit.domain.qnaset.repository.QnaSetCategoryRepository;
import com.shyashyashya.refit.domain.user.model.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.EnumSource;
import org.springframework.beans.factory.annotation.Autowired;

public class InterviewIntegrationTest extends IntegrationTest {

    @Autowired
    private QnaSetRepository qnaSetRepository;

    @Autowired
    private QnaSetCategoryRepository qnaSetCategoryRepository;

    @Autowired
    private InterviewRepository interviewRepository;

    @Autowired
    private InterviewSelfReviewRepository interviewSelfReviewRepository;

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
        private Long interviewId;

        @BeforeEach
        void setUp() {
            InterviewCreateRequest request = new InterviewCreateRequest(
                    LocalDateTime.of(2025, 12, 29, 10, 0, 0), InterviewType.FIRST, "현대자동차", 1L, 1L, "BE Developer");
            interviewId = createAndSaveInterview(request).getId();
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
            User user = createAndSaveUser("other@example.com", "other", industry1, jobCategory1);
            Long otherInterviewId = createAndSaveInterview(request, InterviewReviewStatus.NOT_LOGGED, user).getId();

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

    @Nested
    class 면접_삭제_시 {

        private static final String path = "/interview";
        private Long interviewId;

        @BeforeEach
        void setUp() {
            InterviewCreateRequest request = new InterviewCreateRequest(
                    LocalDateTime.of(2025, 12, 29, 10, 0, 0), InterviewType.FIRST, "현대자동차", 1L, 1L, "BE Developer");
            interviewId = createAndSaveInterview(request).getId();
        }

        @Test
        void 성공한다() {
            // when & then
            given(spec)
            .when()
                    .delete(path + "/" + interviewId)
            .then()
                    .assertThat().statusCode(200)
                    .body("code", equalTo(COMMON204.name()))
                    .body("message", equalTo(COMMON204.getMessage()))
                    .body("result", nullValue());
        }

        @Test
        void 존재하지_않는_면접을_삭제하면_실패한다() {
            // when & then
            given(spec)
            .when()
                    .delete(path + "/" + (interviewId + 1))
            .then()
                    .assertThat().statusCode(404)
                    .body("code", equalTo(INTERVIEW_NOT_FOUND.name()))
                    .body("message", equalTo(INTERVIEW_NOT_FOUND.getMessage()))
                    .body("result", nullValue());
        }

        @Test
        void 로그인한_사용자가_아닌_다른_사람의_면접을_삭제하면_실패한다() {
            // given
            InterviewCreateRequest request = new InterviewCreateRequest(
                    LocalDateTime.of(2025, 12, 29, 10, 0, 0), InterviewType.FIRST, "현대자동차", 1L, 1L, "BE Developer");
            User user = createAndSaveUser("other@example.com", "other", industry1, jobCategory1);
            Long otherInterviewId = createAndSaveInterview(request, InterviewReviewStatus.NOT_LOGGED, user).getId();

            // when & then
            given(spec)
            .when()
                    .delete(path + "/" + otherInterviewId)
            .then()
                    .assertThat().statusCode(403)
                    .body("code", equalTo(INTERVIEW_NOT_ACCESSIBLE.name()))
                    .body("message", equalTo(INTERVIEW_NOT_ACCESSIBLE.getMessage()))
                    .body("result", nullValue());
        }
    }

    @Nested
    class 면접_결과_상태_업데이트_시 {

        private static final String path = "/interview";
        private Long interviewId;

        @BeforeEach
        void setUp() {
            InterviewCreateRequest request = new InterviewCreateRequest(
                    LocalDateTime.of(2025, 12, 29, 10, 0, 0), InterviewType.FIRST, "현대자동차", 1L, 1L, "BE Developer");
            interviewId = createAndSaveInterview(request).getId();
        }

        @Test
        void 성공한다() {
            // given
            InterviewResultStatusUpdateRequest request = new InterviewResultStatusUpdateRequest(InterviewResultStatus.PASS);

            // when & then
            given(spec)
                    .body(request)
            .when()
                    .patch(path + "/" + interviewId + "/result-status")
            .then()
                    .assertThat().statusCode(200)
                    .body("code", equalTo(COMMON200.name()))
                    .body("message", equalTo(COMMON200.getMessage()))
                    .body("result", nullValue());
        }

        @Test
        void 존재하지_않는_면접의_결과_상태를_업데이트하면_실패한다() {
            // given
            InterviewResultStatusUpdateRequest request = new InterviewResultStatusUpdateRequest(InterviewResultStatus.FAIL);

            // when & then
            given(spec)
                    .body(request)
            .when()
                    .patch(path + "/" + (interviewId + 1) + "/result-status")
            .then()
                    .assertThat().statusCode(404)
                    .body("code", equalTo(INTERVIEW_NOT_FOUND.name()))
                    .body("message", equalTo(INTERVIEW_NOT_FOUND.getMessage()))
                    .body("result", nullValue());
        }

        @Test
        void 로그인한_사용자가_아닌_다른_사람의_면접_결과_상태를_업데이트하면_실패한다() {
            // given
            InterviewCreateRequest createRequest = new InterviewCreateRequest(
                    LocalDateTime.of(2025, 12, 29, 10, 0, 0), InterviewType.FIRST, "현대자동차", 1L, 1L, "BE Developer");
            User user = createAndSaveUser("other@example.com", "other", industry1, jobCategory1);
            Long otherInterviewId = createAndSaveInterview(createRequest, InterviewReviewStatus.NOT_LOGGED, user).getId();
            InterviewResultStatusUpdateRequest updateRequest = new InterviewResultStatusUpdateRequest(InterviewResultStatus.PASS);

            // when & then
            given(spec)
                    .body(updateRequest)
            .when()
                    .patch(path + "/" + otherInterviewId + "/result-status")
            .then()
                    .assertThat().statusCode(403)
                    .body("code", equalTo(INTERVIEW_NOT_ACCESSIBLE.name()))
                    .body("message", equalTo(INTERVIEW_NOT_ACCESSIBLE.getMessage()))
                    .body("result", nullValue());
        }
    }

    @Nested
    class 면접_전체_상세_정보_조회_시 {

        private static final String path = "/interview";
        private Long interviewId;
        private QnaSetCategory qnaSetCategory;
        private List<QnaSet> qnaSets;

        @BeforeEach
        void setUp() {
            InterviewCreateRequest request = new InterviewCreateRequest(
                    LocalDateTime.of(2025, 12, 29, 10, 0, 0), InterviewType.FIRST, "현대자동차", 1L, 1L, "BE Developer");
            Interview interview = createAndSaveInterview(request);
            interviewId = interview.getId();

            // Create QnaSetCategory
            qnaSetCategory = qnaSetCategoryRepository.save(
                    QnaSetCategory.create("기술 면접", "기술 관련 질문입니다.", 0.8));

            // Create QnaSets and associate them with the Interview and QnaSetCategory
            QnaSet qnaSet1 = QnaSet.create("질문1", "답변1", false, interview, qnaSetCategory);
            QnaSet qnaSet2 = QnaSet.create("질문2", "답변2", true, interview, qnaSetCategory);
            qnaSets = qnaSetRepository.saveAll(List.of(qnaSet1, qnaSet2));
        }

        @Test
        void 성공한다() {
            // when & then
            given(spec).
            when().
                    get(path + "/" + interviewId + "/qna-sets").
            then().
                    assertThat().statusCode(200).
                    body("code", equalTo(COMMON200.name())).
                    body("message", equalTo(COMMON200.getMessage())).
                    body("result", notNullValue()).
                    body("result.interviewId", equalTo(interviewId.intValue())).
                    body("result.qnaSets.size()", equalTo(qnaSets.size())).
                    body("result.qnaSets[0].questionText", equalTo(qnaSets.get(0).getQuestionText())).
                    body("result.qnaSets[0].answerText", equalTo(qnaSets.get(0).getAnswerText())).
                    body("result.qnaSets[1].questionText", equalTo(qnaSets.get(1).getQuestionText())).
                    body("result.qnaSets[1].answerText", equalTo(qnaSets.get(1).getAnswerText()));
        }

        @Test
        void 존재하지_않는_면접의_전체_상세_정보를_조회하면_실패한다() {
            // when & then
            given(spec).
            when().
                    get(path + "/" + (interviewId + 1) + "/qna-sets").
            then().
                    assertThat().statusCode(404).
                    body("code", equalTo(INTERVIEW_NOT_FOUND.name())).
                    body("message", equalTo(INTERVIEW_NOT_FOUND.getMessage())).
                    body("result", nullValue());
        }

        @Test
        void 로그인한_사용자가_아닌_다른_사람의_면접_전체_상세_정보를_조회하면_실패한다() {
            // given
            InterviewCreateRequest createRequest = new InterviewCreateRequest(
                    LocalDateTime.of(2025, 12, 29, 10, 0, 0), InterviewType.FIRST, "현대자동차", 1L, 1L, "BE Developer");
            User user = createAndSaveUser("other@example.com", "other", industry1, jobCategory1);
            Long otherInterviewId = createAndSaveInterview(createRequest, InterviewReviewStatus.NOT_LOGGED, user).getId();

            // when & then
            given(spec).
            when().
                    get(path + "/" + otherInterviewId + "/qna-sets").
            then().
                    assertThat().statusCode(403).
                    body("code", equalTo(INTERVIEW_NOT_ACCESSIBLE.name())).
                    body("message", equalTo(INTERVIEW_NOT_ACCESSIBLE.getMessage())).
                    body("result", nullValue());
        }
    }

    @Nested
    class 면접_가이드_질문_조회_시 {

        private static final String path = "/interview";
        private Long interviewId;

        @BeforeEach
        void setUp() {
            InterviewCreateRequest request = new InterviewCreateRequest(
                    LocalDateTime.of(2025, 12, 29, 10, 0, 0), InterviewType.FIRST, "현대자동차", 1L, 1L, "BE Developer");
            interviewId = createAndSaveInterview(request, InterviewReviewStatus.LOG_DRAFT).getId();
        }

        @Test
        void 성공한다() {
            // when & then
            given(spec)
            .when()
                    .get(path + "/" + interviewId + "/guide-question")
            .then()
                    .assertThat().statusCode(200)
                    .body("code", equalTo(COMMON200.name()))
                    .body("message", equalTo(COMMON200.getMessage()))
                    .body("result", notNullValue())
                    .body("result.guideQuestion", notNullValue());
        }

        @Test
        void 존재하지_않는_면접의_가이드_질문을_조회하면_실패한다() {
            // when & then
            given(spec)
            .when()
                    .get(path + "/" + (interviewId + 1) + "/guide-question")
            .then()
                    .assertThat().statusCode(404)
                    .body("code", equalTo(INTERVIEW_NOT_FOUND.name()))
                    .body("message", equalTo(INTERVIEW_NOT_FOUND.getMessage()))
                    .body("result", nullValue());
        }

        @Test
        void 로그인한_사용자가_아닌_다른_사람의_면접_가이드_질문을_조회하면_실패한다() {
            // given
            InterviewCreateRequest createRequest = new InterviewCreateRequest(
                    LocalDateTime.of(2025, 12, 29, 10, 0, 0), InterviewType.FIRST, "현대자동차", 1L, 1L, "BE Developer");
            User user = createAndSaveUser("other@example.com", "other", industry1, jobCategory1);
            Long otherInterviewId = createAndSaveInterview(createRequest, InterviewReviewStatus.NOT_LOGGED, user).getId();

            // when & then
            given(spec)
            .when()
                    .get(path + "/" + otherInterviewId + "/guide-question")
            .then()
                    .assertThat().statusCode(403)
                    .body("code", equalTo(INTERVIEW_NOT_ACCESSIBLE.name()))
                    .body("message", equalTo(INTERVIEW_NOT_ACCESSIBLE.getMessage()))
                    .body("result", nullValue());
        }

        @ParameterizedTest
        @EnumSource(value = InterviewReviewStatus.class, names = { "NOT_LOGGED", "QNA_SET_DRAFT", "SELF_REVIEW_DRAFT", "DEBRIEF_COMPLETED" })
        void 면접_상태가_기록중이_아닐_때_가이드_질문을_조회하면_실패한다(InterviewReviewStatus status) {
            // given
            var createRequest = new InterviewCreateRequest(
                    LocalDateTime.of(2025, 12, 29, 10, 0, 0), InterviewType.FIRST, "현대자동차", 1L, 1L, "BE Developer");
            Interview invalidInterview = createAndSaveInterview(createRequest, status);

            // when & then
            given(spec)
            .when()
                    .get(path + "/" + invalidInterview.getId() + "/guide-question")
            .then()
                    .assertThat().statusCode(INTERVIEW_REVIEW_STATUS_VALIDATION_FAILED.getHttpStatus().value())
                    .body("code", equalTo(INTERVIEW_REVIEW_STATUS_VALIDATION_FAILED.name()))
                    .body("message", equalTo(INTERVIEW_REVIEW_STATUS_VALIDATION_FAILED.getMessage()))
                    .body("result", nullValue());
        }
    }

    @Nested
    class 면접_기록_원문_텍스트_업데이트_시 {

        private static final String path = "/interview";
        private Long interviewId;

        @BeforeEach
        void setUp() {
            InterviewCreateRequest request = new InterviewCreateRequest(
                    LocalDateTime.of(2025, 12, 29, 10, 0, 0), InterviewType.FIRST, "현대자동차", 1L, 1L, "BE Developer");
            interviewId = createAndSaveInterview(request, InterviewReviewStatus.LOG_DRAFT).getId();
        }

        @Test
        void 성공한다() {
            // given
            RawTextUpdateRequest request = new RawTextUpdateRequest("Updated raw text content.");

            // when & then
            given(spec)
                    .body(request)
            .when()
                    .put(path + "/" + interviewId + "/raw-text")
            .then()
                    .assertThat().statusCode(200)
                    .body("code", equalTo(COMMON200.name()))
                    .body("message", equalTo(COMMON200.getMessage()))
                    .body("result", nullValue());
        }

        @Test
        void 존재하지_않는_면접의_원문_텍스트를_업데이트하면_실패한다() {
            // given
            RawTextUpdateRequest request = new RawTextUpdateRequest("Updated raw text content.");

            // when & then
            given(spec)
                    .body(request)
            .when()
                    .put(path + "/" + (interviewId + 1) + "/raw-text")
            .then()
                    .assertThat().statusCode(404)
                    .body("code", equalTo(INTERVIEW_NOT_FOUND.name()))
                    .body("message", equalTo(INTERVIEW_NOT_FOUND.getMessage()))
                    .body("result", nullValue());
        }

        @Test
        void 로그인한_사용자가_아닌_다른_사람의_면접_원문_텍스트를_업데이트하면_실패한다() {
            // given
            InterviewCreateRequest createRequest = new InterviewCreateRequest(
                    LocalDateTime.of(2025, 12, 29, 10, 0, 0), InterviewType.FIRST, "현대자동차", 1L, 1L, "BE Developer");
            User user = createAndSaveUser("other@example.com", "other", industry1, jobCategory1);
            Long otherInterviewId = createAndSaveInterview(createRequest, InterviewReviewStatus.NOT_LOGGED, user).getId();
            RawTextUpdateRequest updateRequest = new RawTextUpdateRequest("Raw text for another user.");

            // when & then
            given(spec)
                    .body(updateRequest)
            .when()
                    .put(path + "/" + otherInterviewId + "/raw-text")
            .then()
                    .assertThat().statusCode(403)
                    .body("code", equalTo(INTERVIEW_NOT_ACCESSIBLE.name()))
                    .body("message", equalTo(INTERVIEW_NOT_ACCESSIBLE.getMessage()))
                    .body("result", nullValue());
        }

        @ParameterizedTest
        @EnumSource(value = InterviewReviewStatus.class, names = { "NOT_LOGGED", "QNA_SET_DRAFT", "SELF_REVIEW_DRAFT", "DEBRIEF_COMPLETED" })
        void 면접_상태가_기록중이_아닐_때_원문_텍스트를_업데이트하면_실패한다(InterviewReviewStatus status) {
            // given
            var createRequest = new InterviewCreateRequest(
                    LocalDateTime.of(2025, 12, 29, 10, 0, 0), InterviewType.FIRST, "현대자동차", 1L, 1L, "BE Developer");
            Interview invalidInterview = createAndSaveInterview(createRequest, status);

            RawTextUpdateRequest request = new RawTextUpdateRequest("Updated raw text content.");

            // when & then
            given(spec)
                    .body(request)
            .when()
                    .put(path + "/" + invalidInterview.getId() + "/raw-text")
            .then()
                    .assertThat().statusCode(INTERVIEW_REVIEW_STATUS_VALIDATION_FAILED.getHttpStatus().value())
                    .body("code", equalTo(INTERVIEW_REVIEW_STATUS_VALIDATION_FAILED.name()))
                    .body("message", equalTo(INTERVIEW_REVIEW_STATUS_VALIDATION_FAILED.getMessage()))
                    .body("result", nullValue());
        }
    }

    @Nested
    class 면접_KPT_회고_업데이트_시 {

        private static final String path = "/interview";
        private Long interviewId;

        @BeforeEach
        void setUp() {
            InterviewCreateRequest request = new InterviewCreateRequest(
                    LocalDateTime.of(2025, 12, 29, 10, 0, 0), InterviewType.FIRST, "현대자동차", 1L, 1L, "BE Developer");
            Interview interview = createAndSaveInterview(request, InterviewReviewStatus.SELF_REVIEW_DRAFT);
            interviewId = interview.getId();
        }

        @Test
        void KPT_회고_업데이트에_성공한다() {
            // given
            KptSelfReviewUpdateRequest request = new KptSelfReviewUpdateRequest("Keep text", "Problem text", "Try text");

            // when & then
            given(spec)
                    .body(request)
            .when()
                    .put(path + "/" + interviewId + "/kpt-self-review")
            .then()
                    .assertThat().statusCode(200)
                    .body("code", equalTo(COMMON200.name()))
                    .body("message", equalTo(COMMON200.getMessage()))
                    .body("result", nullValue());
        }

        @Test
        void 이미_KPT_회고가_존재할_때_수정에_성공한다() {
            // given
            Interview interview = interviewRepository.findById(interviewId).get();
            interviewSelfReviewRepository.save(
                    InterviewSelfReview.create("Initial Keep", "Initial Problem", "Initial Try", interview)
            );

            KptSelfReviewUpdateRequest request = new KptSelfReviewUpdateRequest("Updated Keep", "Updated Problem", "Updated Try");

            // when & then
            given(spec)
                    .body(request)
            .when()
                    .put(path + "/" + interviewId + "/kpt-self-review")
            .then()
                    .assertThat().statusCode(200)
                    .body("code", equalTo(COMMON200.name()))
                    .body("message", equalTo(COMMON200.getMessage()))
                    .body("result", nullValue());

            InterviewSelfReview updatedSelfReview = interviewSelfReviewRepository.findByInterview(interview).get();
            assertThat(updatedSelfReview.getKeepText()).isEqualTo("Updated Keep");
            assertThat(updatedSelfReview.getProblemText()).isEqualTo("Updated Problem");
            assertThat(updatedSelfReview.getTryText()).isEqualTo("Updated Try");
        }

        @Test
        void 존재하지_않는_면접의_KPT_회고를_업데이트하면_실패한다() {
            // given
            KptSelfReviewUpdateRequest request = new KptSelfReviewUpdateRequest("Keep text", "Problem text", "Try text");

            // when & then
            given(spec)
                    .body(request)
            .when()
                    .put(path + "/" + (interviewId + 1) + "/kpt-self-review")
            .then()
                    .assertThat().statusCode(404)
                    .body("code", equalTo(INTERVIEW_NOT_FOUND.name()))
                    .body("message", equalTo(INTERVIEW_NOT_FOUND.getMessage()))
                    .body("result", nullValue());
        }

        @Test
        void 로그인한_사용자가_아닌_다른_사람의_면접_KPT_회고를_업데이트하면_실패한다() {
            // given
            InterviewCreateRequest createRequest = new InterviewCreateRequest(
                    LocalDateTime.of(2025, 12, 29, 10, 0, 0), InterviewType.FIRST, "현대자동차", 1L, 1L, "BE Developer");
            User user = createAndSaveUser("other@example.com", "other", industry1, jobCategory1);
            Long otherInterviewId = createAndSaveInterview(createRequest, InterviewReviewStatus.NOT_LOGGED, user).getId();
            KptSelfReviewUpdateRequest updateRequest = new KptSelfReviewUpdateRequest("Other Keep", "Other Problem", "Other Try");

            // when & then
            given(spec)
                    .body(updateRequest)
            .when()
                    .put(path + "/" + otherInterviewId + "/kpt-self-review")
            .then()
                    .assertThat().statusCode(403)
                    .body("code", equalTo(INTERVIEW_NOT_ACCESSIBLE.name()))
                    .body("message", equalTo(INTERVIEW_NOT_ACCESSIBLE.getMessage()))
                    .body("result", nullValue());
        }

        @ParameterizedTest
        @EnumSource(value = InterviewReviewStatus.class, names = { "NOT_LOGGED", "LOG_DRAFT", "QNA_SET_DRAFT", "DEBRIEF_COMPLETED" })
        void 면접_상태가_회고중이_아닐_때_KPT회고를_업데이트하면_실패한다(InterviewReviewStatus status) {
            // given
            var createRequest = new InterviewCreateRequest(
                    LocalDateTime.of(2025, 12, 29, 10, 0, 0), InterviewType.FIRST, "현대자동차", 1L, 1L, "BE Developer");
            Interview invalidInterview = createAndSaveInterview(createRequest, status);
            var request = new KptSelfReviewUpdateRequest("Keep text", "Problem text", "Try text");

            // when & then
            given(spec)
                    .body(request)
            .when()
                    .put(path + "/" + invalidInterview.getId() + "/kpt-self-review")
            .then()
                    .assertThat().statusCode(INTERVIEW_REVIEW_STATUS_VALIDATION_FAILED.getHttpStatus().value())
                    .body("code", equalTo(INTERVIEW_REVIEW_STATUS_VALIDATION_FAILED.name()))
                    .body("message", equalTo(INTERVIEW_REVIEW_STATUS_VALIDATION_FAILED.getMessage()))
                    .body("result", nullValue());
        }
    }

    @Nested
    class 면접에_QnaSet_추가_시 {

        private static final String path = "/interview";
        private Long interviewId;

        @BeforeEach
        void setUp() {
            InterviewCreateRequest request = new InterviewCreateRequest(
                    LocalDateTime.of(2025, 12, 29, 10, 0, 0), InterviewType.FIRST, "현대자동차", 1L, 1L, "BE Developer");
            Interview interview = createAndSaveInterview(request, InterviewReviewStatus.QNA_SET_DRAFT);
            interviewId = interview.getId();
        }

        @Test
        void QnaSet_추가에_성공한다() {
            // given
            var request = new QnaSetCreateRequest("Question text", "Answer text");

            // when & then
            given(spec)
                    .body(request)
            .when()
                    .post(path + "/" + interviewId + "/qna-set")
            .then()
                    .assertThat().statusCode(200)
                    .body("code", equalTo(COMMON200.name()))
                    .body("message", equalTo(COMMON200.getMessage()))
                    .body("result.qnaSetId", notNullValue());
        }

        @Test
        void 존재하지_않는_면접에_QnaSet을_추가하면_실패한다() {
            // given
            var request = new QnaSetCreateRequest("Question text", "Answer text");

            // when & then
            given(spec)
                    .body(request)
            .when()
                    .post(path + "/" + (interviewId+1) + "/qna-set")
            .then()
                    .assertThat().statusCode(404)
                    .body("code", equalTo(INTERVIEW_NOT_FOUND.name()))
                    .body("message", equalTo(INTERVIEW_NOT_FOUND.getMessage()))
                    .body("result", nullValue());
        }

        @Test
        void 로그인한_사용자가_아닌_다른_사람의_면접에_QnaSet을_추가하면_실패한다() {
            // given
            InterviewCreateRequest createRequest = new InterviewCreateRequest(
                    LocalDateTime.of(2025, 12, 29, 10, 0, 0), InterviewType.FIRST, "현대자동차", 1L, 1L, "BE Developer");
            User user = createAndSaveUser("other@example.com", "other", industry1, jobCategory1);
            Long otherInterviewId = createAndSaveInterview(createRequest, InterviewReviewStatus.NOT_LOGGED, user).getId();
            var request = new QnaSetCreateRequest("Question text", "Answer text");

            // when & then
            given(spec)
                    .body(request)
            .when()
                    .post(path + "/" + otherInterviewId + "/qna-set")
            .then()
                    .assertThat().statusCode(403)
                    .body("code", equalTo(INTERVIEW_NOT_ACCESSIBLE.name()))
                    .body("message", equalTo(INTERVIEW_NOT_ACCESSIBLE.getMessage()))
                    .body("result", nullValue());
        }

        @ParameterizedTest
        @EnumSource(value = InterviewReviewStatus.class, names = { "NOT_LOGGED", "LOG_DRAFT", "SELF_REVIEW_DRAFT", "DEBRIEF_COMPLETED" })
        void 면접_상태가_기록완료가_아닐_때_면접에_QnaSet을_추가하면_실패한다(InterviewReviewStatus status) {
            // given
            var createRequest = new InterviewCreateRequest(
                    LocalDateTime.of(2025, 12, 29, 10, 0, 0), InterviewType.FIRST, "현대자동차", 1L, 1L, "BE Developer");
            Interview invalidInterview = createAndSaveInterview(createRequest, status);
            var request = new QnaSetCreateRequest("Question text", "Answer text");

            // when & then
            given(spec)
                    .body(request)
            .when()
                    .post(path + "/" + invalidInterview.getId() + "/qna-set")
            .then()
                    .assertThat().statusCode(INTERVIEW_REVIEW_STATUS_VALIDATION_FAILED.getHttpStatus().value())
                    .body("code", equalTo(INTERVIEW_REVIEW_STATUS_VALIDATION_FAILED.name()))
                    .body("message", equalTo(INTERVIEW_REVIEW_STATUS_VALIDATION_FAILED.getMessage()))
                    .body("result", nullValue());
        }
    }

    @Nested
    class 면접_기록_시작_시 {

        private static final String path = "/interview";
        private Long interviewId;

        @BeforeEach
        void setUp() {
            InterviewCreateRequest request = new InterviewCreateRequest(
                    LocalDateTime.of(2025, 12, 29, 10, 0, 0), InterviewType.FIRST, "현대자동차", 1L, 1L, "BE Developer");
            interviewId = createAndSaveInterview(request, InterviewReviewStatus.NOT_LOGGED).getId();
        }

        @Test
        void 성공한다() {
            // when & then
            given(spec)
            .when()
                    .post(path + "/" + interviewId + "/start-logging")
            .then()
                    .assertThat().statusCode(200)
                    .body("code", equalTo(COMMON200.name()))
                    .body("message", equalTo(COMMON200.getMessage()))
                    .body("result", nullValue());

            Interview interview = interviewRepository.findById(interviewId).get();
            assertThat(interview.getReviewStatus()).isEqualTo(InterviewReviewStatus.LOG_DRAFT);
        }

        @Test
        void 존재하지_않는_면접에_대해_요청하면_실패한다() {
            // when & then
            given(spec)
            .when()
                    .post(path + "/" + (interviewId + 1) + "/start-logging")
            .then()
                    .assertThat().statusCode(404)
                    .body("code", equalTo(INTERVIEW_NOT_FOUND.name()))
                    .body("message", equalTo(INTERVIEW_NOT_FOUND.getMessage()))
                    .body("result", nullValue());
        }

        @Test
        void 로그인한_사용자가_아닌_다른_사람의_면접에_대해_요청하면_실패한다() {
            // given
            InterviewCreateRequest request = new InterviewCreateRequest(
                    LocalDateTime.of(2025, 12, 29, 10, 0, 0), InterviewType.FIRST, "현대자동차", 1L, 1L, "BE Developer");
            User user = createAndSaveUser("other@example.com", "other", industry1, jobCategory1);
            Long otherInterviewId = createAndSaveInterview(request, InterviewReviewStatus.NOT_LOGGED, user).getId();

            // when & then
            given(spec)
            .when()
                    .post(path + "/" + otherInterviewId + "/start-logging")
            .then()
                    .assertThat().statusCode(403)
                    .body("code", equalTo(INTERVIEW_NOT_ACCESSIBLE.name()))
                    .body("message", equalTo(INTERVIEW_NOT_ACCESSIBLE.getMessage()))
                    .body("result", nullValue());
        }

        @ParameterizedTest
        @EnumSource(value = InterviewReviewStatus.class, names = { "LOG_DRAFT", "QNA_SET_DRAFT", "SELF_REVIEW_DRAFT", "DEBRIEF_COMPLETED" })
        void 면접_상태가_NOT_LOGGED가_아닐_때_요청하면_실패한다(InterviewReviewStatus status) {
            // given
            InterviewCreateRequest request = new InterviewCreateRequest(
                    LocalDateTime.of(2025, 12, 29, 10, 0, 0), InterviewType.FIRST, "현대자동차", 1L, 1L, "BE Developer");
            Interview invalidInterview = createAndSaveInterview(request, status);

            // when & then
            given(spec)
            .when()
                    .post(path + "/" + invalidInterview.getId() + "/start-logging")
            .then()
                    .assertThat().statusCode(INTERVIEW_REVIEW_STATUS_VALIDATION_FAILED.getHttpStatus().value())
                    .body("code", equalTo(INTERVIEW_REVIEW_STATUS_VALIDATION_FAILED.name()))
                    .body("message", equalTo(INTERVIEW_REVIEW_STATUS_VALIDATION_FAILED.getMessage()))
                    .body("result", nullValue());
        }
    }

    @Nested
    class 면접_질답_세트_완료_시 {

        private static final String path = "/interview";
        private Long interviewId;

        @BeforeEach
        void setUp() {
            InterviewCreateRequest request = new InterviewCreateRequest(
                    LocalDateTime.of(2025, 12, 29, 10, 0, 0), InterviewType.FIRST, "현대자동차", 1L, 1L, "BE Developer");
            interviewId = createAndSaveInterview(request, InterviewReviewStatus.QNA_SET_DRAFT).getId();
        }

        @Test
        void 성공한다() {
            // when & then
            given(spec)
            .when()
                    .post(path + "/" + interviewId + "/qna-set/complete")
            .then()
                    .assertThat().statusCode(200)
                    .body("code", equalTo(COMMON200.name()))
                    .body("message", equalTo(COMMON200.getMessage()))
                    .body("result", nullValue());

            Interview interview = interviewRepository.findById(interviewId).get();
            assertThat(interview.getReviewStatus()).isEqualTo(InterviewReviewStatus.SELF_REVIEW_DRAFT);
        }

        @Test
        void 존재하지_않는_면접에_대해_요청하면_실패한다() {
            // when & then
            given(spec)
            .when()
                    .post(path + "/" + (interviewId + 1) + "/qna-set/complete")
            .then()
                    .assertThat().statusCode(404)
                    .body("code", equalTo(INTERVIEW_NOT_FOUND.name()))
                    .body("message", equalTo(INTERVIEW_NOT_FOUND.getMessage()))
                    .body("result", nullValue());
        }

        @Test
        void 로그인한_사용자가_아닌_다른_사람의_면접에_대해_요청하면_실패한다() {
            // given
            InterviewCreateRequest request = new InterviewCreateRequest(
                    LocalDateTime.of(2025, 12, 29, 10, 0, 0), InterviewType.FIRST, "현대자동차", 1L, 1L, "BE Developer");
            User user = createAndSaveUser("other@example.com", "other", industry1, jobCategory1);
            Long otherInterviewId = createAndSaveInterview(request, InterviewReviewStatus.QNA_SET_DRAFT, user).getId();

            // when & then
            given(spec)
            .when()
                    .post(path + "/" + otherInterviewId + "/qna-set/complete")
            .then()
                    .assertThat().statusCode(403)
                    .body("code", equalTo(INTERVIEW_NOT_ACCESSIBLE.name()))
                    .body("message", equalTo(INTERVIEW_NOT_ACCESSIBLE.getMessage()))
                    .body("result", nullValue());
        }

        @ParameterizedTest
        @EnumSource(value = InterviewReviewStatus.class, names = { "NOT_LOGGED", "LOG_DRAFT", "SELF_REVIEW_DRAFT", "DEBRIEF_COMPLETED" })
        void 면접_상태가_QNA_SET_DRAFT가_아닐_때_요청하면_실패한다(InterviewReviewStatus status) {
            // given
            InterviewCreateRequest request = new InterviewCreateRequest(
                    LocalDateTime.of(2025, 12, 29, 10, 0, 0), InterviewType.FIRST, "현대자동차", 1L, 1L, "BE Developer");
            Interview invalidInterview = createAndSaveInterview(request, status);

            // when & then
            given(spec)
            .when()
                    .post(path + "/" + invalidInterview.getId() + "/qna-set/complete")
            .then()
                    .assertThat().statusCode(INTERVIEW_REVIEW_STATUS_VALIDATION_FAILED.getHttpStatus().value())
                    .body("code", equalTo(INTERVIEW_REVIEW_STATUS_VALIDATION_FAILED.name()))
                    .body("message", equalTo(INTERVIEW_REVIEW_STATUS_VALIDATION_FAILED.getMessage()))
                    .body("result", nullValue());
        }
    }
}

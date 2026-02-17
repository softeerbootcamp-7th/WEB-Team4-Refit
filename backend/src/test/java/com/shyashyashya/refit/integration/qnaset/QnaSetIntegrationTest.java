package com.shyashyashya.refit.integration.qnaset;

import static com.shyashyashya.refit.global.exception.ErrorCode.INDUSTRY_PARTIALLY_NOT_FOUND;
import static com.shyashyashya.refit.global.exception.ErrorCode.INTERVIEW_NOT_ACCESSIBLE;
import static com.shyashyashya.refit.global.exception.ErrorCode.INTERVIEW_REVIEW_STATUS_VALIDATION_FAILED;
import static com.shyashyashya.refit.global.exception.ErrorCode.JOB_CATEGORY_PARTIALLY_NOT_FOUND;
import static com.shyashyashya.refit.global.exception.ErrorCode.QNA_SET_NOT_FOUND;
import static com.shyashyashya.refit.global.model.ResponseCode.COMMON200;
import static com.shyashyashya.refit.global.model.ResponseCode.COMMON204;
import static io.restassured.RestAssured.given;
import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.hamcrest.Matchers.containsInAnyOrder;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.notNullValue;
import static org.hamcrest.Matchers.nullValue;

import com.shyashyashya.refit.integration.core.IntegrationTest;
import com.shyashyashya.refit.domain.interview.dto.request.InterviewCreateRequest;
import com.shyashyashya.refit.domain.interview.dto.request.QnaSetCreateRequest;
import com.shyashyashya.refit.domain.interview.model.Interview;
import com.shyashyashya.refit.domain.interview.model.InterviewReviewStatus;
import com.shyashyashya.refit.domain.interview.model.InterviewType;
import com.shyashyashya.refit.domain.interview.repository.InterviewRepository;
import com.shyashyashya.refit.domain.qnaset.dto.PdfHighlightingRectDto;
import com.shyashyashya.refit.domain.qnaset.dto.request.PdfHighlightingUpdateRequest;
import com.shyashyashya.refit.domain.qnaset.dto.request.QnaSetReviewUpdateRequest;
import com.shyashyashya.refit.domain.qnaset.dto.request.QnaSetUpdateRequest;
import com.shyashyashya.refit.domain.qnaset.model.QnaSet;
import com.shyashyashya.refit.domain.qnaset.model.QnaSetSelfReview;
import com.shyashyashya.refit.domain.qnaset.repository.QnaSetRepository;
import com.shyashyashya.refit.domain.qnaset.repository.QnaSetSelfReviewRepository;
import com.shyashyashya.refit.domain.user.model.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.EnumSource;
import org.springframework.beans.factory.annotation.Autowired;

import com.shyashyashya.refit.domain.qnaset.dto.request.QnaSetSearchRequest;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import org.junit.jupiter.params.provider.CsvSource;
import static org.hamcrest.Matchers.contains;

public class QnaSetIntegrationTest extends IntegrationTest {

    @Autowired
    private QnaSetRepository qnaSetRepository;

    @Autowired
    private QnaSetSelfReviewRepository qnaSetSelfReviewRepository;

    private Long qnaSetDraftQnaSetId;
    private Long debriefCompletedQnaSetId;
    private Long qnaSetWithPdfHighlightingId;
    private Long otherUserQnaSetId;

    @Nested
    class 질답_세트_생성_시 {

        @BeforeEach
        void setUp() {
            var interviewCreateRequest1 = new InterviewCreateRequest(
                    LocalDateTime.of(2025, 12, 29, 10, 0, 0), InterviewType.FIRST, "현대자동차", 1L, 1L, "BE Developer");
            Interview qnaSetDraftInterview = createAndSaveInterview(interviewCreateRequest1, InterviewReviewStatus.QNA_SET_DRAFT);

            var interviewCreateRequest2 = new InterviewCreateRequest(
                    LocalDateTime.of(2025, 12, 29, 10, 0, 0), InterviewType.FIRST, "현대자동차", 1L, 1L, "BE Developer");
            Interview debriefCompletedInterview = createAndSaveInterview(interviewCreateRequest2, InterviewReviewStatus.DEBRIEF_COMPLETED);

            var qnaSetCreateRequest1 = new QnaSetCreateRequest("test question text", "test answer text");
            QnaSet qnaSetDraftQnaSet = createAndSaveQnaSet(qnaSetCreateRequest1, qnaSetDraftInterview, true);
            qnaSetDraftQnaSetId = qnaSetDraftQnaSet.getId();

            var qnaSetCreateRequest2 = new QnaSetCreateRequest("test question text", "test answer text");
            QnaSet debriefCompletedQnaSet = createAndSaveQnaSet(qnaSetCreateRequest2, debriefCompletedInterview, true);
            debriefCompletedQnaSetId = debriefCompletedQnaSet.getId();

            var qnaSetCreateRequest3 = new QnaSetCreateRequest("this qna has pdf highlighting", "hello PDF");
            QnaSet qnaSetWithPdfHighlighting = createAndSaveQnaSet(qnaSetCreateRequest3,qnaSetDraftInterview, false);
            qnaSetWithPdfHighlightingId = qnaSetWithPdfHighlighting.getId();

            var interviewCreateRequest4 = new InterviewCreateRequest(
                    LocalDateTime.of(2025, 12, 29, 10, 0, 0), InterviewType.FIRST, "현대자동차", 1L, 1L, "BE Developer");
            User user = createAndSaveUser("other@example.com", "other", industry1, jobCategory1);
            Interview otherUserInterview = createAndSaveInterview(interviewCreateRequest4, InterviewReviewStatus.NOT_LOGGED, user);

            QnaSetCreateRequest qnaSetCreateRequest4 = new QnaSetCreateRequest("this qna is others", "hello stranger");
            QnaSet otherUserQnaSet = createAndSaveQnaSet(qnaSetCreateRequest4, otherUserInterview, false);
            otherUserQnaSetId = otherUserQnaSet.getId();

            List<PdfHighlightingUpdateRequest> pdfHighlightUpdateRequest = createPdfHighlightUpdateRequest();
            createAndSavePdfHighlighting(pdfHighlightUpdateRequest, qnaSetWithPdfHighlighting);
        }

        @Test
        void 인터뷰가_질답_세트_검토_중_상태이면_질답_세트_생성에_성공한다() {
            // given
             InterviewCreateRequest interviewCreateRequest = new InterviewCreateRequest(
                                LocalDateTime.of(2025, 12, 29, 10, 0, 0), InterviewType.FIRST, "현대자동차", 1L, 1L, "BE Developer");
            Interview interview1 = createAndSaveInterview(interviewCreateRequest, InterviewReviewStatus.QNA_SET_DRAFT);
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

        @ParameterizedTest
        @EnumSource(
                value = InterviewReviewStatus.class,
                mode = EnumSource.Mode.EXCLUDE,
                names = "QNA_SET_DRAFT"
        )
        void 인터뷰가_질답_세트_검토_중_상태가_아니라면_질답_세트_생성에_실패한다(InterviewReviewStatus reviewStatus) {
            // given
            InterviewCreateRequest interviewCreateRequest = new InterviewCreateRequest(
                    LocalDateTime.of(2025, 12, 29, 10, 0, 0), InterviewType.FIRST, "현대자동차", 1L, 1L, "BE Developer");

            Interview interview = createAndSaveInterview(interviewCreateRequest, reviewStatus);
            QnaSetCreateRequest request = new QnaSetCreateRequest("test question text", "test answer text");

            // when & then
            given(spec)
                    .body(request)
            .when()
                    .post("/interview/" + interview.getId() + "/qna-set")
            .then()
                    .statusCode(400)
                    .body("code", equalTo(INTERVIEW_REVIEW_STATUS_VALIDATION_FAILED.name()))
                    .body("message", equalTo(INTERVIEW_REVIEW_STATUS_VALIDATION_FAILED.getMessage()))
                    .body("result", nullValue());
        }
    }

    @Nested
    class 어려웠던_질문_마킹_시 {

        private Interview interview;
        private Long qnaSetId;

        @BeforeEach
        void setUp() {
            var interviewCreateRequest1 = new InterviewCreateRequest(
                    LocalDateTime.of(2025, 12, 29, 10, 0, 0), InterviewType.FIRST, "현대자동차", 1L, 1L, "BE Developer");
            Interview qnaSetDraftInterview = createAndSaveInterview(interviewCreateRequest1, InterviewReviewStatus.QNA_SET_DRAFT);

            var interviewCreateRequest2 = new InterviewCreateRequest(
                    LocalDateTime.of(2025, 12, 29, 10, 0, 0), InterviewType.FIRST, "현대자동차", 1L, 1L, "BE Developer");
            Interview debriefCompletedInterview = createAndSaveInterview(interviewCreateRequest2, InterviewReviewStatus.DEBRIEF_COMPLETED);

            var qnaSetCreateRequest1 = new QnaSetCreateRequest("test question text", "test answer text");
            QnaSet qnaSetDraftQnaSet = createAndSaveQnaSet(qnaSetCreateRequest1, qnaSetDraftInterview, true);
            qnaSetDraftQnaSetId = qnaSetDraftQnaSet.getId();

            var qnaSetCreateRequest2 = new QnaSetCreateRequest("test question text", "test answer text");
            QnaSet debriefCompletedQnaSet = createAndSaveQnaSet(qnaSetCreateRequest2, debriefCompletedInterview, true);
            debriefCompletedQnaSetId = debriefCompletedQnaSet.getId();

            var qnaSetCreateRequest3 = new QnaSetCreateRequest("this qna has pdf highlighting", "hello PDF");
            QnaSet qnaSetWithPdfHighlighting = createAndSaveQnaSet(qnaSetCreateRequest3,qnaSetDraftInterview, false);
            qnaSetWithPdfHighlightingId = qnaSetWithPdfHighlighting.getId();

            var interviewCreateRequest4 = new InterviewCreateRequest(
                    LocalDateTime.of(2025, 12, 29, 10, 0, 0), InterviewType.FIRST, "현대자동차", 1L, 1L, "BE Developer");
            User user = createAndSaveUser("other@example.com", "other", industry1, jobCategory1);
            Interview otherUserInterview = createAndSaveInterview(interviewCreateRequest4, InterviewReviewStatus.NOT_LOGGED, user);

            QnaSetCreateRequest qnaSetCreateRequest4 = new QnaSetCreateRequest("this qna is others", "hello stranger");
            QnaSet otherUserQnaSet = createAndSaveQnaSet(qnaSetCreateRequest4, otherUserInterview, false);
            otherUserQnaSetId = otherUserQnaSet.getId();

            List<PdfHighlightingUpdateRequest> pdfHighlightUpdateRequest = createPdfHighlightUpdateRequest();
            createAndSavePdfHighlighting(pdfHighlightUpdateRequest, qnaSetWithPdfHighlighting);


            interview = createAndSaveInterview(
                    new InterviewCreateRequest(
                            LocalDateTime.of(2023, 1, 10, 10, 0, 0), InterviewType.FIRST, company1.getName(), industry1.getId(), jobCategory1.getId(), "Developer"
                    ));
            QnaSetCreateRequest qnaSetCreateRequest = new QnaSetCreateRequest ("test qqq text", "test aaa text");
            QnaSet qnaSet = createAndSaveQnaSet(qnaSetCreateRequest, interview, false);
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

            QnaSet result = qnaSetRepository.findById(qnaSetId).get();
            assertThat(result.isMarkedDifficult()).isTrue();
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

            QnaSet result = qnaSetRepository.findById(qnaSetId).get();
            assertThat(result.isMarkedDifficult()).isFalse();
        }
    }

    @Nested
    class 질답_세트_수정_시 {

        @BeforeEach
        void setUp() {
            var interviewCreateRequest1 = new InterviewCreateRequest(
                    LocalDateTime.of(2025, 12, 29, 10, 0, 0), InterviewType.FIRST, "현대자동차", 1L, 1L, "BE Developer");
            Interview qnaSetDraftInterview = createAndSaveInterview(interviewCreateRequest1, InterviewReviewStatus.QNA_SET_DRAFT);

            var interviewCreateRequest2 = new InterviewCreateRequest(
                    LocalDateTime.of(2025, 12, 29, 10, 0, 0), InterviewType.FIRST, "현대자동차", 1L, 1L, "BE Developer");
            Interview debriefCompletedInterview = createAndSaveInterview(interviewCreateRequest2, InterviewReviewStatus.DEBRIEF_COMPLETED);

            var qnaSetCreateRequest1 = new QnaSetCreateRequest("test question text", "test answer text");
            QnaSet qnaSetDraftQnaSet = createAndSaveQnaSet(qnaSetCreateRequest1, qnaSetDraftInterview, true);
            qnaSetDraftQnaSetId = qnaSetDraftQnaSet.getId();

            var qnaSetCreateRequest2 = new QnaSetCreateRequest("test question text", "test answer text");
            QnaSet debriefCompletedQnaSet = createAndSaveQnaSet(qnaSetCreateRequest2, debriefCompletedInterview, true);
            debriefCompletedQnaSetId = debriefCompletedQnaSet.getId();

            var qnaSetCreateRequest3 = new QnaSetCreateRequest("this qna has pdf highlighting", "hello PDF");
            QnaSet qnaSetWithPdfHighlighting = createAndSaveQnaSet(qnaSetCreateRequest3,qnaSetDraftInterview, false);
            qnaSetWithPdfHighlightingId = qnaSetWithPdfHighlighting.getId();

            var interviewCreateRequest4 = new InterviewCreateRequest(
                    LocalDateTime.of(2025, 12, 29, 10, 0, 0), InterviewType.FIRST, "현대자동차", 1L, 1L, "BE Developer");
            User user = createAndSaveUser("other@example.com", "other", industry1, jobCategory1);
            Interview otherUserInterview = createAndSaveInterview(interviewCreateRequest4, InterviewReviewStatus.NOT_LOGGED, user);

            QnaSetCreateRequest qnaSetCreateRequest4 = new QnaSetCreateRequest("this qna is others", "hello stranger");
            QnaSet otherUserQnaSet = createAndSaveQnaSet(qnaSetCreateRequest4, otherUserInterview, false);
            otherUserQnaSetId = otherUserQnaSet.getId();

            List<PdfHighlightingUpdateRequest> pdfHighlightUpdateRequest = createPdfHighlightUpdateRequest();
            createAndSavePdfHighlighting(pdfHighlightUpdateRequest, qnaSetWithPdfHighlighting);
        }

        @Test
        void 인터뷰가_질답_세트_검토_중_상태이면_질답_세트_수정에_성공한다() {
            // given
            QnaSetUpdateRequest qnaSetUpdateRequest = new QnaSetUpdateRequest("update question", "update answer");

            // when & then
            given(spec)
                    .body(qnaSetUpdateRequest)
            .when()
                    .put("/qna-set/" + qnaSetDraftQnaSetId)
            .then()
                    .statusCode(200)
                    .body("code", equalTo(COMMON200.name()))
                    .body("message", equalTo(COMMON200.getMessage()))
                    .body("result", nullValue());

            QnaSet updated = qnaSetRepository.findById(qnaSetDraftQnaSetId).get();
            assertThat(updated.getQuestionText()).isEqualTo("update question");
            assertThat(updated.getAnswerText()).isEqualTo("update answer");
        }

        @Test
        void 수정_요청에_질문만_존재할_때_질답_세트_수정에_성공한다() {
            // given
            QnaSetUpdateRequest qnaSetUpdateRequest = new QnaSetUpdateRequest("only question text update", null);

            // when & then
            given(spec)
                    .body(qnaSetUpdateRequest)
            .when()
                    .put("/qna-set/" + qnaSetDraftQnaSetId)
            .then()
                    .statusCode(200)
                    .body("code", equalTo(COMMON200.name()))
                    .body("message", equalTo(COMMON200.getMessage()))
                    .body("result", nullValue());

            QnaSet updated = qnaSetRepository.findById(qnaSetDraftQnaSetId).get();
            assertThat(updated.getQuestionText()).isEqualTo("only question text update");
            assertThat(updated.getAnswerText()).isEqualTo("test answer text");
        }

        @Test
        void 수정_요청에_답변만_존재할_때_질답_세트_수정에_성공한다() {
            // given
            QnaSetUpdateRequest qnaSetUpdateRequest = new QnaSetUpdateRequest(null, "only answer text update");

            // when & then
            given(spec)
                    .body(qnaSetUpdateRequest)
            .when()
                    .put("/qna-set/" + qnaSetDraftQnaSetId)
            .then()
                    .statusCode(200)
                    .body("code", equalTo(COMMON200.name()))
                    .body("message", equalTo(COMMON200.getMessage()))
                    .body("result", nullValue());

            QnaSet updated = qnaSetRepository.findById(qnaSetDraftQnaSetId).get();
            assertThat(updated.getQuestionText()).isEqualTo("test question text");
            assertThat(updated.getAnswerText()).isEqualTo("only answer text update");
        }

        @Test
        void 수정_요청이_빈_문자열일_때_질답_세트_수정에_성공한다() {
            // given
            QnaSetUpdateRequest qnaSetUpdateRequest = new QnaSetUpdateRequest("", null);

            // when & then
            given(spec)
                    .body(qnaSetUpdateRequest)
            .when()
                    .put("/qna-set/" + qnaSetDraftQnaSetId)
            .then()
                    .statusCode(200)
                    .body("code", equalTo(COMMON200.name()))
                    .body("message", equalTo(COMMON200.getMessage()))
                    .body("result", nullValue());
        }

        @Test
        void 인터뷰가_질답_세트_검토_중_상태가_아니라면_질답_세트_수정에_실패한다() {
            // given
            QnaSetUpdateRequest qnaSetUpdateRequest = new QnaSetUpdateRequest("update question", "update answer");

            // when & then
            given(spec)
                    .body(qnaSetUpdateRequest)
            .when()
                    .put("/qna-set/" + debriefCompletedQnaSetId)
            .then()
                    .statusCode(400)
                    .body("code", equalTo(INTERVIEW_REVIEW_STATUS_VALIDATION_FAILED.name()))
                    .body("message", equalTo(INTERVIEW_REVIEW_STATUS_VALIDATION_FAILED.getMessage()))
                    .body("result", nullValue());
        }

        @Test
        void 질답_세트가_존재하지_않으면_질답_세트_수정에_실패한다() {
            // given
            QnaSetUpdateRequest qnaSetUpdateRequest = new QnaSetUpdateRequest("update question", "update answer");

            // when & then
            given(spec)
                    .body(qnaSetUpdateRequest)
            .when()
                    .put("/qna-set/" + Long.MAX_VALUE)
            .then()
                    .statusCode(404)
                    .body("code", equalTo(QNA_SET_NOT_FOUND.name()))
                    .body("message", equalTo(QNA_SET_NOT_FOUND.getMessage()))
                    .body("result", nullValue());
        }

        @Test
        void 다른_사람의_질답_세트_수정에_실패한다() {
            // given
            QnaSetUpdateRequest qnaSetUpdateRequest = new QnaSetUpdateRequest("update question", "update answer");

            // when & then
            given(spec)
                    .body(qnaSetUpdateRequest)
            .when()
                    .put("/qna-set/" + otherUserQnaSetId)
            .then()
                    .statusCode(403)
                    .body("code", equalTo(INTERVIEW_NOT_ACCESSIBLE.name()))
                    .body("message", equalTo(INTERVIEW_NOT_ACCESSIBLE.getMessage()))
                    .body("result", nullValue());
        }
    }

    @Nested
    class 질답_세트_삭제_시 {

        @BeforeEach
        void setUp() {
            var interviewCreateRequest1 = new InterviewCreateRequest(
                    LocalDateTime.of(2025, 12, 29, 10, 0, 0), InterviewType.FIRST, "현대자동차", 1L, 1L, "BE Developer");
            Interview qnaSetDraftInterview = createAndSaveInterview(interviewCreateRequest1, InterviewReviewStatus.QNA_SET_DRAFT);

            var interviewCreateRequest2 = new InterviewCreateRequest(
                    LocalDateTime.of(2025, 12, 29, 10, 0, 0), InterviewType.FIRST, "현대자동차", 1L, 1L, "BE Developer");
            Interview debriefCompletedInterview = createAndSaveInterview(interviewCreateRequest2, InterviewReviewStatus.DEBRIEF_COMPLETED);

            var qnaSetCreateRequest1 = new QnaSetCreateRequest("test question text", "test answer text");
            QnaSet qnaSetDraftQnaSet = createAndSaveQnaSet(qnaSetCreateRequest1, qnaSetDraftInterview, true);
            qnaSetDraftQnaSetId = qnaSetDraftQnaSet.getId();

            var qnaSetCreateRequest2 = new QnaSetCreateRequest("test question text", "test answer text");
            QnaSet debriefCompletedQnaSet = createAndSaveQnaSet(qnaSetCreateRequest2, debriefCompletedInterview, true);
            debriefCompletedQnaSetId = debriefCompletedQnaSet.getId();

            var qnaSetCreateRequest3 = new QnaSetCreateRequest("this qna has pdf highlighting", "hello PDF");
            QnaSet qnaSetWithPdfHighlighting = createAndSaveQnaSet(qnaSetCreateRequest3,qnaSetDraftInterview, false);
            qnaSetWithPdfHighlightingId = qnaSetWithPdfHighlighting.getId();

            var interviewCreateRequest4 = new InterviewCreateRequest(
                    LocalDateTime.of(2025, 12, 29, 10, 0, 0), InterviewType.FIRST, "현대자동차", 1L, 1L, "BE Developer");
            User user = createAndSaveUser("other@example.com", "other", industry1, jobCategory1);
            Interview otherUserInterview = createAndSaveInterview(interviewCreateRequest4, InterviewReviewStatus.NOT_LOGGED, user);

            QnaSetCreateRequest qnaSetCreateRequest4 = new QnaSetCreateRequest("this qna is others", "hello stranger");
            QnaSet otherUserQnaSet = createAndSaveQnaSet(qnaSetCreateRequest4, otherUserInterview, false);
            otherUserQnaSetId = otherUserQnaSet.getId();

            List<PdfHighlightingUpdateRequest> pdfHighlightUpdateRequest = createPdfHighlightUpdateRequest();
            createAndSavePdfHighlighting(pdfHighlightUpdateRequest, qnaSetWithPdfHighlighting);
        }

        @Test
        void 인터뷰가_질답_세트_검토_중_상태이면_질답_세트_삭제에_성공한다() {
            // given

            // when & then
            given(spec)
            .when()
                    .delete("/qna-set/" + qnaSetDraftQnaSetId)
            .then()
                    .statusCode(200)
                    .body("code", equalTo(COMMON204.name()))
                    .body("message", equalTo(COMMON204.getMessage()))
                    .body("result", nullValue());
        }

        @Test
        void 인터뷰가_질답_세트_검토_중_상태가_아니면_질답_세트_삭제에_실패한다() {
            // given

            // when & then
            given(spec)
            .when()
                    .delete("/qna-set/" + debriefCompletedQnaSetId)
            .then()
                    .statusCode(400)
                    .body("code", equalTo(INTERVIEW_REVIEW_STATUS_VALIDATION_FAILED.name()))
                    .body("message", equalTo(INTERVIEW_REVIEW_STATUS_VALIDATION_FAILED.getMessage()))
                    .body("result", nullValue());
        }
        @Test
        void 질답_세트가_존재하지_않으면_질답_세트_삭제에_실패한다() {
            // given

            // when & then
            given(spec)
            .when()
                    .delete("/qna-set/" + Long.MAX_VALUE)
            .then()
                    .statusCode(404)
                    .body("code", equalTo(QNA_SET_NOT_FOUND.name()))
                    .body("message", equalTo(QNA_SET_NOT_FOUND.getMessage()))
                    .body("result", nullValue());
        }

        @Test
        void 다른_사람의_질답_세트_삭제에_실패한다() {
            // given

            // when & then
            given(spec)
            .when()
                    .delete("/qna-set/" + otherUserQnaSetId)
            .then()
                    .statusCode(403)
                    .body("code", equalTo(INTERVIEW_NOT_ACCESSIBLE.name()))
                    .body("message", equalTo(INTERVIEW_NOT_ACCESSIBLE.getMessage()))
                    .body("result", nullValue());
        }
    }

    @Nested
    class PDF_하이라이팅_등록_수정_시 {

        @BeforeEach
        void setUp() {
            var interviewCreateRequest1 = new InterviewCreateRequest(
                    LocalDateTime.of(2025, 12, 29, 10, 0, 0), InterviewType.FIRST, "현대자동차", 1L, 1L, "BE Developer");
            Interview qnaSetDraftInterview = createAndSaveInterview(interviewCreateRequest1, InterviewReviewStatus.QNA_SET_DRAFT);

            var interviewCreateRequest2 = new InterviewCreateRequest(
                    LocalDateTime.of(2025, 12, 29, 10, 0, 0), InterviewType.FIRST, "현대자동차", 1L, 1L, "BE Developer");
            Interview debriefCompletedInterview = createAndSaveInterview(interviewCreateRequest2, InterviewReviewStatus.DEBRIEF_COMPLETED);

            var qnaSetCreateRequest1 = new QnaSetCreateRequest("test question text", "test answer text");
            QnaSet qnaSetDraftQnaSet = createAndSaveQnaSet(qnaSetCreateRequest1, qnaSetDraftInterview, true);
            qnaSetDraftQnaSetId = qnaSetDraftQnaSet.getId();

            var qnaSetCreateRequest2 = new QnaSetCreateRequest("test question text", "test answer text");
            QnaSet debriefCompletedQnaSet = createAndSaveQnaSet(qnaSetCreateRequest2, debriefCompletedInterview, true);
            debriefCompletedQnaSetId = debriefCompletedQnaSet.getId();

            var qnaSetCreateRequest3 = new QnaSetCreateRequest("this qna has pdf highlighting", "hello PDF");
            QnaSet qnaSetWithPdfHighlighting = createAndSaveQnaSet(qnaSetCreateRequest3,qnaSetDraftInterview, false);
            qnaSetWithPdfHighlightingId = qnaSetWithPdfHighlighting.getId();

            var interviewCreateRequest4 = new InterviewCreateRequest(
                    LocalDateTime.of(2025, 12, 29, 10, 0, 0), InterviewType.FIRST, "현대자동차", 1L, 1L, "BE Developer");
            User user = createAndSaveUser("other@example.com", "other", industry1, jobCategory1);
            Interview otherUserInterview = createAndSaveInterview(interviewCreateRequest4, InterviewReviewStatus.NOT_LOGGED, user);

            QnaSetCreateRequest qnaSetCreateRequest4 = new QnaSetCreateRequest("this qna is others", "hello stranger");
            QnaSet otherUserQnaSet = createAndSaveQnaSet(qnaSetCreateRequest4, otherUserInterview, false);
            otherUserQnaSetId = otherUserQnaSet.getId();

            List<PdfHighlightingUpdateRequest> pdfHighlightUpdateRequest = createPdfHighlightUpdateRequest();
            createAndSavePdfHighlighting(pdfHighlightUpdateRequest, qnaSetWithPdfHighlighting);
        }

        @Test
        void 인터뷰가_질답_세트_검토_중_상태이면_PDF_하이라이팅_등록에_성공한다() {
            // given
            List<PdfHighlightingUpdateRequest> request = createPdfHighlightUpdateRequest();

            // when & then
            given(spec)
                    .body(request)
            .when()
                    .put("/qna-set/" + qnaSetDraftQnaSetId + "/pdf-highlightings")
            .then()
                    .statusCode(200)
                    .body("code", equalTo(COMMON200.name()))
                    .body("message", equalTo(COMMON200.getMessage()))
                    .body("result", nullValue());
        }

        @Test
        void 인터뷰가_질답_세트_검토_중_상태이면_비어있는_PDF_하이라이팅_등록에_성공한다() {
            // given
            List<PdfHighlightingUpdateRequest> request = List.of();

            // when & then
            given(spec)
                    .body(request)
                    .when()
                    .put("/qna-set/" + qnaSetDraftQnaSetId + "/pdf-highlightings")
                    .then()
                    .statusCode(200)
                    .body("code", equalTo(COMMON200.name()))
                    .body("message", equalTo(COMMON200.getMessage()))
                    .body("result", nullValue());
        }

        @ParameterizedTest
        @EnumSource(
                value = InterviewReviewStatus.class,
                mode = EnumSource.Mode.EXCLUDE,
                names = "QNA_SET_DRAFT"
        )
        void 인터뷰가_질답_세트_검토_중_상태가_아니면_PDF_하이라이팅_등록에_실패한다(InterviewReviewStatus reviewStatus) {
            // given
            var interviewCreateRequest = new InterviewCreateRequest(
                    LocalDateTime.of(2025, 12, 29, 10, 0, 0), InterviewType.FIRST, "현대자동차", 1L, 1L, "BE Developer");
            var interview = createAndSaveInterview(interviewCreateRequest, reviewStatus);
            var qnaSetCreateRequest = new QnaSetCreateRequest("test question text", "test answer text");
            var qnaSetId = createAndSaveQnaSet(qnaSetCreateRequest, interview).getId();

            List<PdfHighlightingUpdateRequest> request = createPdfHighlightUpdateRequest();

            // when & then
            given(spec)
                    .body(request)
            .when()
                    .put("/qna-set/" + qnaSetId + "/pdf-highlightings")
            .then()
                    .statusCode(400)
                    .body("code", equalTo(INTERVIEW_REVIEW_STATUS_VALIDATION_FAILED.name()))
                    .body("message", equalTo(INTERVIEW_REVIEW_STATUS_VALIDATION_FAILED.getMessage()))
                    .body("result", nullValue());
        }

        @Test
        void 존재하지_않는_질답에_PDF_하이라이팅_등록을_시도하면_실패한다() {
            // given
            List<PdfHighlightingUpdateRequest> request = createPdfHighlightUpdateRequest();

            // when & then
            given(spec)
                    .body(request)
                    .when()
                    .put("/qna-set/" + Long.MAX_VALUE + "/pdf-highlightings")
                    .then()
                    .statusCode(404)
                    .body("code", equalTo(QNA_SET_NOT_FOUND.name()))
                    .body("message", equalTo(QNA_SET_NOT_FOUND.getMessage()))
                    .body("result", nullValue());
        }

        @Test
        void 타인의_질답에_PDF_하이라이팅_등록을_시도하면_실패한다() {
            // given
            List<PdfHighlightingUpdateRequest> request = createPdfHighlightUpdateRequest();

            // when & then
            given(spec)
                    .body(request)
                    .when()
                    .put("/qna-set/" + otherUserQnaSetId + "/pdf-highlightings")
                    .then()
                    .statusCode(403)
                    .body("code", equalTo(INTERVIEW_NOT_ACCESSIBLE.name()))
                    .body("message", equalTo(INTERVIEW_NOT_ACCESSIBLE.getMessage()))
                    .body("result", nullValue());
        }


    }

    @Nested
    class PDF_하이라이팅_조회_시 {

        @BeforeEach
        void setUp() {
            var interviewCreateRequest1 = new InterviewCreateRequest(
                    LocalDateTime.of(2025, 12, 29, 10, 0, 0), InterviewType.FIRST, "현대자동차", 1L, 1L, "BE Developer");
            Interview qnaSetDraftInterview = createAndSaveInterview(interviewCreateRequest1, InterviewReviewStatus.QNA_SET_DRAFT);

            var interviewCreateRequest2 = new InterviewCreateRequest(
                    LocalDateTime.of(2025, 12, 29, 10, 0, 0), InterviewType.FIRST, "현대자동차", 1L, 1L, "BE Developer");
            Interview debriefCompletedInterview = createAndSaveInterview(interviewCreateRequest2, InterviewReviewStatus.DEBRIEF_COMPLETED);

            var qnaSetCreateRequest1 = new QnaSetCreateRequest("test question text", "test answer text");
            QnaSet qnaSetDraftQnaSet = createAndSaveQnaSet(qnaSetCreateRequest1, qnaSetDraftInterview, true);
            qnaSetDraftQnaSetId = qnaSetDraftQnaSet.getId();

            var qnaSetCreateRequest2 = new QnaSetCreateRequest("test question text", "test answer text");
            QnaSet debriefCompletedQnaSet = createAndSaveQnaSet(qnaSetCreateRequest2, debriefCompletedInterview, true);
            debriefCompletedQnaSetId = debriefCompletedQnaSet.getId();

            var qnaSetCreateRequest3 = new QnaSetCreateRequest("this qna has pdf highlighting", "hello PDF");
            QnaSet qnaSetWithPdfHighlighting = createAndSaveQnaSet(qnaSetCreateRequest3,qnaSetDraftInterview, false);
            qnaSetWithPdfHighlightingId = qnaSetWithPdfHighlighting.getId();

            var interviewCreateRequest4 = new InterviewCreateRequest(
                    LocalDateTime.of(2025, 12, 29, 10, 0, 0), InterviewType.FIRST, "현대자동차", 1L, 1L, "BE Developer");
            User user = createAndSaveUser("other@example.com", "other", industry1, jobCategory1);
            Interview otherUserInterview = createAndSaveInterview(interviewCreateRequest4, InterviewReviewStatus.NOT_LOGGED, user);

            QnaSetCreateRequest qnaSetCreateRequest4 = new QnaSetCreateRequest("this qna is others", "hello stranger");
            QnaSet otherUserQnaSet = createAndSaveQnaSet(qnaSetCreateRequest4, otherUserInterview, false);
            otherUserQnaSetId = otherUserQnaSet.getId();

            List<PdfHighlightingUpdateRequest> pdfHighlightUpdateRequest = createPdfHighlightUpdateRequest();
            createAndSavePdfHighlighting(pdfHighlightUpdateRequest, qnaSetWithPdfHighlighting);
        }

        @Test
        void 나의_빈_PDF_하이라이팅_정보_조회를_성공한다() {
            // given

            // when & then
            given(spec)
            .when()
                    .get("/qna-set/" + qnaSetDraftQnaSetId + "/pdf-highlightings")
            .then()
                    .statusCode(200)
                    .body("code", equalTo(COMMON200.name()))
                    .body("message", equalTo(COMMON200.getMessage()))
                    .body("result", notNullValue());
        }

        @Test
        void 나의_데이터가_있는_PDF_하이라이팅_정보_조회를_성공한다() {
            // given

            // when & then
            given(spec)
                    .when()
                    .get("/qna-set/" + qnaSetWithPdfHighlightingId + "/pdf-highlightings")
                    .then()
                    .statusCode(200)
                    .body("code", equalTo(COMMON200.name()))
                    .body("message", equalTo(COMMON200.getMessage()))
                    .body("result", notNullValue());
        }

        @Test
        void 회고_완료_면접의_나의_PDF_하이라이팅_정보_조회를_성공한다() {
            // given

            // when & then
            given(spec)
            .when()
                    .get("/qna-set/" + debriefCompletedQnaSetId + "/pdf-highlightings")
            .then()
                    .statusCode(200)
                    .body("code", equalTo(COMMON200.name()))
                    .body("message", equalTo(COMMON200.getMessage()))
                    .body("result", notNullValue());
        }

        @Test
        void 다른_사람의_PDF_하이라이팅_정보_조회를_실패한다() {
            given(spec)
            .when()
                    .get("/qna-set/" + otherUserQnaSetId + "/pdf-highlightings")
            .then()
                    .statusCode(403)
                    .body("code", equalTo(INTERVIEW_NOT_ACCESSIBLE.name()))
                    .body("message", equalTo(INTERVIEW_NOT_ACCESSIBLE.getMessage()))
                    .body("result", nullValue());
        }
    }

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

    private List<PdfHighlightingUpdateRequest> createPdfHighlightUpdateRequest() {
        return List.of(
                new PdfHighlightingUpdateRequest(
                        "highlighting1 text",
                        List.of(
                                new PdfHighlightingRectDto(3.14, 1.592, 30.12, 4123.432, 10),
                                new PdfHighlightingRectDto(0.0, 1.592, 34.0, 4123.432, 10),
                                new PdfHighlightingRectDto(3.14, 1.592, 30.12, 4123.432, 10),
                                new PdfHighlightingRectDto(3.14, 123123.1, 30.12, 4123.432, 1)
                        )),
                new PdfHighlightingUpdateRequest(
                        "highlighting2 text",
                        List.of(
                                new PdfHighlightingRectDto(3.14, 1.592, 30.12, 4123.432, 1),
                                new PdfHighlightingRectDto(0.0, 1.592, 34.0, 4123.432, 2),
                                new PdfHighlightingRectDto(3.14, 1.592, 30.12, 4123.432, 3),
                                new PdfHighlightingRectDto(3.14, 123123.1, 30.12, 4123.432, 4)
                        )),
                new PdfHighlightingUpdateRequest(
                        "highlighting3 text",
                        List.of(
                                new PdfHighlightingRectDto(3.14, 1.592, 30.12, 20201483.2, 13),
                                new PdfHighlightingRectDto(0.0, 1.592, 34.0, 4123.432, 13),
                                new PdfHighlightingRectDto(0.04, 1.592, 30.12, 4123.432, 13),
                                new PdfHighlightingRectDto(452.1, 123123.1, 30.12, 4123.432, 13)
                        ))
        );
    }

    @Nested
    class 질답_세트_회고_수정_시 {

        private Long selfReviewDraftQnaSetId;
        private Long otherUserQnaSetId;

        @BeforeEach
        void setUp() {
            var interviewCreateRequest = new InterviewCreateRequest(
                    LocalDateTime.of(2025, 12, 29, 10, 0, 0), InterviewType.FIRST, "현대자동차", 1L, 1L, "BE Developer");
            Interview selfReviewDraftInterview = createAndSaveInterview(interviewCreateRequest, InterviewReviewStatus.SELF_REVIEW_DRAFT);

            var qnaSetCreateRequest = new QnaSetCreateRequest("question", "answer");
            QnaSet selfReviewDraftQnaSet = createAndSaveQnaSet(qnaSetCreateRequest, selfReviewDraftInterview);
            selfReviewDraftQnaSetId = selfReviewDraftQnaSet.getId();
        }

        @Test
        void 인터뷰가_회고_중_상태이면_회고_수정에_성공한다() {
            // given
            QnaSetReviewUpdateRequest request = new QnaSetReviewUpdateRequest("updated review");

            // when & then
            given(spec)
                    .body(request)
            .when()
                    .put("/qna-set/" + selfReviewDraftQnaSetId + "/self-review")
            .then()
                    .statusCode(200)
                    .body("code", equalTo(COMMON200.name()))
                    .body("message", equalTo(COMMON200.getMessage()))
                    .body("result", nullValue());

            QnaSet updated = qnaSetRepository.findById(selfReviewDraftQnaSetId).get();
            QnaSetSelfReview selfReview = qnaSetSelfReviewRepository.findByQnaSet(updated).get();
            assertThat(selfReview.getSelfReviewText()).isEqualTo("updated review");
        }

        @ParameterizedTest
        @EnumSource(value = InterviewReviewStatus.class, mode = EnumSource.Mode.EXCLUDE, names = "SELF_REVIEW_DRAFT")
        void 인터뷰가_회고_중_상태가_아니면_회고_수정에_실패한다(InterviewReviewStatus status) {
            // given
            var interviewCreateRequest = new InterviewCreateRequest(
                    LocalDateTime.of(2025, 12, 29, 10, 0, 0), InterviewType.FIRST, "현대자동차", 1L, 1L, "BE Developer");
            Interview interview = createAndSaveInterview(interviewCreateRequest, status);

            var qnaSetCreateRequest = new QnaSetCreateRequest("question", "answer");
            QnaSet qnaSet = createAndSaveQnaSet(qnaSetCreateRequest, interview);

            QnaSetReviewUpdateRequest request = new QnaSetReviewUpdateRequest("updated review");

            // when & then
            given(spec)
                    .body(request)
            .when()
                    .put("/qna-set/" + qnaSet.getId() + "/self-review")
            .then()
                    .statusCode(400)
                    .body("code", equalTo(INTERVIEW_REVIEW_STATUS_VALIDATION_FAILED.name()))
                    .body("message", equalTo(INTERVIEW_REVIEW_STATUS_VALIDATION_FAILED.getMessage()))
                    .body("result", nullValue());
        }

        @Test
        void 질답_세트가_존재하지_않으면_회고_수정에_실패한다() {
            // given
            QnaSetReviewUpdateRequest request = new QnaSetReviewUpdateRequest("updated review");

            // when & then
            given(spec)
                    .body(request)
            .when()
                    .put("/qna-set/" + Long.MAX_VALUE + "/self-review")
            .then()
                    .statusCode(404)
                    .body("code", equalTo(QNA_SET_NOT_FOUND.name()))
                    .body("message", equalTo(QNA_SET_NOT_FOUND.getMessage()))
                    .body("result", nullValue());
        }

        @Test
        void 다른_사람의_질답_세트_회고_수정에_실패한다() {
            // given
            User user = createAndSaveUser("other@example.com", "other", industry1, jobCategory1);

            var interviewCreateRequest = new InterviewCreateRequest(
                    LocalDateTime.of(2025, 12, 29, 10, 0, 0), InterviewType.FIRST, "현대자동차", 1L, 1L, "BE Developer");
            Interview otherUserInterview = createAndSaveInterview(interviewCreateRequest, InterviewReviewStatus.SELF_REVIEW_DRAFT, user);

            var qnaSetCreateRequest = new QnaSetCreateRequest("question", "answer");
            otherUserQnaSetId = createAndSaveQnaSet(qnaSetCreateRequest, otherUserInterview).getId();

            QnaSetReviewUpdateRequest request = new QnaSetReviewUpdateRequest("updated review");

            // when & then
            given(spec)
                    .body(request)
            .when()
                    .put("/qna-set/" + otherUserQnaSetId + "/self-review")
            .then()
                    .statusCode(403)
                    .body("code", equalTo(INTERVIEW_NOT_ACCESSIBLE.name()))
                    .body("message", equalTo(INTERVIEW_NOT_ACCESSIBLE.getMessage()))
                    .body("result", nullValue());
        }
    }

    @Nested
    class 질문_목록_검색_및_정렬_시 {

        private static final String path = "/qna-set/my/search";
        private QnaSet qnaSet1;
        private QnaSet qnaSet2;
        private QnaSet qnaSet3;

        @BeforeEach
        void setUp() {
            createAndSaveCompany("A_Company");
            createAndSaveCompany("B_Company");
            createAndSaveCompany("C_Company");

            InterviewCreateRequest req1 = new InterviewCreateRequest(
                    LocalDateTime.of(2025, 1, 2, 10, 0, 0),
                    InterviewType.FIRST, "B_Company", industry1.getId(), jobCategory1.getId(), "BE Developer");
            Interview interview1 = createAndSaveInterview(req1, InterviewReviewStatus.DEBRIEF_COMPLETED);
            qnaSet1 = createAndSaveQnaSet(new QnaSetCreateRequest("Q1", "A1"), interview1, false);

            try { Thread.sleep(100); } catch (InterruptedException e) {}

            InterviewCreateRequest req2 = new InterviewCreateRequest(
                    LocalDateTime.of(2025, 1, 3, 10, 0, 0),
                    InterviewType.FIRST, "A_Company", industry1.getId(), jobCategory1.getId(), "BE Developer");
            Interview interview2 = createAndSaveInterview(req2, InterviewReviewStatus.DEBRIEF_COMPLETED);
            qnaSet2 = createAndSaveQnaSet(new QnaSetCreateRequest("Q2", "A2"), interview2, false);

            try { Thread.sleep(100); } catch (InterruptedException e) {}

            InterviewCreateRequest req3 = new InterviewCreateRequest(
                    LocalDateTime.of(2025, 1, 1, 10, 0, 0),
                    InterviewType.FIRST, "C_Company", industry1.getId(), jobCategory1.getId(), "BE Developer");
            Interview interview3 = createAndSaveInterview(req3, InterviewReviewStatus.DEBRIEF_COMPLETED);
            qnaSet3 = createAndSaveQnaSet(new QnaSetCreateRequest("Q3", "A3"), interview3, false);
        }

        @ParameterizedTest(name = "{0} 필드를 {1} 로 정렬에 성공한다")
        @CsvSource({
                "interviewStartAt, asc, 3:1:2",
                "interviewStartAt, desc, 2:1:3",
                "updatedAt, asc, 1:2:3",
                "updatedAt, desc, 3:2:1"
        })
        void 정렬_조건에_따라_올바르게_정렬된다(String sortField, String direction, String expectedOrderIndices) {
            List<Integer> expectedIds = Arrays.stream(expectedOrderIndices.split(":")).map(Integer::parseInt).toList();

            QnaSetSearchRequest request = new QnaSetSearchRequest(
                    null,
                    new QnaSetSearchRequest.QnaSearchFilter(
                            null, Collections.emptySet(), Collections.emptySet(), Collections.emptySet(), Collections.emptySet())
            );

            given(spec)
                    .body(request)
                    .queryParam("sort", sortField + "," + direction)
            .when()
                    .post(path)
            .then()
                    .statusCode(200)
                    .body("code", equalTo(COMMON200.name()))
                    .body("message", equalTo(COMMON200.getMessage()))
                    .body("result.content", hasSize(expectedIds.size()))
                    .body("result.content*.qnaSetInfo.qnaSetId", contains(expectedIds.toArray()));
        }
    }
}

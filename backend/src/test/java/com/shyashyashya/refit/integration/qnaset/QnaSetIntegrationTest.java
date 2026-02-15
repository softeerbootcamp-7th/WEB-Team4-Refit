package com.shyashyashya.refit.integration.qnaset;

import static com.shyashyashya.refit.global.exception.ErrorCode.INTERVIEW_NOT_ACCESSIBLE;
import static com.shyashyashya.refit.global.exception.ErrorCode.INTERVIEW_REVIEW_STATUS_VALIDATION_FAILED;
import static com.shyashyashya.refit.global.exception.ErrorCode.QNA_SET_NOT_FOUND;
import static com.shyashyashya.refit.global.model.ResponseCode.COMMON200;
import static com.shyashyashya.refit.global.model.ResponseCode.COMMON204;
import static io.restassured.RestAssured.given;
import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.notNullValue;
import static org.hamcrest.Matchers.nullValue;

import com.shyashyashya.refit.core.IntegrationTest;
import com.shyashyashya.refit.domain.interview.dto.request.InterviewCreateRequest;
import com.shyashyashya.refit.domain.interview.dto.request.QnaSetCreateRequest;
import com.shyashyashya.refit.domain.interview.model.Interview;
import com.shyashyashya.refit.domain.interview.model.InterviewReviewStatus;
import com.shyashyashya.refit.domain.interview.model.InterviewType;
import com.shyashyashya.refit.domain.interview.repository.InterviewRepository;
import com.shyashyashya.refit.domain.qnaset.dto.PdfHighlightingRectDto;
import com.shyashyashya.refit.domain.qnaset.dto.request.PdfHighlightingUpdateRequest;
import com.shyashyashya.refit.domain.qnaset.dto.request.QnaSetUpdateRequest;
import com.shyashyashya.refit.domain.qnaset.model.QnaSet;
import com.shyashyashya.refit.domain.qnaset.repository.QnaSetRepository;
import com.shyashyashya.refit.domain.user.model.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import java.time.LocalDateTime;
import java.util.List;

public class QnaSetIntegrationTest extends IntegrationTest {

    @Autowired
    private InterviewRepository interviewRepository;
    @Autowired
    private QnaSetRepository qnaSetRepository;

    private Long qnaSetDraftQnaSetId;
    private Long debriefCompletedQnaSetId;
    private Long qnaSetWithPdfHighlightingId;
    private Long otherUserQnaSetId;

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

    @Nested
    class 질답_세트_생성_시 {

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

        @Test
        void 인터뷰가_질답_세트_검토_중_상태가_아니라면_질답_세트_생성에_실패한다() {
            // given
            InterviewCreateRequest interviewCreateRequest = new InterviewCreateRequest(
                    LocalDateTime.of(2025, 12, 29, 10, 0, 0), InterviewType.FIRST, "현대자동차", 1L, 1L, "BE Developer");
            Interview interview1 = createAndSaveInterview(interviewCreateRequest);
            QnaSetCreateRequest request = new QnaSetCreateRequest("test question text", "test answer text");

            // when & then
            given(spec)
                    .body(request)
            .when()
                    .post("/interview/" + interview1.getId() + "/qna-set")
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

        @Test
        void 인터뷰가_질답_세트_검토_중_상태이면_질답_세트_수정에_성공한다() {
            // given
            QnaSetUpdateRequest qnaSetUpdateRequest = new QnaSetUpdateRequest("update question", "update answer", "self review self review");

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
            QnaSetUpdateRequest qnaSetUpdateRequest = new QnaSetUpdateRequest("only question text update", null, null);

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
            QnaSetUpdateRequest qnaSetUpdateRequest = new QnaSetUpdateRequest(null, "only answer text update", null);

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
            QnaSetUpdateRequest qnaSetUpdateRequest = new QnaSetUpdateRequest("", null, "");

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
            QnaSetUpdateRequest qnaSetUpdateRequest = new QnaSetUpdateRequest("update question", "update answer", null);

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
            QnaSetUpdateRequest qnaSetUpdateRequest = new QnaSetUpdateRequest("update question", "update answer", null);

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
    }

    @Nested
    class 질답_세트_삭제_시 {

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
    }

    @Nested
    class PDF_하이라이팅_등록_수정_시 {

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

        @Test
        void 인터뷰가_질답_세트_검토_중_상태가_아니면_PDF_하이라이팅_등록에_실패한다() {
            // given
            List<PdfHighlightingUpdateRequest> request = createPdfHighlightUpdateRequest();

            // when & then
            given(spec)
                    .body(request)
            .when()
                    .put("/qna-set/" + debriefCompletedQnaSetId + "/pdf-highlightings")
            .then()
                    .statusCode(400)
                    .body("code", equalTo(INTERVIEW_REVIEW_STATUS_VALIDATION_FAILED.name()))
                    .body("message", equalTo(INTERVIEW_REVIEW_STATUS_VALIDATION_FAILED.getMessage()))
                    .body("result", nullValue());
        }
    }

    @Nested
    class PDF_하이라이팅_조회_시 {

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
}

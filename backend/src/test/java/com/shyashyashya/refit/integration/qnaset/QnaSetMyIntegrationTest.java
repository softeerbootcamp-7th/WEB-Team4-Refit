package com.shyashyashya.refit.integration.qnaset;

import com.shyashyashya.refit.domain.qnaset.model.StarAnalysis;
import com.shyashyashya.refit.domain.qnaset.repository.QnaSetRepository;
import com.shyashyashya.refit.domain.qnaset.repository.StarAnalysisRepository;
import com.shyashyashya.refit.domain.user.model.User;
import com.shyashyashya.refit.integration.core.IntegrationTest;
import com.shyashyashya.refit.domain.interview.dto.request.InterviewCreateRequest;
import com.shyashyashya.refit.domain.interview.dto.request.QnaSetCreateRequest;
import com.shyashyashya.refit.domain.interview.model.Interview;
import com.shyashyashya.refit.domain.interview.model.InterviewReviewStatus;
import com.shyashyashya.refit.domain.interview.model.InterviewType;
import com.shyashyashya.refit.domain.qnaset.dto.request.QnaSetSearchRequest;
import com.shyashyashya.refit.domain.qnaset.model.QnaSet;
import com.shyashyashya.refit.domain.qnaset.model.StarInclusionLevel;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.MethodArgumentNotValidException;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

import static com.shyashyashya.refit.global.model.ResponseCode.COMMON200;
import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.containsInAnyOrder;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.notNullValue;
import static org.hamcrest.Matchers.nullValue;

public class QnaSetMyIntegrationTest extends IntegrationTest {

    @Autowired
    private QnaSetRepository qnaSetRepository;

    @Autowired
    private StarAnalysisRepository starAnalysisRepository;

    private Interview interview;

    @Nested
    class 내가_어렵게_느낀_질문_조회 {

        private final String path = "/qna-set/my/difficult";

        @Test
        void 어렵다고_표시한_QnA_리스트를_조회한다() {
            // given
            Interview interview = createAndSaveInterview(
                    new InterviewCreateRequest(
                            NOW.minusDays(5),
                            InterviewType.FIRST, company1.getName(), industry1.getId(), jobCategory1.getId(), "Developer"
                    ), InterviewReviewStatus.DEBRIEF_COMPLETED);

            QnaSet difficultQna = QnaSet.create("Question 1", "Answer 1", true, interview, null);
            QnaSet easyQna = QnaSet.create("Question 2", "Answer 2", false, interview, null);
            qnaSetRepository.save(difficultQna);
            qnaSetRepository.save(easyQna);

            // when & then
            given(spec)
            .when()
                    .get(path)
            .then()
                    .statusCode(200)
                    .body("code", equalTo(COMMON200.name()))
                    .body("result.content", hasSize(1))
                    .body("result.content[0].question", equalTo("Question 1"));
        }

        @Test
        void interviewStartAt_오름차순_정렬시_정상적으로_조회된다() {
            // given
            Interview interview1 = createAndSaveInterview(
                    new InterviewCreateRequest(
                            NOW.minusDays(5),
                            InterviewType.FIRST, company1.getName(), industry1.getId(), jobCategory1.getId(), "Developer"
                    ), InterviewReviewStatus.DEBRIEF_COMPLETED);
            qnaSetRepository.save(QnaSet.create("Question 1", "Answer 1", true, interview1, null));

            Interview interview2 = createAndSaveInterview(
                    new InterviewCreateRequest(
                            NOW.minusDays(2),
                            InterviewType.FIRST, company1.getName(), industry1.getId(), jobCategory1.getId(), "Developer"
                    ), InterviewReviewStatus.DEBRIEF_COMPLETED);
            qnaSetRepository.save(QnaSet.create("Question 2", "Answer 2", true, interview2, null));

            // when & then
            given(spec)
                    .queryParam("sort", "interviewStartAt,asc")
            .when()
                    .get(path)
            .then()
                    .statusCode(200)
                    .body("code", equalTo(COMMON200.name()))
                    .body("result.content", hasSize(2))
                    .body("result.content[0].question", equalTo("Question 1"))
                    .body("result.content[1].question", equalTo("Question 2"));
        }

        @Test
        void interviewStartAt_내림차순_정렬시_정상적으로_조회된다() {
            // given
            Interview interview1 = createAndSaveInterview(
                    new InterviewCreateRequest(
                            NOW.minusDays(5),
                            InterviewType.FIRST, company1.getName(), industry1.getId(), jobCategory1.getId(), "Developer"
                    ), InterviewReviewStatus.DEBRIEF_COMPLETED);
            qnaSetRepository.save(QnaSet.create("Question 1", "Answer 1", true, interview1, null));

            Interview interview2 = createAndSaveInterview(
                    new InterviewCreateRequest(
                            NOW.minusDays(2),
                            InterviewType.FIRST, company1.getName(), industry1.getId(), jobCategory1.getId(), "Developer"
                    ), InterviewReviewStatus.DEBRIEF_COMPLETED);
            qnaSetRepository.save(QnaSet.create("Question 2", "Answer 2", true, interview2, null));

            // when & then
            given(spec)
                    .queryParam("sort", "interviewStartAt,desc")
            .when()
                    .get(path)
            .then()
                    .statusCode(200)
                    .body("code", equalTo(COMMON200.name()))
                    .body("result.content", hasSize(2))
                    .body("result.content[0].question", equalTo("Question 2"))
                    .body("result.content[1].question", equalTo("Question 1"));
        }
    }

    @Nested
    class 빈출_질문_카테고리_조회할_때 {

        @BeforeEach
        void setUp() {
            Interview interview = createAndSaveInterview(
                    new InterviewCreateRequest(
                            LocalDateTime.of(2023, 1, 10, 10, 0, 0), InterviewType.FIRST, company1.getName(), industry1.getId(), jobCategory1.getId(), "Developer"
                    ), InterviewReviewStatus.DEBRIEF_COMPLETED);

            createAndSaveQnaSet(new QnaSetCreateRequest("q text", "a text"), interview);

            createAndSaveQnaSet(new QnaSetCreateRequest("q text1-1", "a text"), interview, qnaSetCategory1);
            createAndSaveQnaSet(new QnaSetCreateRequest("q text1-2", "a text"), interview, qnaSetCategory1);

            createAndSaveQnaSet(new QnaSetCreateRequest("q text2-1", "a text"), interview, qnaSetCategory2);
            createAndSaveQnaSet(new QnaSetCreateRequest("q text2-2", "a text"), interview, qnaSetCategory2);
            createAndSaveQnaSet(new QnaSetCreateRequest("q text2-3", "a text"), interview, qnaSetCategory2);

            createAndSaveQnaSet(new QnaSetCreateRequest("q text3-1", "a text"), interview, qnaSetCategory3);
            createAndSaveQnaSet(new QnaSetCreateRequest("q text3-2", "a text"), interview, qnaSetCategory3);
            createAndSaveQnaSet(new QnaSetCreateRequest("q text3-3", "a text"), interview, qnaSetCategory3);
            createAndSaveQnaSet(new QnaSetCreateRequest("q text3-4", "a text"), interview, qnaSetCategory3);
        }

        @Test
        void 성공한다() {
            // given

            // when & then
            given(spec)
            .when()
                    .get("/qna-set/my/frequent/category")
            .then()
                    .statusCode(200)
                    .body("code", equalTo(COMMON200.name()))
                    .body("message", equalTo(COMMON200.getMessage()))
                    .body("result", notNullValue())
                    .body("result.content", hasSize(3))
                    .body("result.content[0].categoryId", equalTo(qnaSetCategory3.getId().intValue()))
                    .body("result.content[0].frequentCount", equalTo(4))
                    .body("result.content[1].categoryId", equalTo(qnaSetCategory2.getId().intValue()))
                    .body("result.content[1].frequentCount", equalTo(3))
                    .body("result.content[2].categoryId", equalTo(qnaSetCategory1.getId().intValue()))
                    .body("result.content[2].frequentCount", equalTo(2));
        }
    }

    @Nested
    class 특정_카테고리_질문_조회할_때 {

        @BeforeEach
        void setUp() {
            Interview interview = createAndSaveInterview(
                    new InterviewCreateRequest(
                            LocalDateTime.of(2023, 1, 10, 10, 0, 0), InterviewType.FIRST, company1.getName(), industry1.getId(), jobCategory1.getId(), "Developer"
                    ), InterviewReviewStatus.DEBRIEF_COMPLETED);

            createAndSaveQnaSet(new QnaSetCreateRequest("q text", "a text"), interview);

            createAndSaveQnaSet(
                    new QnaSetCreateRequest("q text2", "a text"),
                    interview,
                    qnaSetCategory1);

            createAndSaveQnaSet(
                    new QnaSetCreateRequest("q text3", "a text"),
                    interview,
                    qnaSetCategory1);

            createAndSaveQnaSet(
                    new QnaSetCreateRequest("q text3", "a text"),
                    interview,
                    qnaSetCategory1);

            createAndSaveQnaSet(
                    new QnaSetCreateRequest("q text3", "a text"),
                    interview,
                    qnaSetCategory3);
        }

        @Test
        void 질문이_있는_카테고리의_조회를_성공한다() {
            // given

            // when & then
            given(spec)
            .when()
                    .get("/qna-set/my/frequent/category/" + qnaSetCategory1.getId())
            .then()
                    .statusCode(200)
                    .body("code", equalTo(COMMON200.name()))
                    .body("message", equalTo(COMMON200.getMessage()))
                    .body("result", notNullValue());
        }

        @Test
        void 질문이_없는_카테고리의_조회를_성공한다() {
            // given

            // when & then
            given(spec)
            .when()
                    .get("/qna-set/my/frequent/category/" + qnaSetCategory2.getId())
            .then()
                    .statusCode(200)
                    .body("code", equalTo(COMMON200.name()))
                    .body("message", equalTo(COMMON200.getMessage()))
                    .body("result", notNullValue())
                    .body("result.content", hasSize(0));
        }
    }

    @Nested
    class 나의_질답세트_검색_시 {

        private static final String path = "/qna-set/my/search";

        @BeforeEach
        void setup() {
            var request = new InterviewCreateRequest(
                    LocalDateTime.of(2025, 12, 29, 10, 0, 0), InterviewType.FIRST, "현대자동차", 1L, 1L, "BE Developer");
            interview = createAndSaveInterview(request);
        }

        @Test
        void 모든_질답세트를_성공적으로_조회한다() {
            // given
            createQnaSet("질문1", "답변1", false);
            createQnaSet("질문2", "답변2", true);

            var filter = new QnaSetSearchRequest.QnaSearchFilter(
                    null,
                    null,
                    null,
                    null,
                    null
            );
            var request = new QnaSetSearchRequest(null, filter);

            // when & then
            given(spec)
                    .body(request)
            .when()
                    .post(path)
            .then()
                    .assertThat().statusCode(200)
                    .body("code", equalTo(COMMON200.name()))
                    .body("message", equalTo(COMMON200.getMessage()))
                    .body("result", notNullValue())
                    .body("result.content", hasSize(2))
                    .body("result.pageable.pageSize", equalTo(20))
                    .body("result.pageable.pageNumber", equalTo(0));
        }

        @Test
        void 키워드로_질답세트를_필터링하여_성공적으로_조회한다() {
            // given
            createQnaSet("Java 질문", "Java 답변", false);
            createQnaSet("Spring 질문", "Spring 답변", true);
            createQnaSet("Docker", "Container", false);

            var filter = new QnaSetSearchRequest.QnaSearchFilter(
                    null,
                    null,
                    null,
                    null,
                    null
            );
            var request = new QnaSetSearchRequest("Java", filter);

            // when & then
            given(spec)
                    .body(request)
            .when()
                    .post(path)
            .then()
                    .assertThat().statusCode(200)
                    .body("code", equalTo(COMMON200.name()))
                    .body("message", equalTo(COMMON200.getMessage()))
                    .body("result", notNullValue())
                    .body("result.content", hasSize(1))
                    .body("result.content[0].qnaSetInfo.questionText", equalTo("Java 질문"));
        }

        @Test
        void 스타_분석_여부가_있음_일_떄_스타_분석이_있는_질답세트만_조회한다() {
            // given
            QnaSet qnaSetWithStarAnalysis = createQnaSet("스타 분석이 있는 질문", "답변", false);
            createStarAnalysis(qnaSetWithStarAnalysis, StarInclusionLevel.PRESENT, StarInclusionLevel.INSUFFICIENT, StarInclusionLevel.ABSENT, StarInclusionLevel.ABSENT);
            createQnaSet("스타 분석이 없는 질문", "답변", false);

            // when & then
            var filter = new QnaSetSearchRequest.QnaSearchFilter(true, null, null, null, null);
            var request = new QnaSetSearchRequest(null, filter);

            given(spec)
                    .body(request)
            .when()
                    .post(path)
            .then()
                    .assertThat().statusCode(200)
                    .body("code", equalTo(COMMON200.name()))
                    .body("message", equalTo(COMMON200.getMessage()))
                    .body("result", notNullValue())
                    .body("result.content", hasSize(1))
                    .body("result.content[0].qnaSetInfo.questionText", equalTo("스타 분석이 있는 질문"));
        }

        @Test
        void 스타_분석_여부가_없음_일_떄_스타_분석이_없는_질답세트만_조회한다() {
            // given
            QnaSet qnaSetWithStarAnalysis = createQnaSet("스타 분석이 있는 질문", "답변", false);
            createStarAnalysis(qnaSetWithStarAnalysis, StarInclusionLevel.PRESENT, StarInclusionLevel.INSUFFICIENT, StarInclusionLevel.ABSENT, StarInclusionLevel.ABSENT);
            createQnaSet("스타 분석이 없는 질문", "답변", false);

            // when & then
            var filter = new QnaSetSearchRequest.QnaSearchFilter(false, null, null, null, null);
            var request = new QnaSetSearchRequest(null, filter);

            given(spec)
                    .body(request)
            .when()
                    .post(path)
            .then()
                    .assertThat().statusCode(200)
                    .body("code", equalTo(COMMON200.name()))
                    .body("message", equalTo(COMMON200.getMessage()))
                    .body("result", notNullValue())
                    .body("result.content", hasSize(1))
                    .body("result.content[0].qnaSetInfo.questionText", equalTo("스타 분석이 없는 질문"));
        }

        @Test
        void S스타_포함_레벨로_질답세트를_필터링하여_성공적으로_조회한다() {
            // given
            QnaSet qnaSet1 = createQnaSet("S-PRESENT T-INSUFFICIENT", "답변", false);
            createStarAnalysis(qnaSet1, StarInclusionLevel.PRESENT, StarInclusionLevel.INSUFFICIENT, StarInclusionLevel.ABSENT, StarInclusionLevel.ABSENT);

            QnaSet qnaSet2 = createQnaSet("S-INSUFFICIENT T-ABSENT", "답변", false);
            createStarAnalysis(qnaSet2, StarInclusionLevel.INSUFFICIENT, StarInclusionLevel.ABSENT, StarInclusionLevel.ABSENT, StarInclusionLevel.ABSENT);

            QnaSet qnaSet3 = createQnaSet("스타 분석이 없는 질문", "답변", false);

            // when & then
            var filter1 = new QnaSetSearchRequest.QnaSearchFilter(null, Set.of(StarInclusionLevel.PRESENT), null, null, null);
            var request1 = new QnaSetSearchRequest(null, filter1);

            given(spec)
                    .body(request1)
            .when()
                    .post(path)
            .then()
                    .statusCode(200)
                    .body("code", equalTo(COMMON200.name()))
                    .body("message", equalTo(COMMON200.getMessage()))
                    .body("result", notNullValue())
                    .body("result.content", hasSize(2))
                    .body("result.content*.qnaSetInfo.questionText",
                            containsInAnyOrder("S-PRESENT T-INSUFFICIENT", "스타 분석이 없는 질문"));
        }

        @Test
        void T스타_포함_레벨로_질답세트를_필터링하여_성공적으로_조회한다() {
            // given
            QnaSet qnaSet1 = createQnaSet("S-PRESENT T-INSUFFICIENT", "답변", false);
            createStarAnalysis(qnaSet1, StarInclusionLevel.PRESENT, StarInclusionLevel.INSUFFICIENT, StarInclusionLevel.ABSENT, StarInclusionLevel.ABSENT);

            QnaSet qnaSet2 = createQnaSet("S-INSUFFICIENT T-ABSENT", "답변", false);
            createStarAnalysis(qnaSet2, StarInclusionLevel.INSUFFICIENT, StarInclusionLevel.ABSENT, StarInclusionLevel.ABSENT, StarInclusionLevel.ABSENT);

            QnaSet qnaSet3 = createQnaSet("스타 분석이 없는 질문", "답변", false);

            // when & then
            var filter1 = new QnaSetSearchRequest.QnaSearchFilter(null, null, Set.of(StarInclusionLevel.INSUFFICIENT), null, null);
            var request1 = new QnaSetSearchRequest(null, filter1);

            given(spec)
                    .body(request1)
            .when()
                    .post(path)
            .then()
                    .statusCode(200)
                    .body("code", equalTo(COMMON200.name()))
                    .body("message", equalTo(COMMON200.getMessage()))
                    .body("result", notNullValue())
                    .body("result.content", hasSize(2))
                    .body("result.content*.qnaSetInfo.questionText",
                            containsInAnyOrder("S-PRESENT T-INSUFFICIENT", "스타 분석이 없는 질문"));
        }

        @Test
        void A스타_포함_레벨로_질답세트를_필터링하여_성공적으로_조회한다() {
            // given
            QnaSet qnaSet1 = createQnaSet("A-PRESENT T-INSUFFICIENT", "답변", false);
            createStarAnalysis(qnaSet1, StarInclusionLevel.ABSENT, StarInclusionLevel.INSUFFICIENT, StarInclusionLevel.PRESENT, StarInclusionLevel.ABSENT);

            QnaSet qnaSet2 = createQnaSet("S-INSUFFICIENT T-ABSENT", "답변", false);
            createStarAnalysis(qnaSet2, StarInclusionLevel.INSUFFICIENT, StarInclusionLevel.ABSENT, StarInclusionLevel.ABSENT, StarInclusionLevel.ABSENT);

            QnaSet qnaSet3 = createQnaSet("스타 분석이 없는 질문", "답변", false);

            // when & then
            var filter1 = new QnaSetSearchRequest.QnaSearchFilter(null, null, null, Set.of(StarInclusionLevel.PRESENT), null);
            var request1 = new QnaSetSearchRequest(null, filter1);

            given(spec)
                    .body(request1)
            .when()
                    .post(path)
            .then()
                    .statusCode(200)
                    .body("code", equalTo(COMMON200.name()))
                    .body("message", equalTo(COMMON200.getMessage()))
                    .body("result", notNullValue())
                    .body("result.content", hasSize(2))
                    .body("result.content*.qnaSetInfo.questionText",
                            containsInAnyOrder("A-PRESENT T-INSUFFICIENT", "스타 분석이 없는 질문"));
        }

        @Test
        void R스타_포함_레벨로_질답세트를_필터링하여_성공적으로_조회한다() {
            // given
            QnaSet qnaSet1 = createQnaSet("R-PRESENT T-INSUFFICIENT", "답변", false);
            createStarAnalysis(qnaSet1, StarInclusionLevel.ABSENT, StarInclusionLevel.INSUFFICIENT, StarInclusionLevel.ABSENT, StarInclusionLevel.PRESENT);

            QnaSet qnaSet2 = createQnaSet("S-INSUFFICIENT T-ABSENT", "답변", false);
            createStarAnalysis(qnaSet2, StarInclusionLevel.INSUFFICIENT, StarInclusionLevel.ABSENT, StarInclusionLevel.ABSENT, StarInclusionLevel.ABSENT);

            QnaSet qnaSet3 = createQnaSet("스타 분석이 없는 질문", "답변", false);

            // when & then
            var filter1 = new QnaSetSearchRequest.QnaSearchFilter(null, null, null, null, Set.of(StarInclusionLevel.PRESENT));
            var request1 = new QnaSetSearchRequest(null, filter1);

            given(spec)
                    .body(request1)
            .when()
                    .post(path)
            .then()
                    .statusCode(200)
                    .body("code", equalTo(COMMON200.name()))
                    .body("message", equalTo(COMMON200.getMessage()))
                    .body("result", notNullValue())
                    .body("result.content", hasSize(2))
                    .body("result.content*.qnaSetInfo.questionText",
                            containsInAnyOrder("R-PRESENT T-INSUFFICIENT", "스타 분석이 없는 질문"));
        }

        @Test
        void 다른_사용자의_질답세트는_조회되지_않는다() {
            // given
            User otherUser = createAndSaveUser("other@example.com", "otheruser", industry1, jobCategory1);
            var request = new InterviewCreateRequest(
                    LocalDateTime.of(2025, 12, 29, 10, 0, 0), InterviewType.FIRST, "현대자동차", 1L, 1L, "BE Developer");
            Interview otherInterview = createAndSaveInterview(request, InterviewReviewStatus.NOT_LOGGED, otherUser);
            qnaSetRepository.save(QnaSet.create("다른 사용자 질문", "다른 사용자 답변", false, otherInterview, null));
            createQnaSet("나의 질문", "나의 답변", false);

            var filter = new QnaSetSearchRequest.QnaSearchFilter(null, null, null, null, null);
            var searchRequest = new QnaSetSearchRequest(null, filter);

            // when & then
            given(spec)
                    .body(searchRequest)
            .when()
                    .post(path)
            .then()
                    .assertThat().statusCode(200)
                    .body("code", equalTo(COMMON200.name()))
                    .body("message", equalTo(COMMON200.getMessage()))
                    .body("result", notNullValue())
                    .body("result.content", hasSize(1))
                    .body("result.content[0].qnaSetInfo.questionText", equalTo("나의 질문"));
        }

        @Test
        void 질답세트가_없는_경우_빈_리스트를_반환한다() {
            // given
            var filter =  new QnaSetSearchRequest.QnaSearchFilter(null, null, null, null, null);
            var request = new QnaSetSearchRequest(null, filter);

            // when & then
            given(spec)
                    .body(request)
            .when()
                    .post(path)
            .then()
                    .assertThat().statusCode(200)
                    .body("code", equalTo(COMMON200.name()))
                    .body("message", equalTo(COMMON200.getMessage()))
                    .body("result", notNullValue())
                    .body("result.content", hasSize(0))
                    .body("result.totalElements", equalTo(0));
        }

        @Test
        void 키워드_검색_결과가_없는_경우_빈_리스트를_반환한다() {
            // given
            createQnaSet("질문", "답변", false);
            var filter = new QnaSetSearchRequest.QnaSearchFilter(null, null, null, null, null);
            var request = new QnaSetSearchRequest("없는 키워드", filter);

            // when & then
            given(spec)
                    .body(request)
            .when()
                    .post(path)
            .then()
                    .assertThat().statusCode(200)
                    .body("code", equalTo(COMMON200.name()))
                    .body("message", equalTo(COMMON200.getMessage()))
                    .body("result", notNullValue())
                    .body("result.content", hasSize(0))
                    .body("result.totalElements", equalTo(0));
        }

        @Test
        void searchFilter_필드에_null을_전달하면_유효성_검증에_실패한다() {
            // given
            createQnaSet("질문", "답변", false);
            var request = new QnaSetSearchRequest("없는 키워드", null);

            // when & then
            given(spec)
                    .body(request)
            .when()
                    .post(path)
            .then()
                    .assertThat().statusCode(400)
                    .body("code", equalTo(MethodArgumentNotValidException.class.getName()))
                    .body("result", nullValue());
        }

        private QnaSet createQnaSet(String question, String answer, boolean isMarkedDifficult) {
            return qnaSetRepository.save(QnaSet.create(question, answer, isMarkedDifficult, interview, null));
        }

        private StarAnalysis createStarAnalysis(
                QnaSet qnaSet,
                StarInclusionLevel sLevel,
                StarInclusionLevel tLevel,
                StarInclusionLevel aLevel,
                StarInclusionLevel rLevel
        ) {
            var starAnalysis = StarAnalysis.create(qnaSet);
            starAnalysis.complete(sLevel, tLevel, aLevel, rLevel, "");
            return starAnalysisRepository.save(starAnalysis);
        }
    }
}

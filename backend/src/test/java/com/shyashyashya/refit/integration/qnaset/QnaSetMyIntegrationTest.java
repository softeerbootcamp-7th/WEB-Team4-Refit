package com.shyashyashya.refit.integration.qnaset;

import com.shyashyashya.refit.core.IntegrationTest;
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

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import static com.shyashyashya.refit.global.model.ResponseCode.COMMON200;
import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.notNullValue;
import static org.hamcrest.Matchers.nullValue;

public class QnaSetMyIntegrationTest extends IntegrationTest {

    @BeforeEach
    void setUp() {
        Interview interview = createAndSaveInterview(
                new InterviewCreateRequest(
                        LocalDateTime.of(2023, 1, 10, 10, 0, 0), InterviewType.FIRST, company1.getName(), industry1.getId(), jobCategory1.getId(), "Developer"
                ), InterviewReviewStatus.DEBRIEF_COMPLETED);

        // category가 null인 qnaSet 존재하면 NPE 발생
        // QnaSet qnaSet1 = createAndSaveQnaSet(new QnaSetCreateRequest("q text", "a text"), interview);

        QnaSet qnaSet2 = createAndSaveQnaSet(
                new QnaSetCreateRequest("q text2", "a text"),
                interview,
                qnaSetCategory1);

        QnaSet qnaSet3 = createAndSaveQnaSet(
                new QnaSetCreateRequest("q text3", "a text"),
                interview,
                qnaSetCategory1);

        QnaSet qnaSet4 = createAndSaveQnaSet(
                new QnaSetCreateRequest("q text3", "a text"),
                interview,
                qnaSetCategory1);

        QnaSet qnaSet5 = createAndSaveQnaSet(
                new QnaSetCreateRequest("q text3", "a text"),
                interview,
                qnaSetCategory3);
    }

    @Nested
    class 빈출_질문_카테고리_조회할_때 {

        @Test
        void 성공한다() {

            given(spec)
            .when()
                    .get("/qna-set/my/frequent/category")
            .then()
                    .statusCode(200)
                    .body("code", equalTo(COMMON200.name()))
                    .body("message", equalTo(COMMON200.getMessage()))
                    .body("result", notNullValue());
        }
    }

    @Nested
    class 특정_카테고리_질문_조회할_때 {

        @Test
        void 질문이_있는_카테고리의_조회를_성공한다() {
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
    class 나의_면접_질문_검색할_때 {

        @Test
        void 모든_질문_검색을_성공한다() {
            Set<StarInclusionLevel> inclusionLevels = new HashSet<>();
            inclusionLevels.add(StarInclusionLevel.NULL);

            QnaSetSearchRequest request = new QnaSetSearchRequest(
                    null,
                    new QnaSetSearchRequest.QnaSearchFilter(
                            null,
                            inclusionLevels,
                            inclusionLevels,
                            inclusionLevels,
                            inclusionLevels
                    )
            );

            given(spec)
                    .body(request)
            .when()
                    .post("/qna-set/my/search")
            .then()
                    .statusCode(200)
                    .body("code", equalTo(COMMON200.name()))
                    .body("message", equalTo(COMMON200.getMessage()))
                    .body("result", notNullValue())
                    .body("result.content", hasSize(4));
        }
    }
}

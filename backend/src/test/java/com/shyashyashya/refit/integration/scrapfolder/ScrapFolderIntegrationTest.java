package com.shyashyashya.refit.integration.scrapfolder;

import com.shyashyashya.refit.domain.interview.dto.request.InterviewCreateRequest;
import com.shyashyashya.refit.domain.interview.dto.request.QnaSetCreateRequest;
import com.shyashyashya.refit.domain.interview.model.Interview;
import com.shyashyashya.refit.domain.interview.model.InterviewReviewStatus;
import com.shyashyashya.refit.domain.interview.model.InterviewType;
import com.shyashyashya.refit.domain.qnaset.model.QnaSet;
import com.shyashyashya.refit.domain.scrapfolder.model.QnaSetScrapFolder;
import com.shyashyashya.refit.domain.scrapfolder.model.ScrapFolder;
import com.shyashyashya.refit.domain.scrapfolder.repository.QnaSetScrapFolderRepository;
import com.shyashyashya.refit.domain.scrapfolder.repository.ScrapFolderRepository;
import com.shyashyashya.refit.global.exception.ErrorCode;
import com.shyashyashya.refit.integration.core.IntegrationTest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import java.time.LocalDateTime;

import static com.shyashyashya.refit.global.model.ResponseCode.COMMON200;
import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.notNullValue;

public class ScrapFolderIntegrationTest extends IntegrationTest {

    @Autowired
    private ScrapFolderRepository scrapFolderRepository;

    @Autowired
    private QnaSetScrapFolderRepository qnaSetScrapFolderRepository;

    @Nested
    class 스크랩_폴더_내_질문_리스트_조회할_때 {

        private ScrapFolder scrapFolder;

        @BeforeEach
        void setUp() {
            scrapFolder = scrapFolderRepository.save(ScrapFolder.create("테스트 폴더", requestUser));

            Interview interview1 = createAndSaveInterview(new InterviewCreateRequest(
                            LocalDateTime.of(2025, 1, 10, 10, 0, 0),
                            InterviewType.FIRST, company1.getName(), industry1.getId(), jobCategory1.getId(), "Developer"),
                    InterviewReviewStatus.DEBRIEF_COMPLETED);

            Interview interview2 = createAndSaveInterview(new InterviewCreateRequest(
                            LocalDateTime.of(2025, 2, 20, 14, 0, 0),
                            InterviewType.SECOND, company2.getName(), industry2.getId(), jobCategory2.getId(), "Developer"),
                    InterviewReviewStatus.DEBRIEF_COMPLETED);

            QnaSet qnaSet1 = createAndSaveQnaSet(new QnaSetCreateRequest("질문1", "답변1"), interview1);
            QnaSet qnaSet2 = createAndSaveQnaSet(new QnaSetCreateRequest("질문2", "답변2"), interview2);

            qnaSetScrapFolderRepository.save(QnaSetScrapFolder.create(qnaSet1, scrapFolder));
            qnaSetScrapFolderRepository.save(QnaSetScrapFolder.create(qnaSet2, scrapFolder));
        }

        @Test
        void interviewStartAt_오름차순_정렬시_정상적으로_조회된다() {
            given(spec)
                    .queryParam("sort", "interviewStartAt,asc")
            .when()
                    .get("/scrap-folder/{scrapFolderId}", scrapFolder.getId())
            .then()
                    .statusCode(200)
                    .body("code", equalTo(COMMON200.name()))
                    .body("message", equalTo(COMMON200.getMessage()))
                    .body("result", notNullValue())
                    .body("result.content", hasSize(2))
                    .body("result.content[0].qnaSet.questionText", equalTo("질문1"))
                    .body("result.content[1].qnaSet.questionText", equalTo("질문2"));
        }

        @Test
        void interviewStartAt_내림차순_정렬시_정상적으로_조회된다() {
            given(spec)
                    .queryParam("sort", "interviewStartAt,desc")
            .when()
                    .get("/scrap-folder/{scrapFolderId}", scrapFolder.getId())
            .then()
                    .statusCode(200)
                    .body("code", equalTo(COMMON200.name()))
                    .body("message", equalTo(COMMON200.getMessage()))
                    .body("result", notNullValue())
                    .body("result.content", hasSize(2))
                    .body("result.content[0].qnaSet.questionText", equalTo("질문2"))
                    .body("result.content[1].qnaSet.questionText", equalTo("질문1"));
        }

        @Test
        void 잘못된_정렬_속성_전달시_에러_응답을_반환한다() {
            given(spec)
                    .queryParam("sort", "invalidProperty,asc")
            .when()
                    .get("/scrap-folder/{scrapFolderId}", scrapFolder.getId())
            .then()
                    .statusCode(ErrorCode.SORTING_PROPERTY_NOT_EXISTS.getHttpStatus().value())
                    .body("code", equalTo(ErrorCode.SORTING_PROPERTY_NOT_EXISTS.name()))
                    .body("message", equalTo(ErrorCode.SORTING_PROPERTY_NOT_EXISTS.getMessage()));
        }
    }
}

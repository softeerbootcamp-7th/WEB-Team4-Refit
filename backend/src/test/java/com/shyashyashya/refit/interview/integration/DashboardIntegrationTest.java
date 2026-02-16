package com.shyashyashya.refit.interview.integration;

import static com.shyashyashya.refit.global.model.ResponseCode.COMMON200;
import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.containsInAnyOrder;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.notNullValue;

import com.shyashyashya.refit.core.IntegrationTest;
import com.shyashyashya.refit.domain.interview.dto.request.InterviewCreateRequest;
import com.shyashyashya.refit.domain.interview.model.Interview;
import com.shyashyashya.refit.domain.interview.model.InterviewReviewStatus;
import com.shyashyashya.refit.domain.interview.model.InterviewType;
import com.shyashyashya.refit.domain.qnaset.model.QnaSet;
import com.shyashyashya.refit.domain.qnaset.repository.QnaSetRepository;
import java.time.LocalDateTime;
import java.util.List;

import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.EnumSource;
import org.springframework.beans.factory.annotation.Autowired;

public class DashboardIntegrationTest extends IntegrationTest {

    @Autowired
    private QnaSetRepository qnaSetRepository;

    @Nested
    class 대시보드_헤드라인_조회 {

        private final String path = "/dashboard/headline";

        @Test
        void 면접_일정이_없는_경우_REGISTER_INTERVIEW_타입을_반환한다() {
            // given

            // when & then
            given(spec)
            .when()
                    .get(path)
            .then()
                    .statusCode(200)
                    .body("code", equalTo(COMMON200.name()))
                    .body("result.headlineType", equalTo("REGISTER_INTERVIEW"));
        }

        @Test
        void 일주일_내_예정된_면접이_있는_경우_PREPARE_INTERVIEW_타입을_반환한다() {
            // given
            LocalDateTime upcomingDate = NOW.plusDays(3);
            var request = new InterviewCreateRequest(upcomingDate, InterviewType.FIRST, company1.getName(), industry1.getId(), jobCategory1.getId(), "Developer");
            createAndSaveInterview(request, InterviewReviewStatus.NOT_LOGGED);

            // when & then
            given(spec)
            .when()
                    .get(path)
            .then()
                    .statusCode(200)
                    .body("code", equalTo(COMMON200.name()))
                    .body("result.headlineType", equalTo("PREPARE_INTERVIEW"))
                    .body("result.upcomingInterviewDday", notNullValue());
        }

        @ParameterizedTest
        @EnumSource(value = InterviewReviewStatus.class, names = {"NOT_LOGGED", "LOG_DRAFT", "QNA_SET_DRAFT", "SELF_REVIEW_DRAFT"})
        void 일주일_내_예정된_면접이_있고_아직_복기하지_않은_면접도_있는_경우_PREPARE_INTERVIEW_타입을_반환한다(InterviewReviewStatus reviewStatus) {
            // given
            LocalDateTime upcomingDate = NOW.plusDays(3);
            var upcomingRequest = new InterviewCreateRequest(upcomingDate, InterviewType.FIRST, company1.getName(), industry1.getId(), jobCategory1.getId(), "Developer");
            createAndSaveInterview(upcomingRequest, InterviewReviewStatus.NOT_LOGGED);

            LocalDateTime pastDate = NOW.minusDays(3);
            var request = new InterviewCreateRequest(pastDate, InterviewType.FIRST, company1.getName(), industry1.getId(), jobCategory1.getId(), "Developer");
            createAndSaveInterview(request, reviewStatus);

            // when & then
            given(spec)
            .when()
                    .get(path)
            .then()
                    .statusCode(200)
                    .body("code", equalTo(COMMON200.name()))
                    .body("result.headlineType", equalTo("PREPARE_INTERVIEW"))
                    .body("result.upcomingInterviewDday", notNullValue());
        }

        @ParameterizedTest
        @EnumSource(value = InterviewReviewStatus.class, names = {"NOT_LOGGED", "LOG_DRAFT", "QNA_SET_DRAFT", "SELF_REVIEW_DRAFT"})
        void 복기를_완료하지_않은_면접이_있는_경우_REVIEW_INTERVIEW_타입을_반환한다(InterviewReviewStatus reviewStatus) {
            // given
            LocalDateTime pastDate = NOW.minusDays(3);
            var request = new InterviewCreateRequest(pastDate, InterviewType.FIRST, company1.getName(), industry1.getId(), jobCategory1.getId(), "Developer");
            createAndSaveInterview(request, reviewStatus);

            // when & then
            given(spec)
            .when()
                    .get(path)
            .then()
                    .statusCode(200)
                    .body("code", equalTo(COMMON200.name()))
                    .body("result.headlineType", equalTo("REVIEW_INTERVIEW"));
        }

        @ParameterizedTest
        @EnumSource(value = InterviewReviewStatus.class, names = {"NOT_LOGGED", "LOG_DRAFT", "QNA_SET_DRAFT", "SELF_REVIEW_DRAFT"})
        void 일주일_바깥에_예정된_면접이_있고_복기를_완료하지_않은_면접이_있는_경우_REVIEW_INTERVIEW_타입을_반환한다(InterviewReviewStatus reviewStatus) {
            // given
            LocalDateTime futureDate = NOW.plusDays(10);
            var futureInterviewRequest = new InterviewCreateRequest(futureDate, InterviewType.FIRST, company1.getName(), industry1.getId(), jobCategory1.getId(), "Developer");
            createAndSaveInterview(futureInterviewRequest, InterviewReviewStatus.DEBRIEF_COMPLETED);

            LocalDateTime pastDate = NOW.minusDays(3);
            var request = new InterviewCreateRequest(pastDate, InterviewType.FIRST, company1.getName(), industry1.getId(), jobCategory1.getId(), "Developer");
            createAndSaveInterview(request, reviewStatus);

            // when & then
            given(spec)
            .when()
                    .get(path)
            .then()
                    .statusCode(200)
                    .body("code", equalTo(COMMON200.name()))
                    .body("result.headlineType", equalTo("REVIEW_INTERVIEW"));
        }

        @Test
        void 예정된_면접이_없고_모든_면접을_복기_완료했다면_CHECK_INTERVIEW_HISTORY_타입을_반환한다() {
            // given
            LocalDateTime pastDate = NOW.minusDays(10);
            var request = new InterviewCreateRequest(pastDate, InterviewType.FIRST, company1.getName(), industry1.getId(), jobCategory1.getId(), "Developer");
            createAndSaveInterview(request, InterviewReviewStatus.DEBRIEF_COMPLETED);

            // when & then
            given(spec)
            .when()
                    .get(path)
            .then()
                    .statusCode(200)
                    .body("code", equalTo(COMMON200.name()))
                    .body("result.headlineType", equalTo("CHECK_INTERVIEW_HISTORY"));
        }

        @Test
        void 일주일_바깥에_예정된_면접이_있고_모든_면접을_복기_완료했다면_CHECK_INTERVIEW_HISTORY_타입을_반환한다() {
            // given
            LocalDateTime futureDate = NOW.plusDays(10);
            var futureInterviewRequest = new InterviewCreateRequest(futureDate, InterviewType.FIRST, company1.getName(), industry1.getId(), jobCategory1.getId(), "Developer");
            createAndSaveInterview(futureInterviewRequest, InterviewReviewStatus.DEBRIEF_COMPLETED);

            LocalDateTime pastDate = NOW.minusDays(10);
            var request = new InterviewCreateRequest(pastDate, InterviewType.FIRST, company1.getName(), industry1.getId(), jobCategory1.getId(), "Developer");
            createAndSaveInterview(request, InterviewReviewStatus.DEBRIEF_COMPLETED);

            // when & then
            given(spec)
            .when()
                    .get(path)
            .then()
                    .statusCode(200)
                    .body("code", equalTo(COMMON200.name()))
                    .body("result.headlineType", equalTo("CHECK_INTERVIEW_HISTORY"));
        }
    }

    @Nested
    class 대시보드_캘린더_조회 {

        private final String path = "/dashboard/calendar/interview";

        @Test
        void 특정_월의_면접_일정을_조회한다() {
            // given
            LocalDateTime startOfMonth = LocalDateTime.of(NOW.getYear(), NOW.getMonth(), 1, 10, 0);
            LocalDateTime endOfMonth = startOfMonth.plusMonths(1).minusDays(1);

            int id1 = createAndSaveInterview(
                new InterviewCreateRequest(
                        startOfMonth,
                        InterviewType.FIRST, company1.getName(), industry1.getId(), jobCategory1.getId(), "Developer"
                ), InterviewReviewStatus.NOT_LOGGED).getId().intValue();

            int id2 = createAndSaveInterview(
                new InterviewCreateRequest(
                        endOfMonth,
                        InterviewType.SECOND, company2.getName(), industry1.getId(), jobCategory1.getId(), "Engineer"
                ), InterviewReviewStatus.NOT_LOGGED).getId().intValue();

            int id3 = createAndSaveInterview(
                    new InterviewCreateRequest(
                            endOfMonth,
                            InterviewType.SECOND, company2.getName(), industry1.getId(), jobCategory1.getId(), "Engineer"
                    ), InterviewReviewStatus.NOT_LOGGED).getId().intValue();

            createAndSaveInterview(
                    new InterviewCreateRequest(
                            startOfMonth.minusDays(1),
                            InterviewType.SECOND, company2.getName(), industry1.getId(), jobCategory1.getId(), "Engineer"
                    ), InterviewReviewStatus.NOT_LOGGED);

            createAndSaveInterview(
                    new InterviewCreateRequest(
                            endOfMonth.plusDays(1),
                            InterviewType.SECOND, company2.getName(), industry1.getId(), jobCategory1.getId(), "Engineer"
                    ), InterviewReviewStatus.NOT_LOGGED);

            // when & then
            given(spec)
                    .queryParam("year", NOW.getYear())
                    .queryParam("month", NOW.getMonthValue())
            .when()
                    .get(path)
            .then()
                    .statusCode(200)
                    .body("code", equalTo(COMMON200.name()))
                    .body("result", hasSize(2))
                    .body("result*.interviews.interviewId", containsInAnyOrder(List.of(id1), List.of(id2, id3)));
        }
    }

    @Nested
    class 곧_있을_면접_조회 {

        private final String path = "/dashboard/interview/upcoming";

        @Test
        void 곧_있을_면접_리스트를_조회한다() {
            // given
            LocalDateTime upcomingDate = NOW.plusDays(2);

            createAndSaveInterview(
                new InterviewCreateRequest(
                    upcomingDate,
                    InterviewType.FIRST, company1.getName(), industry1.getId(), jobCategory1.getId(), "Developer"
                ), InterviewReviewStatus.NOT_LOGGED);

            // when & then
            given(spec)
            .when()
                    .get(path)
            .then()
                    .statusCode(200)
                    .body("code", equalTo(COMMON200.name()))
                    .body("result.content", hasSize(1))
                    .body("result.content[0].upcomingInterview.companyName", equalTo(company1.getName()));
        }
    }

    @Nested
    class 내가_어렵게_느낀_질문_조회 {

        private final String path = "/dashboard/qna-set/my/difficult";

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
    }

    @Nested
    class 복기_대기중인_면접_조회 {

        private final String path = "/dashboard/interview/debrief-uncompleted";

        @ParameterizedTest
        @EnumSource(value = InterviewReviewStatus.class, names = {"NOT_LOGGED", "LOG_DRAFT", "QNA_SET_DRAFT", "SELF_REVIEW_DRAFT"})
        void 복기가_완료되지_않은_면접_리스트를_조회한다(InterviewReviewStatus reviewStatus) {
            // given
            int interviewId = createAndSaveInterview(
                new InterviewCreateRequest(
                    NOW.minusDays(1),
                    InterviewType.FIRST, company1.getName(), industry1.getId(), jobCategory1.getId(), "Developer"
                ), reviewStatus).getId().intValue();

            createAndSaveInterview(
                new InterviewCreateRequest(
                    NOW.minusDays(2),
                    InterviewType.SECOND, company2.getName(), industry1.getId(), jobCategory1.getId(), "Engineer"
                ), InterviewReviewStatus.DEBRIEF_COMPLETED);

            // when & then
            given(spec)
            .when()
                    .get(path)
            .then()
                    .statusCode(200)
                    .body("code", equalTo(COMMON200.name()))
                    .body("result.content", hasSize(1))
                    .body("result.content[0].interview.interviewId", equalTo(interviewId));
        }
    }
}

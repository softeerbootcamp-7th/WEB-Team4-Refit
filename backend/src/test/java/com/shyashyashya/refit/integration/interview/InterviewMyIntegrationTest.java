package com.shyashyashya.refit.integration.interview;

import static com.shyashyashya.refit.global.model.ResponseCode.COMMON200;
import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.in;
import static org.hamcrest.Matchers.notNullValue;
import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.nullValue;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

import com.shyashyashya.refit.integration.core.IntegrationTest;
import com.shyashyashya.refit.domain.company.repository.CompanyRepository;
import com.shyashyashya.refit.domain.interview.dto.request.InterviewCreateRequest;
import com.shyashyashya.refit.domain.interview.dto.request.InterviewDraftType;
import com.shyashyashya.refit.domain.interview.dto.request.InterviewSearchRequest;
import com.shyashyashya.refit.domain.interview.model.Interview;
import com.shyashyashya.refit.domain.interview.model.InterviewResultStatus;
import com.shyashyashya.refit.domain.interview.model.InterviewReviewStatus;
import com.shyashyashya.refit.domain.interview.model.InterviewType;
import com.shyashyashya.refit.domain.company.model.Company;
import com.shyashyashya.refit.domain.interview.repository.InterviewRepository;
import com.shyashyashya.refit.domain.user.model.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;

public class InterviewMyIntegrationTest extends IntegrationTest {

    @Autowired
    private InterviewRepository interviewRepository;

    @Autowired
    private CompanyRepository companyRepository;

    @Nested
    class 면접을_검색할_때 {

        private final String path = "/interview/my/search";

        private Company company1;
        private Company company2;
        private Company company3;
        private Company company4;

        @BeforeEach
        void createTestData() {
            companyRepository.deleteAll();
            company1 = createAndSaveCompany("삼성전자");
            company2 = createAndSaveCompany("카카오");
            company3 = createAndSaveCompany("현대건설");
            company4 = createAndSaveCompany("현대ICT본부");

            Interview interview1 = createAndSaveInterview(
                new InterviewCreateRequest(
                    LocalDateTime.of(2023, 1, 10, 10, 0, 0), InterviewType.FIRST, company1.getName(), industry1.getId(), jobCategory1.getId(), "Developer"
                ), InterviewReviewStatus.DEBRIEF_COMPLETED);

            Interview interview2 = createAndSaveInterview(
                new InterviewCreateRequest(
                    LocalDateTime.of(2023, 2, 15, 11, 0, 0), InterviewType.SECOND, company2.getName(), industry1.getId(), jobCategory1.getId(), "Engineer"
                ), InterviewReviewStatus.DEBRIEF_COMPLETED);
            interview2.updateResultStatus(InterviewResultStatus.PASS);

            Interview interview3 = createAndSaveInterview(
                new InterviewCreateRequest(
                    LocalDateTime.of(2024, 3, 20, 12, 0, 0), InterviewType.THIRD, company3.getName(), industry1.getId(), jobCategory1.getId(), "Manager"
                ), InterviewReviewStatus.DEBRIEF_COMPLETED);
            interview3.updateResultStatus(InterviewResultStatus.FAIL);

            Interview interview4 = createAndSaveInterview(
                new InterviewCreateRequest(
                    LocalDateTime.of(2024, 4, 25, 13, 0, 0), InterviewType.FIRST, company4.getName(), industry1.getId(), jobCategory1.getId(), "Developer"
                ), InterviewReviewStatus.DEBRIEF_COMPLETED);
            interview4.updateResultStatus(InterviewResultStatus.PASS);

            interviewRepository.saveAll(List.of(interview1, interview2, interview3, interview4));
        }

        @Test
        void 검색_조건_없이_전체_면접을_조회한다() {
            InterviewSearchRequest request = new InterviewSearchRequest(null, new InterviewSearchRequest.InterviewSearchFilter(null, null, null, null));

            given(spec)
                    .contentType(MediaType.APPLICATION_JSON_VALUE)
                    .body(request)
            .when()
                    .post(path)
            .then()
                    .statusCode(200)
                    .body("code", equalTo(COMMON200.name()))
                    .body("message", equalTo(COMMON200.getMessage()))
                    .body("result", notNullValue())
                    .body("result.content", hasSize(4))
                    .body("result.totalElements", equalTo(4));
        }

        @Test
        void 키워드로_면접을_검색하면_회사_이름에서_검색한다() {
            InterviewSearchRequest request = new InterviewSearchRequest("현대", new InterviewSearchRequest.InterviewSearchFilter(null, null, null, null));

            given(spec)
                    .contentType(MediaType.APPLICATION_JSON_VALUE)
                    .body(request)
            .when()
                    .post(path)
            .then()
                    .statusCode(200)
                    .body("code", equalTo(COMMON200.name()))
                    .body("message", equalTo(COMMON200.getMessage()))
                    .body("result.content", hasSize(2))
                    .body("result.content[0].companyName", in(List.of(company3.getName(), company4.getName())))
                    .body("result.content[1].companyName", in(List.of(company3.getName(), company4.getName())))
                    .body("result.totalElements", equalTo(2));
        }

        @Test
        void 면접_타입으로_면접을_검색한다() {
            InterviewSearchRequest request = new InterviewSearchRequest(
                    null, new InterviewSearchRequest.InterviewSearchFilter(Set.of(InterviewType.FIRST),
                    null, null, null));

            given(spec)
                    .contentType(MediaType.APPLICATION_JSON_VALUE)
                    .body(request)
            .when()
                    .post(path)
            .then()
                    .statusCode(200)
                    .body("code", equalTo(COMMON200.name()))
                    .body("message", equalTo(COMMON200.getMessage()))
                    .body("result.content", hasSize(2))
                    .body("result.content[0].companyName", in(List.of(company1.getName(), company4.getName())))
                    .body("result.content[1].companyName", in(List.of(company1.getName(), company4.getName())))
                    .body("result.totalElements", equalTo(2));
        }

        @Test
        void 면접_결과로_면접을_검색한다() {
            InterviewSearchRequest request = new InterviewSearchRequest(null, new InterviewSearchRequest.InterviewSearchFilter(null, Set.of(InterviewResultStatus.PASS), null, null));

            given(spec)
                    .body(request)
            .when()
                    .post(path)
            .then()
                    .statusCode(200)
                    .body("code", equalTo(COMMON200.name()))
                    .body("message", equalTo(COMMON200.getMessage()))
                    .body("result.content", hasSize(2))
                    .body("result.content[0].companyName", in(List.of(company2.getName(), company4.getName())))
                    .body("result.content[1].companyName", in(List.of(company2.getName(), company4.getName())))
                    .body("result.totalElements", equalTo(2));
        }

        @Test
        void 날짜_범위로_면접을_검색한다() {
            // Search for interviews in 2024
            InterviewSearchRequest request = new InterviewSearchRequest(
                null, new InterviewSearchRequest.InterviewSearchFilter(
                    null, null, LocalDate.of(2023, 1, 1), LocalDate.of(2023, 12, 31)));

            given(spec)
                    .body(request)
            .when()
                    .post(path)
            .then()
                    .statusCode(200)
                    .body("code", equalTo(COMMON200.name()))
                    .body("message", equalTo(COMMON200.getMessage()))
                    .body("result.content", hasSize(2))
                    .body("result.content[0].companyName", in(List.of(company1.getName(), company2.getName())))
                    .body("result.content[1].companyName", in(List.of(company1.getName(), company2.getName())))
                    .body("result.totalElements", equalTo(2));
        }

        @Test
        void 여러_조건으로_면접을_검색한다() {
            InterviewSearchRequest request = new InterviewSearchRequest(
                "현대", new InterviewSearchRequest.InterviewSearchFilter(
                    Set.of(InterviewType.FIRST), Set.of(InterviewResultStatus.PASS),
                    LocalDate.of(2024, 1, 1), LocalDate.of(2024, 12, 31)));

            given(spec)
                    .body(request)
            .when()
                    .post(path)
            .then()
                    .statusCode(200)
                    .body("code", equalTo(COMMON200.name()))
                    .body("message", equalTo(COMMON200.getMessage()))
                    .body("result.content", hasSize(1))
                    .body("result.content[0].companyName", equalTo(company4.getName()))
                    .body("result.totalElements", equalTo(1));
        }

        @Test
        void 검색_결과가_없는_경우_빈_리스트를_반환한다() {
            InterviewSearchRequest request = new InterviewSearchRequest("NonExistentKeyword", new InterviewSearchRequest.InterviewSearchFilter(null, null, null, null));

            given(spec)
                    .body(request)
            .when()
                    .post(path)
            .then()
                    .statusCode(200)
                    .body("code", equalTo(COMMON200.name()))
                    .body("message", equalTo(COMMON200.getMessage()))
                    .body("result.content", hasSize(0))
                    .body("result.totalElements", equalTo(0));
        }

        @Test
        void 다른_사용자의_면접은_검색_결과에_포함되지_않는다() {
            User otherUser = createAndSaveUser("test2@exmaple.com", "test2", industry1, jobCategory1);
            Interview otherInterview = createAndSaveInterview(
                    new InterviewCreateRequest(
                            LocalDateTime.of(2024, 4, 25, 13, 0, 0), InterviewType.FIRST, company1.getName(), industry1.getId(), jobCategory1.getId(), "Developer"
                    ), InterviewReviewStatus.NOT_LOGGED, otherUser);
            otherInterview.startLogging();
            otherInterview.completeLogging();
            otherInterview.completeQnaSetDraft();
            otherInterview.completeReview();

            InterviewSearchRequest request = new InterviewSearchRequest("현대", new InterviewSearchRequest.InterviewSearchFilter(null, null, null, null));

            given(spec)
                    .body(request)
                    .when()
                    .post(path)
            .then()
                    .statusCode(200)
                    .body("code", equalTo(COMMON200.name()))
                    .body("message", equalTo(COMMON200.getMessage()))
                    .body("result.content", hasSize(2))
                    .body("result.content[0].companyName", in(List.of(company3.getName(), company4.getName())))
                    .body("result.content[1].companyName", in(List.of(company3.getName(), company4.getName())))
                    .body("result.totalElements", equalTo(2));
        }

        @Test
        void 복기를_완료햐지_않은_면접은_검색_결과에_포함되지_않는다() {
            createAndSaveInterview(new InterviewCreateRequest(
                            LocalDateTime.of(2024, 4, 25, 13, 0, 0), InterviewType.FIRST, company1.getName(), industry1.getId(), jobCategory1.getId(), "Developer"));

            Interview logDraftInterview = createAndSaveInterview(new InterviewCreateRequest(
                    LocalDateTime.of(2024, 4, 25, 13, 0, 0), InterviewType.FIRST, company1.getName(), industry1.getId(), jobCategory1.getId(), "Developer"));
            logDraftInterview.startLogging();

            Interview reviewDraftInterview = createAndSaveInterview(new InterviewCreateRequest(
                    LocalDateTime.of(2024, 4, 25, 13, 0, 0), InterviewType.FIRST, company1.getName(), industry1.getId(), jobCategory1.getId(), "Developer"));
            reviewDraftInterview.startLogging();
            reviewDraftInterview.completeLogging();

            InterviewSearchRequest request = new InterviewSearchRequest("현대", new InterviewSearchRequest.InterviewSearchFilter(null, null, null, null));

            given(spec)
                    .body(request)
            .when()
                    .post(path)
            .then()
                    .statusCode(200)
                    .body("code", equalTo(COMMON200.name()))
                    .body("message", equalTo(COMMON200.getMessage()))
                    .body("result.content", hasSize(2))
                    .body("result.content[0].companyName", in(List.of(company3.getName(), company4.getName())))
                    .body("result.content[1].companyName", in(List.of(company3.getName(), company4.getName())))
                    .body("result.totalElements", equalTo(2));
        }

        @Test
        void searchFilter_필드를_null로_전송하면_유효성_검증에_실패한다() {
            InterviewSearchRequest request = new InterviewSearchRequest("", null);

            given(spec)
                    .body(request)
            .when()
                    .post(path)
            .then()
                    .statusCode(400)
                    .body("result", nullValue());
        }
    }

    @Nested
    class 나의_최근_한_달동안_기록을_시작하지_않은_면접_리스트를_조회할_때 {

        private final String path = "/interview/my/not-logged";

        @Test
        void 다른_사람의_면접은_조회되지_않는다() {
            User otherUser = createAndSaveUser("other2@example.com", "other2", industry1, jobCategory1);
            createAndSaveInterview(new InterviewCreateRequest(
                    LocalDateTime.now(), InterviewType.FIRST, company1.getName(), industry1.getId(), jobCategory1.getId(), "Developer"
            ), InterviewReviewStatus.NOT_LOGGED, otherUser);

            createAndSaveInterview(new InterviewCreateRequest(
                    LocalDateTime.now(), InterviewType.FIRST, company2.getName(), industry1.getId(), jobCategory1.getId(), "Developer"
            ), InterviewReviewStatus.NOT_LOGGED);

            given(spec)
            .when()
                    .get(path)
            .then()
                    .statusCode(200)
                    .body("code", equalTo(COMMON200.name()))
                    .body("result", hasSize(1))
                    .body("result[0].companyInfo.companyName", equalTo(company2.getName()));
        }

        @Test
        void NOT_LOGGED_상태의_면접만_조회된다() {
            createAndSaveInterview(new InterviewCreateRequest(
                    LocalDateTime.now(), InterviewType.FIRST, company1.getName(), industry1.getId(), jobCategory1.getId(), "Developer"
            ), InterviewReviewStatus.NOT_LOGGED);

            createAndSaveInterview(new InterviewCreateRequest(
                    LocalDateTime.now(), InterviewType.SECOND, company1.getName(), industry1.getId(), jobCategory1.getId(), "Engineer"
            ), InterviewReviewStatus.LOG_DRAFT);

            createAndSaveInterview(new InterviewCreateRequest(
                    LocalDateTime.now(), InterviewType.THIRD, company1.getName(), industry1.getId(), jobCategory1.getId(), "Manager"
            ), InterviewReviewStatus.QNA_SET_DRAFT);

            createAndSaveInterview(new InterviewCreateRequest(
                    LocalDateTime.now(), InterviewType.FIRST, company2.getName(), industry1.getId(), jobCategory1.getId(), "Manager"
            ), InterviewReviewStatus.DEBRIEF_COMPLETED);

            given(spec)
            .when()
                    .get(path)
            .then()
                    .statusCode(200)
                    .body("code", equalTo(COMMON200.name()))
                    .body("result", hasSize(1))
                    .body("result[0].interviewReviewStatus", equalTo(InterviewReviewStatus.NOT_LOGGED.name()));
        }

        @Test
        void 최근_한달_이내의_면접만_조회된다() {
            createAndSaveInterview(new InterviewCreateRequest(
                    LocalDateTime.now().minusDays(1), InterviewType.FIRST, company1.getName(), industry1.getId(), jobCategory1.getId(), "Developer"
            ), InterviewReviewStatus.NOT_LOGGED);

            createAndSaveInterview(new InterviewCreateRequest(
                    LocalDateTime.now().minusMonths(2), InterviewType.FIRST, company2.getName(), industry1.getId(), jobCategory1.getId(), "Developer"
            ), InterviewReviewStatus.NOT_LOGGED);

            given(spec)
            .when()
                    .get(path)
            .then()
                    .statusCode(200)
                    .body("code", equalTo(COMMON200.name()))
                    .body("result", hasSize(1))
                    .body("result[0].companyInfo.companyName", equalTo(company1.getName()));
        }
    }

    @Nested
    class 면접_임시저장_데이터를_조회할_때 {

        private final String path = "/interview/my/draft";

        private Company company1;
        private Company company2;

        @BeforeEach
        void createDraftData() {
            companyRepository.deleteAll();
            company1 = createAndSaveCompany("삼성전자");
            company2 = createAndSaveCompany("카카오");

            // 1. LOG_DRAFT (LOGGING)
            Interview logDraft = createAndSaveInterview(
                new InterviewCreateRequest(
                    LocalDateTime.of(2024, 5, 1, 10, 0, 0),
                    InterviewType.FIRST, company1.getName(), industry1.getId(), jobCategory1.getId(), "Developer"
                ), InterviewReviewStatus.LOG_DRAFT);

            // 2. QNA_SET_DRAFT (LOGGING)
            Interview qnaDraft = createAndSaveInterview(
                new InterviewCreateRequest(
                    LocalDateTime.of(2024, 5, 2, 10, 0, 0),
                    InterviewType.SECOND, company1.getName(), industry1.getId(), jobCategory1.getId(), "Developer"
                ), InterviewReviewStatus.QNA_SET_DRAFT);

            // 3. SELF_REVIEW_DRAFT (REVIEWING)
            Interview reviewDraft = createAndSaveInterview(
                new InterviewCreateRequest(
                    LocalDateTime.of(2024, 5, 3, 10, 0, 0),
                    InterviewType.THIRD, company2.getName(), industry1.getId(), jobCategory1.getId(), "Manager"
                ), InterviewReviewStatus.SELF_REVIEW_DRAFT);

            // 4. DEBRIEF_COMPLETED (Not in any draft)
            Interview completed = createAndSaveInterview(
                new InterviewCreateRequest(
                    LocalDateTime.of(2024, 5, 4, 10, 0, 0),
                    InterviewType.FIRST, company2.getName(), industry1.getId(), jobCategory1.getId(), "Manager"
                ), InterviewReviewStatus.DEBRIEF_COMPLETED);

            // 5. NOT_LOGGED (Not in any draft)
            Interview notLogged = createAndSaveInterview(
                new InterviewCreateRequest(
                    LocalDateTime.of(2024, 6, 1, 10, 0, 0),
                    InterviewType.FIRST, company1.getName(), industry1.getId(), jobCategory1.getId(), "Developer"
                ), InterviewReviewStatus.NOT_LOGGED);
        }

        @Test
        void LOGGING_타입으로_조회하면_기록중인_면접만_조회된다() {
            given(spec)
                    .contentType(MediaType.APPLICATION_JSON_VALUE)
                    .queryParam("interviewDraftType", InterviewDraftType.LOGGING)
            .when()
                    .get(path)
            .then()
                    .statusCode(200)
                    .body("code", equalTo(COMMON200.name()))
                    .body("result.content", hasSize(2))
                    .body("result.content[0].companyInfo.companyName", equalTo(company1.getName()))
                    .body("result.content[0].interviewReviewStatus", equalTo(InterviewReviewStatus.LOG_DRAFT.name()))
                    .body("result.content[1].companyInfo.companyName", equalTo(company1.getName()))
                    .body("result.content[1].interviewReviewStatus", equalTo(InterviewReviewStatus.QNA_SET_DRAFT.name()))
                    .body("result.totalElements", equalTo(2));
        }

        @Test
        void REVIEWING_타입으로_조회하면_회고중인_면접만_조회된다() {
            given(spec)
                    .contentType(MediaType.APPLICATION_JSON_VALUE)
                    .queryParam("interviewDraftType", InterviewDraftType.REVIEWING)
            .when()
                    .get(path)
            .then()
                    .statusCode(200)
                    .body("code", equalTo(COMMON200.name()))
                    .body("result.content", hasSize(1))
                    .body("result.content[0].companyInfo.companyName", equalTo(company2.getName()))
                    .body("result.content[0].interviewReviewStatus", equalTo(InterviewReviewStatus.SELF_REVIEW_DRAFT.name()))
                    .body("result.totalElements", equalTo(1));
        }
    }
}

package com.shyashyashya.refit.interview.integration;

import static com.shyashyashya.refit.domain.common.model.ResponseCode.COMMON200;
import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.in;
import static org.hamcrest.Matchers.notNullValue;
import static org.hamcrest.Matchers.hasSize;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import com.shyashyashya.refit.core.IntegrationTest;
import com.shyashyashya.refit.domain.interview.dto.request.InterviewCreateRequest;
import com.shyashyashya.refit.domain.interview.dto.request.InterviewSearchRequest;
import com.shyashyashya.refit.domain.interview.model.Interview;
import com.shyashyashya.refit.domain.interview.model.InterviewResultStatus;
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

    @Nested
    class 면접을_검색할_때 {

        private final String path = "/interview/my/search";

        private Company company1;
        private Company company2;
        private Company company3;
        private Company company4;

        @BeforeEach
        void createTestData() {
            company1 = createCompany("삼성전자");
            company2 = createCompany("카카오");
            company3 = createCompany("현대건설");
            company4 = createCompany("현대ICT본부");

            Interview interview1 = createInterview(
                new InterviewCreateRequest(
                    LocalDateTime.of(2023, 1, 10, 10, 0, 0), InterviewType.FIRST, company1.getName(), industry.getId(), jobCategory.getId(), "Developer"
                ));
            interview1.startLogging();
            interview1.completeLogging();
            interview1.completeReview();

            Interview interview2 = createInterview(
                new InterviewCreateRequest(
                    LocalDateTime.of(2023, 2, 15, 11, 0, 0), InterviewType.SECOND, company2.getName(), industry.getId(), jobCategory.getId(), "Engineer"
                ));
            interview2.startLogging();
            interview2.completeLogging();
            interview2.completeReview();
            interview2.updateResultStatus(InterviewResultStatus.PASS);

            Interview interview3 = createInterview(
                new InterviewCreateRequest(
                    LocalDateTime.of(2024, 3, 20, 12, 0, 0), InterviewType.THIRD, company3.getName(), industry.getId(), jobCategory.getId(), "Manager"
                ));
            interview3.startLogging();
            interview3.completeLogging();
            interview3.completeReview();
            interview3.updateResultStatus(InterviewResultStatus.FAIL);

            Interview interview4 = createInterview(
                new InterviewCreateRequest(
                    LocalDateTime.of(2024, 4, 25, 13, 0, 0), InterviewType.FIRST, company4.getName(), industry.getId(), jobCategory.getId(), "Developer"
                ));
            interview4.startLogging();
            interview4.completeLogging();
            interview4.completeReview();
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
                    null, new InterviewSearchRequest.InterviewSearchFilter(List.of(InterviewType.FIRST),
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
            InterviewSearchRequest request = new InterviewSearchRequest(null, new InterviewSearchRequest.InterviewSearchFilter(null, List.of(InterviewResultStatus.PASS), null, null));

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
                    List.of(InterviewType.FIRST), List.of(InterviewResultStatus.PASS),
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
            User otherUser = createUser("test2@exmaple.com", "test2", industry, jobCategory);
            Interview otherInterview = createInterview(
                    new InterviewCreateRequest(
                            LocalDateTime.of(2024, 4, 25, 13, 0, 0), InterviewType.FIRST, company.getName(), industry.getId(), jobCategory.getId(), "Developer"
                    ), otherUser);
            otherInterview.startLogging();
            otherInterview.completeLogging();
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
            createInterview(new InterviewCreateRequest(
                            LocalDateTime.of(2024, 4, 25, 13, 0, 0), InterviewType.FIRST, company.getName(), industry.getId(), jobCategory.getId(), "Developer"));

            Interview logDraftInterview = createInterview(new InterviewCreateRequest(
                    LocalDateTime.of(2024, 4, 25, 13, 0, 0), InterviewType.FIRST, company.getName(), industry.getId(), jobCategory.getId(), "Developer"));
            logDraftInterview.startLogging();

            Interview reviewDraftInterview = createInterview(new InterviewCreateRequest(
                    LocalDateTime.of(2024, 4, 25, 13, 0, 0), InterviewType.FIRST, company.getName(), industry.getId(), jobCategory.getId(), "Developer"));
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
    }
}

package com.shyashyashya.refit.core;

import static org.springframework.boot.test.context.SpringBootTest.WebEnvironment.RANDOM_PORT;

import com.shyashyashya.refit.domain.company.model.Company;
import com.shyashyashya.refit.domain.company.repository.CompanyRepository;
import com.shyashyashya.refit.domain.industry.model.Industry;
import com.shyashyashya.refit.domain.industry.repository.IndustryRepository;
import com.shyashyashya.refit.domain.interview.dto.request.InterviewCreateRequest;
import com.shyashyashya.refit.domain.interview.model.Interview;
import com.shyashyashya.refit.domain.interview.repository.InterviewRepository;
import com.shyashyashya.refit.domain.jobcategory.model.JobCategory;
import com.shyashyashya.refit.domain.jobcategory.repository.JobCategoryRepository;
import com.shyashyashya.refit.domain.user.model.User;
import com.shyashyashya.refit.domain.user.repository.UserRepository;
import com.shyashyashya.refit.global.auth.service.JwtUtil;
import com.shyashyashya.refit.global.constant.AuthConstant;
import io.restassured.RestAssured;
import io.restassured.builder.RequestSpecBuilder;
import io.restassured.http.ContentType;
import io.restassured.specification.RequestSpecification;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.hibernate.Session;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.test.context.ActiveProfiles;

import java.sql.ResultSet;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

@ActiveProfiles("test")
@SpringBootTest(webEnvironment = RANDOM_PORT)
public abstract class IntegrationTest {

    @LocalServerPort
    private Integer port;

    protected RequestSpecification spec;

    protected User requestUser;

    protected Company company;

    protected Industry industry;

    protected JobCategory jobCategory;

    @PersistenceContext
    private EntityManager em;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private IndustryRepository industryRepository;

    @Autowired
    private JobCategoryRepository jobCategoryRepository;

    @Autowired
    private InterviewRepository interviewRepository;

    @Autowired
    private CompanyRepository companyRepository;

    @BeforeEach
    void restAssuredSetUp() {
        clearDatabase();
        RestAssured.enableLoggingOfRequestAndResponseIfValidationFails();

        industry = industryRepository.save(Industry.create("제조업"));
        jobCategory = jobCategoryRepository.save(JobCategory.create("BE Developer"));
        company = companyRepository.save(Company.create("현대자동차", "logo", true));

        requestUser = createUser("test@example.com", "default", industry, jobCategory);
        String accessToken = jwtUtil.createAccessToken(requestUser.getEmail(), requestUser.getId());
        spec = new RequestSpecBuilder()
                .setPort(port)
                .addCookie(AuthConstant.ACCESS_TOKEN, accessToken)
                .setContentType(ContentType.JSON)
                .build();
    }

    private void clearDatabase() {
        em.clear();
        em.unwrap(Session.class).doWork((session) -> {
            Statement st = session.createStatement();
            st.executeUpdate("SET REFERENTIAL_INTEGRITY FALSE");

            // 모든 테이블 조회
            ResultSet rs = st.executeQuery("""
                SELECT TABLE_NAME, TABLE_SCHEMA, TABLE_TYPE
                  FROM INFORMATION_SCHEMA.TABLES
                 WHERE TABLE_SCHEMA = 'PUBLIC'
                   AND TABLE_TYPE = 'BASE TABLE'
            """);

            List<String> tableNames = new ArrayList<>();
            while (rs.next()) {
                tableNames.add(rs.getString(1));
            }

            for (String tableName : tableNames) {
                st.executeUpdate("TRUNCATE TABLE " + tableName);
            }

            st.executeUpdate("SET REFERENTIAL_INTEGRITY TRUE");
        });
    }

    protected User createUser(String email, String nickname, Industry industry, JobCategory jobCategory) {
        return userRepository.save(User.create(email, nickname, "imageUrl", false, industry, jobCategory));
    }

    protected Interview createInterview(InterviewCreateRequest request) {
        Company company = companyRepository.findByName(request.companyName()).get();
        Industry industry = industryRepository.findById(request.industryId()).get();
        JobCategory jobCategory = jobCategoryRepository.findById(request.jobCategoryId()).get();

        Interview interview = Interview.create(
                request.jobRole(),
                request.interviewType(),
                request.startAt(),
                requestUser,
                company,
                industry,
                jobCategory);
        return interviewRepository.save(interview);
    }

    protected Interview createInterview(InterviewCreateRequest request, User user) {
        Company company = companyRepository.findByName(request.companyName()).get();
        Industry industry = industryRepository.findById(request.industryId()).get();
        JobCategory jobCategory = jobCategoryRepository.findById(request.jobCategoryId()).get();

        Interview interview = Interview.create(
                request.jobRole(),
                request.interviewType(),
                request.startAt(),
                user,
                company,
                industry,
                jobCategory);
        return interviewRepository.save(interview);
    }
}

package com.shyashyashya.refit.integration.core;

import static org.springframework.boot.test.context.SpringBootTest.WebEnvironment.RANDOM_PORT;

import com.shyashyashya.refit.domain.company.model.Company;
import com.shyashyashya.refit.domain.company.repository.CompanyRepository;
import com.shyashyashya.refit.domain.industry.model.Industry;
import com.shyashyashya.refit.domain.industry.repository.IndustryRepository;
import com.shyashyashya.refit.domain.interview.dto.request.InterviewCreateRequest;
import com.shyashyashya.refit.domain.interview.dto.request.QnaSetCreateRequest;
import com.shyashyashya.refit.domain.interview.model.Interview;
import com.shyashyashya.refit.domain.interview.model.InterviewReviewStatus;
import com.shyashyashya.refit.domain.interview.repository.InterviewRepository;
import com.shyashyashya.refit.domain.jobcategory.model.JobCategory;
import com.shyashyashya.refit.domain.jobcategory.repository.JobCategoryRepository;
import com.shyashyashya.refit.domain.qnaset.dto.request.PdfHighlightingUpdateRequest;
import com.shyashyashya.refit.domain.qnaset.model.PdfHighlighting;
import com.shyashyashya.refit.domain.qnaset.model.PdfHighlightingRect;
import com.shyashyashya.refit.domain.qnaset.model.QnaSet;
import com.shyashyashya.refit.domain.qnaset.model.QnaSetCategory;
import com.shyashyashya.refit.domain.qnaset.repository.PdfHighlightingRectRepository;
import com.shyashyashya.refit.domain.qnaset.repository.PdfHighlightingRepository;
import com.shyashyashya.refit.domain.qnaset.repository.QnaSetCategoryRepository;
import com.shyashyashya.refit.domain.qnaset.repository.QnaSetRepository;
import com.shyashyashya.refit.domain.user.model.User;
import com.shyashyashya.refit.domain.user.repository.UserRepository;
import com.shyashyashya.refit.global.auth.service.JwtEncoder;
import com.shyashyashya.refit.global.config.TestQdrantConfig;
import com.shyashyashya.refit.global.constant.AuthConstant;
import com.shyashyashya.refit.global.util.HangulUtil;
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
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ActiveProfiles;

import java.sql.ResultSet;
import java.sql.Statement;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@ActiveProfiles("test")
@SpringBootTest(webEnvironment = RANDOM_PORT)
@Import(TestQdrantConfig.class)
public abstract class IntegrationTest {

    protected static final LocalDateTime NOW = LocalDateTime.of(2026, 2, 16, 10, 0, 0);
    protected static final DateTimeFormatter TIME_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss");

    @LocalServerPort
    protected Integer port;

    protected RequestSpecification spec;

    protected User requestUser;

    protected Industry industry1;
    protected Industry industry2;
    protected Industry industry3;
    protected JobCategory jobCategory1;
    protected JobCategory jobCategory2;
    protected JobCategory jobCategory3;
    protected Company company1;
    protected Company company2;
    protected Company company3;
    protected QnaSetCategory qnaSetCategory1;
    protected QnaSetCategory qnaSetCategory2;
    protected QnaSetCategory qnaSetCategory3;

    @PersistenceContext
    protected EntityManager em;

    @Autowired
    protected JwtEncoder jwtEncoder;

    @Autowired
    protected HangulUtil hangulUtil;

    @Autowired
    protected UserRepository userRepository;

    @Autowired
    private IndustryRepository industryRepository;

    @Autowired
    private JobCategoryRepository jobCategoryRepository;

    @Autowired
    private InterviewRepository interviewRepository;

    @Autowired
    private CompanyRepository companyRepository;

    @Autowired
    private QnaSetRepository qnaSetRepository;

    @Autowired
    private PdfHighlightingRepository pdfHighlightingRepository;

    @Autowired
    private PdfHighlightingRectRepository pdfHighlightingRectRepository;

    @Autowired
    private QnaSetCategoryRepository qnaSetCategoryRepository;

    @BeforeEach
    void restAssuredSetUp() {
        clearDatabase();
        RestAssured.enableLoggingOfRequestAndResponseIfValidationFails();

        industry1 = industryRepository.save(Industry.create("제조업"));
        industry2 = industryRepository.save(Industry.create("IT"));
        industry3 = industryRepository.save(Industry.create("유통"));
        jobCategory1 = jobCategoryRepository.save(JobCategory.create("BE Developer"));
        jobCategory2 = jobCategoryRepository.save(JobCategory.create("FE Developer"));
        jobCategory3 = jobCategoryRepository.save(JobCategory.create("Designer"));
        company1 = createAndSaveCompany("현대자동차", "logo1.jpg");
        company2 = createAndSaveCompany("카카오", "logo2.png");
        company3 = createAndSaveCompany("네이버", "logo3.svg");
        qnaSetCategory1 = qnaSetCategoryRepository.save(QnaSetCategory.create("리더십 질문", "당신은 리더십있는 사람입니까?", 3.141592));
        qnaSetCategory2 = qnaSetCategoryRepository.save(QnaSetCategory.create("인성 질문", "당신은 인성이 좋은 사람입니까?", 2.145));
        qnaSetCategory3 = qnaSetCategoryRepository.save(QnaSetCategory.create("기술 질문", "당신은 기술 있는 사람입니까?", 0.001));

        requestUser = createAndSaveUser("test@example.com", "default", industry1, jobCategory1);
        Instant issuedAt = Instant.now();
        String accessToken = jwtEncoder.encodeAccessJwt(requestUser.getEmail(), requestUser.getId(), issuedAt);
        String refreshToken = jwtEncoder.encodeRefreshJwt(requestUser.getEmail(), requestUser.getId(), issuedAt);
        spec = new RequestSpecBuilder()
                .setPort(port)
                .addCookie(AuthConstant.ACCESS_TOKEN, accessToken)
                .addCookie(AuthConstant.REFRESH_TOKEN, refreshToken)
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

    protected User createAndSaveUser(String email, String nickname, Industry industry, JobCategory jobCategory) {
        return userRepository.save(User.create(email, nickname, "imageUrl", false, industry, jobCategory));
    }

    protected Interview createAndSaveInterview(InterviewCreateRequest request) {
        return createAndSaveInterview(request, InterviewReviewStatus.NOT_LOGGED, requestUser);
    }

    protected Interview createAndSaveInterview(InterviewCreateRequest request, InterviewReviewStatus reviewStatus) {
        return createAndSaveInterview(request, reviewStatus, requestUser);
    }

    protected Interview createAndSaveInterview(InterviewCreateRequest request, InterviewReviewStatus reviewStatus,
            User user) {
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

        switch (reviewStatus) {
            case LOG_DRAFT:
                interview.startLogging();
                break;
            case QNA_SET_DRAFT:
                interview.startLogging();
                interview.completeLogging();
                break;
            case SELF_REVIEW_DRAFT:
                interview.startLogging();
                interview.completeLogging();
                interview.completeQnaSetDraft();
                break;
            case DEBRIEF_COMPLETED:
                interview.startLogging();
                interview.completeLogging();
                interview.completeQnaSetDraft();
                interview.completeReview();
                break;
        }

        return interviewRepository.save(interview);
    }

    protected Company createAndSaveCompany(String companyName) {
        Company company = Company.create(companyName, hangulUtil.decompose(companyName), "logo.url");
        company.allowSearch();
        return companyRepository.save(company);
    }

    protected Company createAndSaveCompany(String companyName, String logoUrl) {
        Company company = Company.create(companyName, hangulUtil.decompose(companyName), logoUrl);
        company.allowSearch();
        return companyRepository.save(company);
    }

    protected Industry createAndSaveIndustry(String industryName) {
        Industry industry = Industry.create(industryName);
        return industryRepository.save(industry);
    }

    protected JobCategory createAndSaveJobCategory(String jobCategoryName) {
        JobCategory jobCategory = JobCategory.create(jobCategoryName);
        return jobCategoryRepository.save(jobCategory);
    }

    protected QnaSet createAndSaveQnaSet(QnaSetCreateRequest request, Interview interview) {
        return createAndSaveQnaSet(request, interview, false);
    }

    protected QnaSet createAndSaveQnaSet(QnaSetCreateRequest request, Interview interview, boolean isMarkedDifficult) {
        QnaSet qnaSet = QnaSet.create(
                request.questionText(),
                request.answerText(),
                isMarkedDifficult,
                interview,
                null);

        return qnaSetRepository.save(qnaSet);
    }

    protected QnaSet createAndSaveQnaSet(QnaSetCreateRequest request, Interview interview,
            QnaSetCategory qnaSetCategory) {
        QnaSet qnaSet = QnaSet.create(
                request.questionText(),
                request.answerText(),
                false,
                interview,
                qnaSetCategory);

        return qnaSetRepository.save(qnaSet);
    }

    protected List<PdfHighlighting> createAndSavePdfHighlighting(List<PdfHighlightingUpdateRequest> requests,
            QnaSet qnaSet) {
        List<PdfHighlighting> result = new ArrayList<>();

        requests.forEach(request -> {
            PdfHighlighting pdfHighlighting = PdfHighlighting.create(request.highlightingText(), qnaSet);
            result.add(pdfHighlightingRepository.save(pdfHighlighting));

            request.rects().forEach(
                    rectDto -> {
                        PdfHighlightingRect rect = PdfHighlightingRect.create(
                                rectDto.x(),
                                rectDto.y(),
                                rectDto.width(),
                                rectDto.height(),
                                rectDto.pageNumber(),
                                pdfHighlighting);

                        pdfHighlightingRectRepository.save(rect);
                    });
        });

        return result;
    }
}

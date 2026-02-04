package com.shyashyashya.refit.core;

import static org.springframework.boot.test.context.SpringBootTest.WebEnvironment.RANDOM_PORT;

import com.shyashyashya.refit.domain.industry.model.Industry;
import com.shyashyashya.refit.domain.industry.repository.IndustryRepository;
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
import org.junit.jupiter.api.BeforeEach;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.test.context.ActiveProfiles;

@ActiveProfiles("test")
@SpringBootTest(webEnvironment = RANDOM_PORT)
public abstract class IntegrationTest {

    @LocalServerPort
    private Integer port;

    protected RequestSpecification spec;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private IndustryRepository industryRepository;

    @Autowired
    private JobCategoryRepository jobCategoryRepository;

    @BeforeEach
    void restAssuredSetUp() {
        RestAssured.enableLoggingOfRequestAndResponseIfValidationFails();
        Industry industry = industryRepository.save(Industry.create("HyunDai"));
        JobCategory jobCategory = jobCategoryRepository.save(JobCategory.create("BE Developer"));

        User user = createUser("test@example.com", industry, jobCategory);
        String accessToken = jwtUtil.createAccessToken(user.getEmail(), user.getId());
        spec = new RequestSpecBuilder()
                .setPort(port)
                .addCookie(AuthConstant.ACCESS_TOKEN, accessToken)
                .setContentType(ContentType.JSON)
                .build();
    }

    private User createUser(String email, Industry industry, JobCategory jobCategory) {
        return userRepository.save(User.create(email, "nickname", "imageUrl", false, industry, jobCategory));
    }
}

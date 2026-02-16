package com.shyashyashya.refit.unit.fixture;

import static com.shyashyashya.refit.unit.fixture.CompanyFixture.TEST_COMPANY;
import static com.shyashyashya.refit.unit.fixture.IndustryFixture.TEST_INDUSTRY;
import static com.shyashyashya.refit.unit.fixture.JobCategoryFixture.TEST_JOB_CATEGORY;
import static com.shyashyashya.refit.unit.fixture.UserFixture.TEST_USER_1;

import com.shyashyashya.refit.domain.interview.model.Interview;
import com.shyashyashya.refit.domain.interview.model.InterviewType;
import java.time.LocalDateTime;

public class InterviewFixture {

    public static Interview create_NOT_LOGGED_STATUS_INTERVIEW() {
        return Interview.create(
                null,
                InterviewType.BEHAVIORAL,
                LocalDateTime.of(2024, 1, 1, 1, 0, 0),
                TEST_USER_1,
                TEST_COMPANY,
                TEST_INDUSTRY,
                TEST_JOB_CATEGORY);
    }

    public static Interview create_QNA_SET_DRAFT_STATUS_INTERVIEW() {
        Interview interview = Interview.create(
                null,
                InterviewType.BEHAVIORAL,
                LocalDateTime.of(2024, 1, 1, 1, 0, 0),
                TEST_USER_1,
                TEST_COMPANY,
                TEST_INDUSTRY,
                TEST_JOB_CATEGORY);
        interview.startLogging();
        interview.completeLogging();

        return interview;
    }

    public static final Interview TEST_USER_1_INTERVIEW = Interview.create(
            null,
            InterviewType.BEHAVIORAL,
            LocalDateTime.of(2024, 1, 1, 1, 0, 0),
            TEST_USER_1,
            TEST_COMPANY,
            TEST_INDUSTRY,
            TEST_JOB_CATEGORY);
}

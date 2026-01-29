package com.shyashyashya.refit.fixture;

import static com.shyashyashya.refit.fixture.CompanyFixture.TEST_COMPANY;
import static com.shyashyashya.refit.fixture.IndustryFixture.TEST_INDUSTRY;
import static com.shyashyashya.refit.fixture.JobCategoryFixture.TEST_JOB_CATEGORY;
import static com.shyashyashya.refit.fixture.UserFixture.TEST_USER_1;

import com.shyashyashya.refit.domain.interview.model.Interview;
import com.shyashyashya.refit.domain.interview.model.InterviewResultStatus;
import com.shyashyashya.refit.domain.interview.model.InterviewReviewStatus;
import com.shyashyashya.refit.domain.interview.model.InterviewType;
import java.time.LocalDateTime;

public class InterviewFixture {

    public static final Interview TEST_USER_1_INTERVIEW = Interview.create(
            null,
            InterviewReviewStatus.NOT_LOGGED,
            InterviewResultStatus.WAIT,
            InterviewType.BEHAVIORAL,
            LocalDateTime.of(2024, 1, 1, 1, 0, 0),
            "interview raw text",
            "test.com/test.pdf",
            TEST_USER_1,
            TEST_COMPANY,
            TEST_INDUSTRY,
            TEST_JOB_CATEGORY);
}

package com.shyashyashya.refit.fixture;

import static com.shyashyashya.refit.fixture.IndustryFixture.TEST_INDUSTRY;
import static com.shyashyashya.refit.fixture.JobCategoryFixture.TEST_JOB_CATEGORY;

import com.shyashyashya.refit.domain.user.model.User;

public class UserFixture {

    public static final User TEST_USER_1 =
            User.create("test@email.com", "test", "test.com/test.png", true, TEST_INDUSTRY, TEST_JOB_CATEGORY);

    public static final User TEST_USER_2 =
            User.create("test2@email.com", "test2", "test.com/test2.png", true, TEST_INDUSTRY, TEST_JOB_CATEGORY);
}

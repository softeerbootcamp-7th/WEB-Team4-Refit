package com.shyashyashya.refit.fixture;

import static com.shyashyashya.refit.fixture.UserFixture.TEST_USER_1;

import com.shyashyashya.refit.domain.scrapfolder.model.ScrapFolder;

public class ScrapFolderFixture {

    public static final ScrapFolder TEST_USER_1_SCRAP_FOLDER = ScrapFolder.create(
        "소중한 스크랩 폴더",
        TEST_USER_1
    );

}

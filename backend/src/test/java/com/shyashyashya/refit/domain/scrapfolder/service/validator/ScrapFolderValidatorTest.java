package com.shyashyashya.refit.domain.scrapfolder.service.validator;

import static com.shyashyashya.refit.fixture.ScrapFolderFixture.TEST_USER_1_SCRAP_FOLDER;
import static com.shyashyashya.refit.fixture.UserFixture.TEST_USER_1;
import static com.shyashyashya.refit.fixture.UserFixture.TEST_USER_2;
import static com.shyashyashya.refit.global.exception.ErrorCode.SCRAP_FOLDER_NOT_ACCESSIBLE;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;

import com.shyashyashya.refit.domain.scrapfolder.repository.ScrapFolderRepository;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class ScrapFolderValidatorTest {

    @Mock
    private ScrapFolderRepository scrapFolderRepository;

    @InjectMocks
    private ScrapFolderValidator scrapFolderValidator;

    @Test
    void 스크랩_폴더_소유자와_검증_대상_사용자가_같으면_검증에_성공한다() {
        // given

        // when & then
        Assertions.assertThatNoException().isThrownBy(() ->
            scrapFolderValidator.validateScrapFolderOwner(
                    TEST_USER_1_SCRAP_FOLDER,
                    TEST_USER_1
        ));

        verifyNoInteractions(scrapFolderRepository);
    }

    @Test
    void 스크랩_폴더_소유자와_검증_대상_사용자가_다르면_검증에_실패한다() {
        // given

        // when & then
        Assertions.assertThatThrownBy(() ->
            scrapFolderValidator.validateScrapFolderOwner(
                    TEST_USER_1_SCRAP_FOLDER,
                    TEST_USER_2
            )).hasMessage(SCRAP_FOLDER_NOT_ACCESSIBLE.getMessage());

        verifyNoInteractions(scrapFolderRepository);
    }

    @Test
    void 스크랩_폴더_이름이_검증_대상_사용자가_소유한_스크랩_폴더들과_중복되지_않는다() {
        // given
        given(scrapFolderRepository.existsByNameAndUser(any(), any()))
            .willReturn(false);

        // when & then
        Assertions.assertThatNoException().isThrownBy(() ->
            scrapFolderValidator.validateScrapFolderNameNotDuplicated(
                    TEST_USER_1_SCRAP_FOLDER.getName(),
                    TEST_USER_1
            ));

        verify(scrapFolderRepository, times(1))
                .existsByNameAndUser(TEST_USER_1_SCRAP_FOLDER.getName(), TEST_USER_1);
    }

    @Test
    void 스크랩_폴더_이름이_검증_대상_사용자가_소유한_스크랩_폴더들과_중복된다() {
        // given
        given(scrapFolderRepository.existsByNameAndUser(any(), any()))
            .willReturn(true);

        // when & then
        Assertions.assertThatThrownBy(() ->
            scrapFolderValidator.validateScrapFolderNameNotDuplicated(
                TEST_USER_1_SCRAP_FOLDER.getName(),
                TEST_USER_1
            ));

        verify(scrapFolderRepository, times(1))
            .existsByNameAndUser(TEST_USER_1_SCRAP_FOLDER.getName(), TEST_USER_1);
    }
}
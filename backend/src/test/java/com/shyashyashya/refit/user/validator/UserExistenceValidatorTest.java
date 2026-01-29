package com.shyashyashya.refit.user.validator;

import static com.shyashyashya.refit.fixture.UserFixture.TEST_USER_1;
import static com.shyashyashya.refit.global.exception.ErrorCode.USER_SIGNUP_EMAIL_CONFLICT;
import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

import com.shyashyashya.refit.domain.user.repository.UserRepository;
import com.shyashyashya.refit.domain.user.service.validator.UserExistenceValidator;
import com.shyashyashya.refit.global.exception.CustomException;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class UserExistenceValidatorTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserExistenceValidator userExistenceValidator;

    @Test
    void 사용자가_존재하지_않으면_USER_SIGNUP_EMAIL_CONFLICT_예외가_발생한다() {
        // given
        Long userId = 1L;
        // Optional.empty()를 반환하여 사용자가 없는 상황을 모킹
        given(userRepository.findById(userId)).willReturn(Optional.empty());

        // when & then
        CustomException exception =
                assertThrows(CustomException.class, () -> userExistenceValidator.validateUserExists(userId));

        assertEquals(USER_SIGNUP_EMAIL_CONFLICT, exception.getErrorCode());
        verify(userRepository, times(1)).findById(userId);
    }

    @Test
    void 사용자가_존재하면_예외가_발생하지_않고_정상_종료된다() {
        // given
        // TEST_USER_1의 ID가 1L이라고 가정하거나, 실제 ID를 추출하여 사용
        Long userId = 1L;
        given(userRepository.findById(userId)).willReturn(Optional.of(TEST_USER_1));

        // when & then
        assertDoesNotThrow(() -> userExistenceValidator.validateUserExists(userId));

        verify(userRepository, times(1)).findById(userId);
    }
}

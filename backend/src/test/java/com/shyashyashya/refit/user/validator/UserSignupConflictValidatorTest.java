package com.shyashyashya.refit.user.validator;

import static com.shyashyashya.refit.fixture.UserFixture.TEST_USER_1;
import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

import com.shyashyashya.refit.domain.user.repository.UserRepository;
import com.shyashyashya.refit.domain.user.service.validator.UserSignupConflictValidator;
import com.shyashyashya.refit.global.exception.CustomException;
import com.shyashyashya.refit.global.exception.ErrorCode;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class UserSignupConflictValidatorTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserSignupConflictValidator userSignupConflictValidator;

    @Test
    void 이메일이_이미_존재하면_USER_SIGNUP_EMAIL_CONFLICT_예외가_발생한다() {
        // given
        String email = TEST_USER_1.getEmail();

        // userRepository.findByEmail 호출 시 존재하는 객체를 담은 Optional 반환 설정
        given(userRepository.findByEmail(email)).willReturn(Optional.of(TEST_USER_1));

        // when & then
        CustomException exception =
                assertThrows(CustomException.class, () -> userSignupConflictValidator.validateEmailConflict(email));

        assertEquals(ErrorCode.USER_SIGNUP_EMAIL_CONFLICT, exception.getErrorCode());
        verify(userRepository, times(1)).findByEmail(email);
    }

    @Test
    void 이메일이_존재하지_않으면_예외가_발생하지_않는다() {
        // given
        String email = "new-user@example.com";

        // userRepository.findByEmail 호출 시 빈 Optional 반환 설정
        given(userRepository.findByEmail(email)).willReturn(Optional.empty());

        // when & then
        assertDoesNotThrow(() -> userSignupConflictValidator.validateEmailConflict(email));

        verify(userRepository, times(1)).findByEmail(email);
    }
}

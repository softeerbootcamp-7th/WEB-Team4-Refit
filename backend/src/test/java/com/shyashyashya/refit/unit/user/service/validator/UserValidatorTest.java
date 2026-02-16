package com.shyashyashya.refit.unit.user.service.validator;

import static com.shyashyashya.refit.unit.fixture.UserFixture.TEST_USER_1;
import static com.shyashyashya.refit.global.exception.ErrorCode.USER_NICKNAME_CONFLICT;
import static com.shyashyashya.refit.global.exception.ErrorCode.USER_SIGNUP_EMAIL_CONFLICT;
import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

import com.shyashyashya.refit.domain.user.repository.UserRepository;
import com.shyashyashya.refit.domain.user.service.validator.UserValidator;
import com.shyashyashya.refit.global.exception.CustomException;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class UserValidatorTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserValidator userValidator;

    @Test
    void 이메일이_이미_존재하면_USER_SIGNUP_EMAIL_CONFLICT_예외가_발생한다() {
        // given
        String email = TEST_USER_1.getEmail();
        given(userRepository.findByEmail(email)).willReturn(Optional.of(TEST_USER_1));

        // when & then
        CustomException exception =
                assertThrows(CustomException.class, () -> userValidator.validateEmailNotConflict(email));

        assertEquals(USER_SIGNUP_EMAIL_CONFLICT, exception.getErrorCode());
        verify(userRepository, times(1)).findByEmail(email);
    }

    @Test
    void 이메일이_존재하지_않으면_예외가_발생하지_않는다() {
        // given
        String email = "new-user@example.com";
        given(userRepository.findByEmail(email)).willReturn(Optional.empty());

        // when & then
        assertDoesNotThrow(() -> userValidator.validateEmailNotConflict(email));
        verify(userRepository, times(1)).findByEmail(email);
    }

    @Test
    void 닉네임이_이미_존재하면_USER_NICKNAME_CONFLICT_예외가_발생한다() {
        // given
        String nickname = "duplicate_nickname";
        // existsByNickname이 true를 반환하도록 스텁 설정
        given(userRepository.existsByNickname(nickname)).willReturn(true);

        // when & then
        CustomException exception =
                assertThrows(CustomException.class, () -> userValidator.validateNicknameNotConflict(nickname));

        assertEquals(USER_NICKNAME_CONFLICT, exception.getErrorCode());
        verify(userRepository, times(1)).existsByNickname(nickname);
    }

    @Test
    void 닉네임이_존재하지_않으면_예외가_발생하지_않는다() {
        // given
        String nickname = "unique_nickname";
        // existsByNickname이 false를 반환하도록 스텁 설정
        given(userRepository.existsByNickname(nickname)).willReturn(false);

        // when & then
        assertDoesNotThrow(() -> userValidator.validateNicknameNotConflict(nickname));
        verify(userRepository, times(1)).existsByNickname(nickname);
    }
}

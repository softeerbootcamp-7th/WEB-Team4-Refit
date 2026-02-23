package com.shyashyashya.refit.unit.user.service;

import static com.shyashyashya.refit.global.exception.ErrorCode.INDUSTRY_NOT_FOUND;
import static com.shyashyashya.refit.global.exception.ErrorCode.JOB_CATEGORY_NOT_FOUND;
import static com.shyashyashya.refit.global.exception.ErrorCode.USER_SIGNUP_EMAIL_CONFLICT;
import static org.assertj.core.api.AssertionsForClassTypes.assertThatCode;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doThrow;
import static com.shyashyashya.refit.unit.fixture.IndustryFixture.TEST_INDUSTRY;
import static com.shyashyashya.refit.unit.fixture.JobCategoryFixture.TEST_JOB_CATEGORY;
import static com.shyashyashya.refit.unit.fixture.UserFixture.TEST_USER_1;
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.willThrow;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

import com.shyashyashya.refit.domain.industry.model.Industry;
import com.shyashyashya.refit.domain.industry.repository.IndustryRepository;
import com.shyashyashya.refit.domain.jobcategory.model.JobCategory;
import com.shyashyashya.refit.domain.jobcategory.repository.JobCategoryRepository;
import com.shyashyashya.refit.domain.user.dto.request.MyProfileUpdateRequest;
import com.shyashyashya.refit.domain.user.dto.request.UserSignUpRequest;
import com.shyashyashya.refit.domain.user.dto.response.MyProfileResponse;
import com.shyashyashya.refit.domain.user.model.User;
import com.shyashyashya.refit.domain.user.repository.UserRepository;
import com.shyashyashya.refit.domain.user.service.UserService;
import com.shyashyashya.refit.domain.user.service.validator.UserValidator;
import com.shyashyashya.refit.global.auth.dto.TokenPairDto;
import com.shyashyashya.refit.global.auth.service.JwtService;
import com.shyashyashya.refit.global.exception.CustomException;
import com.shyashyashya.refit.global.exception.ErrorCode;
import com.shyashyashya.refit.global.util.RequestUserContext;
import java.util.Optional;
import java.util.stream.Stream;

import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private JwtService jwtService;

    @Mock
    private UserRepository userRepository;

    @Mock
    private IndustryRepository industryRepository;

    @Mock
    private JobCategoryRepository jobCategoryRepository;

    @Mock
    private UserValidator userValidator;

    @Mock
    private RequestUserContext requestUserContext;

    @InjectMocks
    private UserService userService;

    @Nested
    class 회원가입 {

        @Test
        void 회원가입_성공시_토큰을_발급한다() {
            // given
            UserSignUpRequest request = new UserSignUpRequest(
                    "nickname",
                    "profile.jpg",
                    1L,
                    1L);
            TokenPairDto tokenPair = new TokenPairDto("access", "refresh");

            given(industryRepository.findById(anyLong())).willReturn(Optional.of(TEST_INDUSTRY));
            given(jobCategoryRepository.findById(anyLong())).willReturn(Optional.of(TEST_JOB_CATEGORY));
            given(requestUserContext.getEmail()).willReturn("test@email.com");
            given(jwtService.publishTokenPair(anyString(), any())).willReturn(tokenPair);

            // when
            TokenPairDto result = userService.signUp(request);

            // then
            assertThat(result).isEqualTo(tokenPair);
            verify(userRepository, times(1)).save(any(User.class));
            verify(userValidator, times(1)).validateEmailNotConflict(anyString());
        }

        @Test
        void 존재하지_않는_산업군이면_예외가_발생한다() {
            // given
            UserSignUpRequest request = new UserSignUpRequest(
                    "nickname",
                    "profile.jpg",
                    999L,
                    1L);

            given(industryRepository.findById(anyLong())).willReturn(Optional.empty());

            // when & then
            assertThatThrownBy(() -> userService.signUp(request))
                    .isInstanceOf(CustomException.class)
                    .hasFieldOrPropertyWithValue("errorCode", INDUSTRY_NOT_FOUND);
        }

        @Test
        void 존재하지_않는_직군이면_예외가_발생한다() {
            // given
            UserSignUpRequest request = new UserSignUpRequest(
                    "nickname",
                    "profile.jpg",
                    1L,
                    999L);

            given(industryRepository.findById(anyLong())).willReturn(Optional.of(TEST_INDUSTRY));
            given(jobCategoryRepository.findById(anyLong())).willReturn(Optional.empty());

            // when & then
            assertThatThrownBy(() -> userService.signUp(request))
                    .isInstanceOf(CustomException.class)
                    .hasFieldOrPropertyWithValue("errorCode", JOB_CATEGORY_NOT_FOUND);
        }

        @Test
        void 이메일이_중복되면_예외가_발생한다() {
            // given
            UserSignUpRequest request = new UserSignUpRequest(
                    "nickname",
                    "profile.jpg",
                    1L,
                    1L);

            given(industryRepository.findById(anyLong())).willReturn(Optional.of(TEST_INDUSTRY));
            given(jobCategoryRepository.findById(anyLong())).willReturn(Optional.of(TEST_JOB_CATEGORY));
            given(requestUserContext.getEmail()).willReturn("duplicate@email.com");
            willThrow(new CustomException(USER_SIGNUP_EMAIL_CONFLICT))
                    .given(userValidator).validateEmailNotConflict(anyString());

            // when & then
            assertThatThrownBy(() -> userService.signUp(request))
                    .isInstanceOf(CustomException.class)
                    .hasFieldOrPropertyWithValue("errorCode", USER_SIGNUP_EMAIL_CONFLICT);
        }
    }

    @Nested
    class 약관_동의 {

        @Test
        void 약관_동의_상태를_변경한다() {
            // given
            User user = mock(User.class);
            given(requestUserContext.getRequestUser()).willReturn(user);

            // when
            userService.agreeToTerms();

            // then
            verify(userValidator, times(1)).validateUserNotAgreedToTerms(user);
            verify(user, times(1)).agreeToTerms();
        }

        @Test
        void 이미_동의한_경우_예외가_발생한다() {
            // given
            User user = mock(User.class);
            given(requestUserContext.getRequestUser()).willReturn(user);
            doThrow(new CustomException(ErrorCode.USER_ALREADY_AGREED_TO_TERMS))
                    .when(userValidator).validateUserNotAgreedToTerms(user);

            // when & then
            assertThatThrownBy(() -> userService.agreeToTerms())
                    .isInstanceOf(CustomException.class)
                    .hasFieldOrPropertyWithValue("errorCode", ErrorCode.USER_ALREADY_AGREED_TO_TERMS);
        }
    }

    @Nested
    class 프로필_조회 {

        @Test
        void 내_프로필_정보를_조회한다() {
            // given
            given(requestUserContext.getRequestUser()).willReturn(TEST_USER_1);

            // when
            MyProfileResponse response = userService.getMyProfileInfo();

            // then
            assertThat(response.nickname()).isEqualTo(TEST_USER_1.getNickname());
            assertThat(response.profileImageUrl()).isEqualTo(TEST_USER_1.getProfileImageUrl());
            assertThat(response.isAgreedToTerms()).isEqualTo(TEST_USER_1.isAgreedToTerms());
            assertThat(response.industryId()).isEqualTo(TEST_USER_1.getIndustry().getId());
            assertThat(response.jobCategoryId()).isEqualTo(TEST_USER_1.getJobCategory().getId());
        }
    }

    @Nested
    class 프로필_수정 {

        @Test
        void 프로필_정보를_수정한다() {
            // given
            MyProfileUpdateRequest request = new MyProfileUpdateRequest(
                    "newNickname",
                    1L,
                    1L);
            User user = mock(User.class);

            given(requestUserContext.getRequestUser()).willReturn(user);
            given(industryRepository.findById(anyLong())).willReturn(Optional.of(TEST_INDUSTRY));
            given(jobCategoryRepository.findById(anyLong())).willReturn(Optional.of(TEST_JOB_CATEGORY));

            // when
            userService.updateMyProfile(request);

            // then
            verify(user, times(1)).updateMyPage(anyString(), any(), any());
        }

        static Stream<Arguments> profileUpdateRequestCases() {
            return Stream.of(
                    Arguments.of(null, null, null),
                    Arguments.of(null, null, 2L),
                    Arguments.of(null, 1L, null),
                    Arguments.of(null, 1L, 2L),
                    Arguments.of("nick", null, null),
                    Arguments.of("nick", null, 2L),
                    Arguments.of("nick", 1L, null),
                    Arguments.of("nick", 1L, 2L)
            );
        }

        @ParameterizedTest(name = "[{index}] nickname={0}, industryId={1}, jobCategoryId={2}")
        @MethodSource("profileUpdateRequestCases")
        void 프로필_정보_수정시_null_조합에_따라_해당_필드만_처리된다(
                String nickname,
                Long industryId,
                Long jobCategoryId
        ) {
            // given
            MyProfileUpdateRequest request = new MyProfileUpdateRequest(nickname, industryId, jobCategoryId);
            User user = mock(User.class);
            given(requestUserContext.getRequestUser()).willReturn(user);
            if (industryId != null) {
                given(industryRepository.findById(industryId)).willReturn(Optional.of(mock(Industry.class)));
            }
            if (jobCategoryId != null) {
                given(jobCategoryRepository.findById(jobCategoryId)).willReturn(Optional.of(mock(JobCategory.class)));
            }

            // when
            userService.updateMyProfile(request);

            // then
            if (industryId != null) {
                verify(industryRepository, times(1)).findById(industryId);
            } else {
                verify(industryRepository, never()).findById(anyLong());
            }
            if (jobCategoryId != null) {
                verify(jobCategoryRepository, times(1)).findById(jobCategoryId);
            } else {
                verify(jobCategoryRepository, never()).findById(anyLong());
            }

            verify(user, times(1)).updateMyPage(eq(nickname), any(), any());
        }

        @Test
        void 존재하지_않는_산업군으로_수정하면_예외가_발생한다() {
            // given
            MyProfileUpdateRequest request = new MyProfileUpdateRequest(
                    "newNickname",
                    999L,
                    1L);
            given(requestUserContext.getRequestUser()).willReturn(TEST_USER_1);
            given(industryRepository.findById(anyLong())).willReturn(Optional.empty());

            // when & then
            assertThatThrownBy(() -> userService.updateMyProfile(request))
                    .isInstanceOf(CustomException.class)
                    .hasFieldOrPropertyWithValue("errorCode", INDUSTRY_NOT_FOUND);
        }

        @Test
        void 닉네임_중복을_허용한다() {
            // given
            MyProfileUpdateRequest request = new MyProfileUpdateRequest(
                    "duplicateNickname",
                    1L,
                    1L);
            given(requestUserContext.getRequestUser()).willReturn(TEST_USER_1);
            given(industryRepository.findById(anyLong())).willReturn(Optional.of(TEST_INDUSTRY));
            given(jobCategoryRepository.findById(anyLong())).willReturn(Optional.of(TEST_JOB_CATEGORY));

            // when & then
            assertThatCode(() -> userService.updateMyProfile(request))
                    .doesNotThrowAnyException();
        }
    }
}
